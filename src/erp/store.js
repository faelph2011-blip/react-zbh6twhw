// ============================================================
// STORE — núcleo de domínio integrado (Service Layer)
// Um único hook concentra estado + regras de negócio.
// É aqui que os módulos "conversam": um pedido gera ordem de
// produção, a produção consome insumos, a entrega vira caixa,
// o caixa alimenta o DRE, o cliente ganha cashback. Tudo em cascata.
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as seed from "./seed";
import { uid } from "./format";
import { cloudEnabled } from "../cloud/config";
import { sessaoAtual, aoMudarAuth, entrar, criarConta, sair } from "../cloud/auth";
import { puxarEstado, gravarEstado } from "../cloud/sync";

const clone = (o) => JSON.parse(JSON.stringify(o));
const LS_KEY = "pudimerp_state_v4";

// Preço unitário (considera promoção) e preço da LINHA (aplica combo,
// ex.: "2 por R$ 20" → cada par sai por 20, sobra unitária no preço cheio).
export const precoUnit = (p) => (p ? (p.promo && p.promo > 0 ? p.promo : p.preco) : 0);
export const precoLinha = (p, qtd) => {
  if (!p) return 0;
  const u = precoUnit(p);
  if (p.comboQtd && p.comboPreco && qtd >= p.comboQtd) {
    const pares = Math.floor(qtd / p.comboQtd);
    const resto = qtd % p.comboQtd;
    return pares * p.comboPreco + resto * u;
  }
  return u * qtd;
};

function carregar() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    insumos: clone(seed.insumos),
    produtos: clone(seed.produtos),
    clientes: clone(seed.clientes),
    fornecedores: clone(seed.fornecedores),
    pedidos: clone(seed.pedidos),
    ordens: clone(seed.ordens),
    financeiro: clone(seed.financeiro),
    entregadores: clone(seed.entregadores),
    feed: [
      "Sistema iniciado — trilha de eventos de domínio ativa",
      "IA: produção sugerida para amanhã recalculada",
    ],
  };
}

