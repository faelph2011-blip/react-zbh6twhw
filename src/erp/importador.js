// ============================================================
// IMPORTADOR DE HISTÓRICO (planilha de vendas/clientes)
// Lê o CSV exportado da planilha, aplica a regra de desconto por
// quantidade (mesmo cliente/mesmo dia) e monta um "plano" de
// importação: clientes, pedidos, recebimentos e o consumo de
// insumos (backflush) das vendas. NÃO grava nada — quem grava é o
// store, depois que o dono confere a prévia.
// ============================================================

// Texto do produto na planilha → id no catálogo.
export const PROD_MAP = {
  "TRADICIONAL INDIVIDUAL": "ind",
  "TRADICIONAL MEDIO": "med",
  "TRADICIONAL GRANDE": "gra",
  "NINHO COM NUTELA": "nutella",
  "NINHO COM NUTELLA": "nutella",
  "NINHO COM FRUTAS VERMELHAS": "frutas",
  "NINHO COM FRUTAS": "frutas",
};

// Regra de desconto por quantidade (mesmo cliente/mesmo dia):
// a partir de `min` unidades, cada uma sai pelo `preco`.
const DESCONTO = {
  ind: { min: 2, preco: 10 },
  nutella: { min: 2, preco: 15 },
  frutas: { min: 2, preco: 15 },
};

// Nomes genéricos = clientes não identificáveis (várias pessoas sob o mesmo rótulo).
const GENERICOS = new Set(["PASSAGEIRO UBER", "CLIENTE ALEATORIO SEM DADOS", "IFOOD", "CONSUMIDOR", ""]);