export function useERP() {
  const [db, setDb] = useState(carregar);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("pudimerp_theme") || "light"
  );

  // ---------- ESTADO DA NUVEM ----------
  const [session, setSession] = useState(null);
  const [cloudStatus, setCloudStatus] = useState({
    syncing: false, lastSync: null, error: null, ready: !cloudEnabled,
  });
  const dbRef = useRef(db);
  const loggedInRef = useRef(false);
  const pushTimer = useRef(null);
  useEffect(() => { dbRef.current = db; }, [db]);

  const writeLocal = useCallback((next) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch (_) {}
  }, []);

  // Envia o estado para a nuvem (com atraso, agrupando gravações seguidas).
  const schedulePush = useCallback((next) => {
    if (!cloudEnabled || !loggedInRef.current) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      setCloudStatus((s) => ({ ...s, syncing: true }));
      const r = await gravarEstado(next);
      setCloudStatus((s) => ({
        ...s, syncing: false,
        lastSync: r.ok ? Date.now() : s.lastSync,
        error: r.ok ? null : r.erro,
      }));
    }, 800);
  }, []);

  const persist = useCallback((next) => {
    setDb(next);
    writeLocal(next);
    schedulePush(next);
  }, [writeLocal, schedulePush]);

  // Ao logar: puxa o estado da nuvem (fonte da verdade). Se a nuvem
  // ainda estiver vazia, semeia com o estado local atual.
  const aplicarSessao = useCallback(async (s) => {
    setSession(s);
    const logado = !!(s && s.user && s.user.id);
    loggedInRef.current = logado;
    if (!logado) { setCloudStatus((cs) => ({ ...cs, ready: true })); return; }
    setCloudStatus((cs) => ({ ...cs, syncing: true, error: null }));
    const { data, erro } = await puxarEstado();
    if (erro) { setCloudStatus({ syncing: false, lastSync: null, error: erro, ready: true }); return; }
    if (data) {
      setDb(data);
      writeLocal(data);
      setCloudStatus({ syncing: false, lastSync: Date.now(), error: null, ready: true });
    } else {
      const r = await gravarEstado(dbRef.current);
      setCloudStatus({ syncing: false, lastSync: r.ok ? Date.now() : null, error: r.ok ? null : r.erro, ready: true });
    }
  }, [writeLocal]);

  useEffect(() => {
    if (!cloudEnabled) return;
    let cancel = false;
    sessaoAtual().then((s) => { if (!cancel) aplicarSessao(s); });
    const unsub = aoMudarAuth((s) => { if (!cancel) aplicarSessao(s); });
    return () => { cancel = true; unsub(); };
  }, [aplicarSessao]);

  const cloud = {
    enabled: cloudEnabled,
    ready: cloudStatus.ready,
    syncing: cloudStatus.syncing,
    lastSync: cloudStatus.lastSync,
    error: cloudStatus.error,
    session,
    user: (session && session.user) || null,
    email: (session && session.user && session.user.email) || null,
    entrar,
    criarConta,
    sair: async () => { await sair(); },
  };

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const n = t === "dark" ? "light" : "dark";
      localStorage.setItem("pudimerp_theme", n);
      return n;
    });
  }, []);

  const resetar = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    const fresh = carregar();
    setDb(fresh);
    writeLocal(fresh);
    schedulePush(fresh);
  }, [writeLocal, schedulePush]);

  // aplica uma mutação sobre uma cópia do estado atual e persiste
  const up = (fn) => {
    const next = clone(db);
    fn(next);
    persist(next);
  };

  const log = (d, msg) => {
    d.feed = [msg, ...(d.feed || [])].slice(0, 12);
  };

  // ---------- SELETORES (engenharia de custos) ----------
  const custoProduto = useCallback(
    (prod) =>
      prod.ficha.reduce((t, item) => {
        const ins = db.insumos.find((i) => i.id === item.id);
        return t + (ins ? ins.custo * item.qtd : 0);
      }, 0),
    [db.insumos]
  );

  const precoVenda = (p) => (p.promo && p.promo > 0 ? p.promo : p.preco);
  const margemProduto = useCallback(
    (p) => {
      const pv = precoVenda(p);
      const c = custoProduto(p);
      return pv > 0 ? (pv - c) / pv : 0;
    },
    [custoProduto]
  );

  const totalPedido = useCallback(
    (ped) =>
      ped.itens.reduce((t, it) => {
        const p = db.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0),
    [db.produtos]
  );

  // ---------- AÇÕES INTEGRADAS ----------

  // Pedidos → cria recebível no financeiro
  const criarPedido = (clienteId, itens, canal) =>
    up((d) => {
      const id = 1000 + Math.floor(Math.random() * 9000);
      const hojeISO = new Date().toISOString().slice(0, 10);
      const ped = { id, clienteId, canal, status: "Novo", pagamento: "Pendente", itens, obs: "", criado: "hoje", data: hojeISO, ts: Date.now() };
      d.pedidos.unshift(ped);
      const total = itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
      d.financeiro.unshift({ id: uid(), tipo: "receita", cat: "Vendas", desc: `Pedido #${id}`, valor: total, status: "aberto", venc: "hoje", origem: "Pedidos" });
      const cli = d.clientes.find((c) => c.id === clienteId);
      log(d, `Pedido #${id} criado (${canal}) — ${cli ? cli.nome : "cliente"} · recebível lançado`);
    });

  // Pedido → gera ordens de produção (PCP)
  const enviarProducao = (pedidoId) =>
    up((d) => {
      const ped = d.pedidos.find((p) => p.id === pedidoId);
      if (!ped) return;
      ped.status = "Produção";
      ped.itens.forEach((it) => {
        d.ordens.unshift({
          id: 5000 + Math.floor(Math.random() * 999),
          produtoId: it.id, qtd: it.qtd, status: "Fila",
          lote: "L-" + uid().slice(0, 4).toUpperCase(), pedidoId,
        });
      });
      log(d, `Pedido #${pedidoId} → produção · ${ped.itens.length} ordem(ns) na fila`);
    });

  // Ordem de produção avança. Ao concluir: consome insumos e gera estoque.
  const avancarOrdem = (ordemId) =>
    up((d) => {
      const o = d.ordens.find((x) => x.id === ordemId);
      if (!o) return;
      if (o.status === "Fila") {
        o.status = "Produzindo";
        log(d, `OP #${o.id} iniciada — lote ${o.lote}`);
      } else if (o.status === "Produzindo") {
        o.status = "Pronto";
        const prod = d.produtos.find((p) => p.id === o.produtoId);
        if (prod) {
          // baixa de insumos (rastreabilidade de consumo)
          prod.ficha.forEach((item) => {
            const ins = d.insumos.find((i) => i.id === item.id);
            if (ins) ins.estoque = Math.max(0, +(ins.estoque - item.qtd * o.qtd).toFixed(3));
          });
          prod.estoque += o.qtd;
        }
        log(d, `OP #${o.id} concluída — ${o.qtd}× ${prod ? prod.nome : ""} ao estoque · insumos baixados`);
      }
    });

  // Entrega/venda: baixa estoque acabado, liquida caixa, credita cashback
  const entregarPedido = (pedidoId) =>
    up((d) => {
      const ped = d.pedidos.find((p) => p.id === pedidoId);
      if (!ped) return;
      ped.itens.forEach((it) => {
        const prod = d.produtos.find((p) => p.id === it.id);
        if (prod) prod.estoque = Math.max(0, prod.estoque - it.qtd);
      });
      ped.status = "Entregue";
      ped.pagamento = ped.pagamento === "Pendente" ? "PIX" : ped.pagamento;
      const lanc = d.financeiro.find((l) => l.desc.includes(`#${pedidoId}`) && l.tipo === "receita");
      const total = ped.itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
      if (lanc) lanc.status = "pago";
      const cli = d.clientes.find((c) => c.id === ped.clienteId);
      if (cli) {
        cli.cashback = +(cli.cashback + total * 0.03).toFixed(2);
        cli.pontos += Math.round(total);
        cli.pedidos += 1;
        cli.gasto += total;
        cli.ultimo = "agora";
      }
      log(d, `Pedido #${pedidoId} entregue — caixa liquidado · +${(total * 0.03).toFixed(2)} cashback ao cliente`);
    });

  const cancelarPedido = (pedidoId) =>
    up((d) => {
      const ped = d.pedidos.find((p) => p.id === pedidoId);
      if (!ped) return;
      ped.status = "Cancelado";
      const lanc = d.financeiro.find((l) => l.desc.includes(`#${pedidoId}`) && l.tipo === "receita");
      if (lanc && lanc.status !== "pago") lanc.status = "cancelado";
      log(d, `Pedido #${pedidoId} cancelado — recebível estornado`);
    });

  // Compras: recebe insumo, gera pagável
  const receberCompra = (insumoId, qtd, custoTotal, fornecedor) =>
    up((d) => {
      const ins = d.insumos.find((i) => i.id === insumoId);
      if (!ins) return;
      ins.estoque += qtd;
      d.financeiro.unshift({ id: uid(), tipo: "despesa", cat: "Matéria-prima", desc: `Compra ${ins.nome} (${fornecedor})`, valor: custoTotal, status: "aberto", venc: "30d", origem: "Compras" });
      log(d, `Recebido ${qtd} ${ins.un} de ${ins.nome} — estoque reposto · pagável lançado`);
    });

  // Compra/investimento: repõe estoque (se for insumo do catálogo) ou registra
  // um custo avulso ("Outros"), sempre com data, para o controle do investido.
  const registrarCompra = ({ insumoId, nomeManual, qtd, custoTotal, data }) =>
    up((d) => {
      const hojeISO = new Date().toISOString().slice(0, 10);
      const dia = data || hojeISO;
      let nome = (nomeManual || "").trim() || "Item";
      if (insumoId) {
        const ins = d.insumos.find((i) => i.id === insumoId);
        if (ins) {
          ins.estoque = +(ins.estoque + (Number(qtd) || 0)).toFixed(3);
          nome = ins.nome;
        }
      }
      const valor = +(Number(custoTotal) || 0).toFixed(2);
      d.financeiro.unshift({
        id: uid(), tipo: "despesa", cat: "Compras",
        desc: `Compra: ${nome}${qtd ? ` (${qtd})` : ""}`,
        valor, status: "pago", venc: dia === hojeISO ? "hoje" : dia,
        origem: "Compras", data: dia,
      });
      log(d, `Compra registrada — ${nome} · R$ ${valor.toFixed(2)} (${dia})`);
    });

  const liquidar = (lancId) =>
    up((d) => {
      const l = d.financeiro.find((x) => x.id === lancId);
      if (l) { l.status = "pago"; log(d, `Baixa financeira — ${l.desc} · ${l.tipo}`); }
    });

  const setPagamento = (pedidoId, forma) =>
    up((d) => {
      const p = d.pedidos.find((x) => x.id === pedidoId);
      if (p) p.pagamento = forma;
    });

  const despacharEntrega = (pedidoId, entregadorId) =>
    up((d) => {
      const e = d.entregadores.find((x) => x.id === entregadorId);
      const p = d.pedidos.find((x) => x.id === pedidoId);
      if (e) { e.status = "Em rota"; e.entregas += 1; }
      if (p) p.entregadorId = entregadorId;
      log(d, `Rota despachada — pedido #${pedidoId} com ${e ? e.nome : "entregador"}`);
    });

  // Venda Rápida: registro ágil (balcão/apps). Já entra pago e baixa estoque —
  // sem passar pelo fluxo de produção. É o "controle rápido" do dia a dia.
  // dataISO (yyyy-mm-dd) permite lançar vendas de dias passados.
  // clienteId (opcional) vincula a venda a um cliente cadastrado.
  const registrarVendaRapida = (itens, canal, forma, quando, dataISO, clienteId) =>
    up((d) => {
      const id = 7000 + Math.floor(Math.random() * 2999);
      const total = itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
      const hojeISO = new Date().toISOString().slice(0, 10);
      const dia = dataISO || hojeISO;
      const ts = dataISO && dataISO !== hojeISO ? new Date(dia + "T12:00:00").getTime() : Date.now();
      d.pedidos.unshift({
        id, clienteId: clienteId || null, canal, status: "Entregue", pagamento: forma,
        itens, obs: "", criado: quando, rapida: true, ts, data: dia,
      });
      itens.forEach((it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        if (p) p.estoque = Math.max(0, p.estoque - it.qtd);
      });
      d.financeiro.unshift({
        id: uid(), tipo: "receita", cat: "Vendas", desc: `Venda rápida #${id} (${canal})`,
        valor: total, status: "pago", venc: dia === hojeISO ? "hoje" : dia, origem: "Venda Rápida", data: dia,
      });
      // vincula ao cliente: cashback 3%, pontos e histórico
      if (clienteId) {
        const cli = d.clientes.find((c) => c.id === clienteId);
        if (cli) {
          cli.cashback = +(cli.cashback + total * 0.03).toFixed(2);
          cli.pontos += Math.round(total);
          cli.pedidos += 1;
          cli.gasto += total;
          cli.ultimo = "agora";
        }
      }
      const un = itens.reduce((t, i) => t + i.qtd, 0);
      log(d, `Venda rápida #${id} — ${canal} · ${un} un · ${forma} · caixa +${total.toFixed(2)}`);
    });

  // Pedido vindo da loja online: cadastra o cliente E cria o pedido de uma vez
  // (um único passo, para não perder dados entre gravações).
  const pedidoSite = ({ nome, tel, itens }) =>
    up((d) => {
      const cid = uid();
      d.clientes.unshift({
        id: cid, nome: (nome || "").trim() || "Cliente do site", tel: (tel || "").trim(),
        wpp: true, aniv: "—", origem: "Site", cashback: 0, pontos: 0, pedidos: 0, gasto: 0, ultimo: "agora",
      });
      const id = 1000 + Math.floor(Math.random() * 9000);
      const hojeISO = new Date().toISOString().slice(0, 10);
      const total = itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
      d.pedidos.unshift({ id, clienteId: cid, canal: "Site", status: "Novo", pagamento: "Pendente", itens, obs: "", criado: "hoje", data: hojeISO, ts: Date.now() });
      d.financeiro.unshift({ id: uid(), tipo: "receita", cat: "Vendas", desc: `Pedido #${id}`, valor: total, status: "aberto", venc: "hoje", origem: "Pedidos", data: hojeISO });
      log(d, `Pedido #${id} (Site) — ${nome || "cliente"} cadastrado no CRM · recebível lançado`);
    });

  // Cadastro de cliente (CRM)
  const criarCliente = (dados) =>
    up((d) => {
      const c = {
        id: uid(),
        nome: (dados.nome || "").trim() || "Cliente",
        tel: (dados.tel || "").trim(),
        wpp: !!dados.wpp,
        aniv: (dados.aniv || "").trim() || "—",
        origem: (dados.origem || "").trim() || "Cadastro",
        cashback: 0, pontos: 0, pedidos: 0, gasto: 0, ultimo: "—",
      };
      d.clientes.unshift(c);
      log(d, `Cliente cadastrado — ${c.nome}`);
    });

  // Limpa TODOS os dados de exemplo para começar a jornada real do zero:
  // zera pedidos, ordens, clientes, financeiro, entregadores, fornecedores
  // e o estoque (insumos e produtos). Mantém o catálogo e os custos.
  const limparExemplos = () =>
    up((d) => {
      d.pedidos = [];
      d.ordens = [];
      d.clientes = [];
      d.financeiro = [];
      d.entregadores = [];
      d.fornecedores = [];
      d.insumos.forEach((i) => { i.estoque = 0; });
      d.produtos.forEach((p) => { p.estoque = 0; });
      d.feed = ["Base limpa — pronta para os dados reais 🍮"];
    });

  // Produção direta: registra X pudins prontos no estoque, abatendo os
  // insumos da ficha técnica (mesma lógica do PCP, porém em 1 clique).
  const produzir = (produtoId, qtd) =>
    up((d) => {
      const prod = d.produtos.find((p) => p.id === produtoId);
      const n = Math.floor(Number(qtd) || 0);
      if (!prod || n <= 0) return;
      prod.ficha.forEach((item) => {
        const ins = d.insumos.find((i) => i.id === item.id);
        if (ins) ins.estoque = Math.max(0, +(ins.estoque - item.qtd * n).toFixed(3));
      });
      prod.estoque += n;
      log(d, `Produção: +${n}× ${prod.nome} ao estoque pronto · insumos baixados`);
    });

  // Aplica o catálogo de custos do seed (custos reais, gás, insumos novos)
  // sobre os dados atuais, SEM apagar vendas, clientes ou estoque.
  const sincronizarCatalogo = () =>
    up((d) => {
      seed.insumos.forEach((si) => {
        const ex = d.insumos.find((i) => i.id === si.id);
        if (ex) {
          ex.nome = si.nome; ex.cat = si.cat; ex.un = si.un; ex.custo = si.custo;
          if (ex.min == null) ex.min = si.min;
          if (ex.max == null) ex.max = si.max;
        } else {
          d.insumos.push({ ...si });
        }
      });
      seed.produtos.forEach((sp) => {
        const p = d.produtos.find((x) => x.id === sp.id);
        if (p) {
          p.ficha = sp.ficha.map((f) => ({ ...f }));
          p.rendimento = sp.rendimento; p.tamanho = sp.tamanho; p.nome = sp.nome;
          p.preco = sp.preco; p.promo = sp.promo;
          p.combo = sp.combo; p.comboQtd = sp.comboQtd; p.comboPreco = sp.comboPreco;
        } else {
          d.produtos.push({ ...clone(sp), estoque: 0 });
        }
      });
      log(d, "Catálogo de custos atualizado — ingredientes, potes, adesivo, gás e delivery");
    });

  return {
    db, theme, toggleTheme, resetar, sincronizarCatalogo, criarCliente, limparExemplos, pedidoSite, produzir,
    // nuvem (login + sincronização)
    cloud,
    // seletores
    custoProduto, margemProduto, totalPedido, precoVenda, precoLinha,
    // ações
    criarPedido, enviarProducao, avancarOrdem, entregarPedido, cancelarPedido,
    receberCompra, registrarCompra, liquidar, setPagamento, despacharEntrega, registrarVendaRapida,
  };
}

// ---------- INDICADORES DERIVADOS (BI) ----------
export function useKPIs(erp) {
  const { db, custoProduto, precoVenda, margemProduto } = erp;
  return useMemo(() => {
    const entregues = db.pedidos.filter((p) => p.status === "Entregue");
    const receitaPaga = db.financeiro.filter((l) => l.tipo === "receita" && l.status === "pago").reduce((t, l) => t + l.valor, 0);
    const aReceber = db.financeiro.filter((l) => l.tipo === "receita" && l.status === "aberto").reduce((t, l) => t + l.valor, 0);
    const aPagar = db.financeiro.filter((l) => l.tipo === "despesa" && l.status === "aberto").reduce((t, l) => t + l.valor, 0);
    const despesasPagas = db.financeiro.filter((l) => l.tipo === "despesa" && l.status === "pago").reduce((t, l) => t + l.valor, 0);

    const receitaBruta = db.pedidos.filter((p) => p.status !== "Cancelado").reduce((t, p) => t + p.itens.reduce((s, it) => { const pr = db.produtos.find((x) => x.id === it.id); return s + precoLinha(pr, it.qtd); }, 0), 0);
    const cmv = db.pedidos.filter((p) => p.status !== "Cancelado").reduce((t, p) => t + p.itens.reduce((s, it) => { const pr = db.produtos.find((x) => x.id === it.id); return s + (pr ? custoProduto(pr) * it.qtd : 0); }, 0), 0);
    const lucroBruto = receitaBruta - cmv;

    const vendidos = db.pedidos.filter((p) => p.status !== "Cancelado").reduce((t, p) => t + p.itens.reduce((s, it) => s + it.qtd, 0), 0);
    const produzidos = db.ordens.filter((o) => o.status === "Pronto").reduce((t, o) => t + o.qtd, 0);

    // ranking de produtos
    const rank = {};
    db.pedidos.filter((p) => p.status !== "Cancelado").forEach((p) => p.itens.forEach((it) => { rank[it.id] = (rank[it.id] || 0) + it.qtd; }));
    const topProdutos = Object.entries(rank).map(([id, q]) => ({ prod: db.produtos.find((x) => x.id === id), q })).filter((x) => x.prod).sort((a, b) => b.q - a.q);

    const nPedidos = db.pedidos.filter((p) => p.status !== "Cancelado").length;
    const ticket = nPedidos ? receitaBruta / nPedidos : 0;
    const recorrentes = db.clientes.filter((c) => c.pedidos >= 2).length;
    const margemMedia = db.produtos.length ? db.produtos.reduce((t, p) => t + margemProduto(p), 0) / db.produtos.length : 0;

    const alertasInsumo = db.insumos.filter((i) => i.estoque < i.min);
    const alertasProduto = db.produtos.filter((p) => p.estoque <= 3);

    const porStatus = (s) => db.pedidos.filter((p) => p.status === s).length;

    return {
      receitaPaga, aReceber, aPagar, despesasPagas,
      caixa: receitaPaga - despesasPagas,
      receitaBruta, cmv, lucroBruto, lucroLiquido: lucroBruto - despesasPagas,
      vendidos, produzidos, ticket, recorrentes, margemMedia,
      topProdutos, alertasInsumo, alertasProduto,
      emProducao: porStatus("Produção"), entregues: porStatus("Entregue"),
      cancelados: porStatus("Cancelado"), novos: porStatus("Novo"), prontos: porStatus("Pronto"),
    };
  }, [db, custoProduto, precoVenda, margemProduto]);
}