export const norm = (s) =>
  (s || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toUpperCase().replace(/\s+/g, " ");

// -------- Parser de CSV (detecta separador , ou ; e trata aspas) --------
export function parseCSV(texto) {
  const t = (texto || "").replace(/\r\n?/g, "\n").replace(/^﻿/, "");
  const linhas = t.split("\n").filter((l) => l.length > 0);
  if (!linhas.length) return [];
  const sep = (linhas[0].match(/;/g) || []).length > (linhas[0].match(/,/g) || []).length ? ";" : ",";
  const out = [];
  for (const linha of linhas) {
    const campos = [];
    let cur = "", dentro = false;
    for (let i = 0; i < linha.length; i++) {
      const c = linha[i];
      if (c === '"') {
        if (dentro && linha[i + 1] === '"') { cur += '"'; i++; }
        else dentro = !dentro;
      } else if (c === sep && !dentro) { campos.push(cur); cur = ""; }
      else cur += c;
    }
    campos.push(cur);
    out.push(campos.map((x) => x.trim()));
  }
  return out;
}

// Converte uma data da planilha (yyyy-mm-dd ou dd/mm/aaaa) em ISO yyyy-mm-dd.
function dataISO(v) {
  if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  const s = (v == null ? "" : v).toString().trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (m) {
    const a = m[3].length === 2 ? "20" + m[3] : m[3];
    return `${a}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  return null;
}

// dd/mm a partir de uma data de nascimento (para aniversário no CRM).
function ddmm(v) {
  const iso = dataISO(v);
  if (!iso) return "—";
  const [, mm, dd] = iso.split("-");
  return `${dd}/${mm}`;
}

// Cabeçalho → índice das colunas (tolerante a variações de nome).
function mapaColunas(header) {
  const H = header.map(norm);
  const acha = (...alts) => {
    for (const a of alts) { const i = H.findIndex((h) => h.includes(a)); if (i >= 0) return i; }
    return -1;
  };
  return {
    data: acha("DATA VENDA", "DATA"),
    nome: acha("NOME", "CLIENTE"),
    tel: acha("TELEFONE", "FONE", "WHATS"),
    nsc: acha("DATA NSC", "NASC", "ANIVERS"),
    pag: acha("PAGAMENTO", "PAGTO"),
    meio: acha("MEIO", "ENTREGA", "CANAL"),
    prod: acha("PRODUTO", "ITEM"),
  };
}

// Matriz (linhas × colunas) → objetos padronizados. Serve p/ CSV e Excel.
export function linhasDeMatriz(linhas) {
  if (!Array.isArray(linhas) || !linhas.length) return [];
  // acha a linha de cabeçalho (a que tem "PRODUTO")
  let hi = linhas.findIndex((l) => Array.isArray(l) && l.some((c) => norm(c).includes("PRODUTO")));
  if (hi < 0) hi = 0;
  const col = mapaColunas(linhas[hi]);
  const val = (row, i) => (i >= 0 && i < row.length && row[i] != null ? row[i] : "");
  const txt = (row, i) => val(row, i).toString().trim();
  const out = [];
  for (let r = hi + 1; r < linhas.length; r++) {
    const row = linhas[r];
    if (!Array.isArray(row)) continue;
    const prod = txt(row, col.prod);
    const data = dataISO(val(row, col.data));
    if (!prod || !data) continue;
    if (norm(prod) === "PRODUTO") continue;
    out.push({
      data,
      nome: txt(row, col.nome),
      tel: txt(row, col.tel),
      nsc: val(row, col.nsc),
      pag: txt(row, col.pag),
      meio: txt(row, col.meio),
      prod,
    });
  }
  return out;
}

// Linhas de um CSV → objetos padronizados.
export function linhasDeCSV(texto) {
  return linhasDeMatriz(parseCSV(texto));
}

function pagamentoInfo(pag) {
  const p = norm(pag);
  if (p.includes("PEND")) return { forma: "PIX", status: "aberto", label: "Pendente" };
  if (p.includes("DINHEIRO")) return { forma: "Dinheiro", status: "pago", label: "Pago" };
  if (p.includes("DEBITO")) return { forma: "Débito", status: "pago", label: "Pago" };
  if (p.includes("CREDITO") || p.includes("CARTAO")) return { forma: "Cartão", status: "pago", label: "Pago" };
  if (p.includes("IFOOD")) return { forma: "iFood", status: "pago", label: "Pago" };
  return { forma: "PIX", status: "pago", label: "Pago" };
}

function canalDe(meio) {
  const m = norm(meio);
  if (m.includes("WATH") || m.includes("WHATS")) return "WhatsApp";
  if (m.includes("UBER")) return "Uber";
  if (m.includes("IFOOD")) return "Delivery";
  if (m.includes("DELIVERY")) return "Delivery";
  if (m.includes("LOJA") || m.includes("RETIRADA") || m.includes("BALC")) return "Balcão";
  return "Balcão";
}

// Preço de uma linha (qtd de um produto), aplicando o desconto por quantidade.
function precoLinhaDesc(pid, qtd, produto) {
  const d = DESCONTO[pid];
  const cheio = produto ? produto.preco : 0;
  if (d && qtd >= d.min) return d.preco * qtd;
  return cheio * qtd;
}

// Monta o plano de importação (sem gravar). db é usado só para ler catálogo/fichas.
export function planejar(linhas, db, opts = {}) {
  const agrupG = !!opts.agruparGenericos;
  const prodDe = (id) => db.produtos.find((p) => p.id === id);
  const avisos = [];
  const grupos = new Map();
  let seqGen = 0;

  for (const l of linhas) {
    const pid = PROD_MAP[norm(l.prod)];
    if (!pid) { avisos.push(`Produto não reconhecido: “${l.prod}”`); continue; }
    const nome = (l.nome || "").trim();
    const gen = GENERICOS.has(norm(nome));
    const pinfo = pagamentoInfo(l.pag);
    const canal = canalDe(l.meio);
    const key = (gen && !agrupG)
      ? "__g" + (seqGen++)
      : norm(nome) + "|" + l.data + "|" + pinfo.status;
    let g = grupos.get(key);
    if (!g) {
      g = { nomeKey: norm(nome), nome: nome || "Cliente não identificado", data: l.data, canal, forma: pinfo.forma, status: pinfo.status, label: pinfo.label, tel: l.tel || "", nsc: l.nsc || "", itens: {} };
      grupos.set(key, g);
    }
    g.itens[pid] = (g.itens[pid] || 0) + 1;
  }

  // Clientes únicos (por nome normalizado)
  const clientesMap = new Map();
  const clienteId = (g) => {
    const k = g.nomeKey || "CLIENTE NAO IDENTIFICADO";
    let c = clientesMap.get(k);
    if (!c) {
      c = { id: "imp_" + (clientesMap.size + 1), nome: g.nome, tel: g.tel || "", nsc: g.nsc || "", pedidos: 0, gasto: 0 };
      clientesMap.set(k, c);
    } else if (!c.tel && g.tel) c.tel = g.tel;
    return c.id;
  };

  const pedidos = [];
  const consumo = {};
  let faturamento = 0, recebido = 0, aReceber = 0, nItens = 0;

  for (const g of grupos.values()) {
    const cid = clienteId(g);
    const itens = Object.entries(g.itens).map(([id, qtd]) => ({ id, qtd }));
    let total = 0;
    for (const it of itens) {
      const p = prodDe(it.id);
      total += precoLinhaDesc(it.id, it.qtd, p);
      nItens += it.qtd;
      if (p && Array.isArray(p.ficha)) p.ficha.forEach((f) => { consumo[f.id] = (consumo[f.id] || 0) + f.qtd * it.qtd; });
    }
    total = Math.round(total * 100) / 100;
    faturamento += total;
    if (g.status === "pago") recebido += total; else aReceber += total;
    const c = [...clientesMap.values()].find((x) => x.id === cid);
    if (c) { c.pedidos += 1; c.gasto += total; }
    pedidos.push({ clienteId: cid, canal: g.canal, forma: g.forma, statusPag: g.status, labelPag: g.label, itens, total, data: g.data });
  }

  // Custo dos insumos consumidos (backflush)
  let custoInsumos = 0;
  const consumoLista = Object.entries(consumo).map(([id, qtd]) => {
    const ins = db.insumos.find((i) => i.id === id);
    const custo = ins ? ins.custo * qtd : 0;
    custoInsumos += custo;
    return { id, nome: ins ? ins.nome : id, un: ins ? ins.un : "", qtd: Math.round(qtd * 1000) / 1000, custo: Math.round(custo * 100) / 100 };
  }).sort((a, b) => b.custo - a.custo);

  const clientes = [...clientesMap.values()];
  return {
    clientes, pedidos,
    consumo: consumoLista,
    resumo: {
      nItens, nClientes: clientes.length, nPedidos: pedidos.length,
      faturamento: Math.round(faturamento * 100) / 100,
      recebido: Math.round(recebido * 100) / 100,
      aReceber: Math.round(aReceber * 100) / 100,
      custoInsumos: Math.round(custoInsumos * 100) / 100,
      lucroBruto: Math.round((faturamento - custoInsumos) * 100) / 100,
      avisos: [...new Set(avisos)],
      periodo: linhas.length ? [linhas.reduce((a, l) => (l.data < a ? l.data : a), linhas[0].data), linhas.reduce((a, l) => (l.data > a ? l.data : a), linhas[0].data)] : null,
    },
  };
}
