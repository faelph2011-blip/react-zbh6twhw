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
import { enviarPedidoOnline, puxarPedidosOnline, marcarPedidosProcessados } from "../cloud/pedidos";
import { planejar as planejarImport } from "./importador";

const clone = (o) => JSON.parse(JSON.stringify(o));
const LS_KEY = "pudimerp_state_v5";

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

// Realinha o catálogo (produtos e insumos) com o código, PRESERVANDO
// estoque e todas as transações (vendas, clientes, financeiro). É usado
// tanto no login (automático) quanto no botão "Atualizar custos".
function aplicarCatalogo(d) {
  if (!d || !Array.isArray(d.insumos) || !Array.isArray(d.produtos)) return d;
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
      p.sabor = sp.sabor; p.porte = sp.porte;
      p.emoji = sp.emoji; p.grad = sp.grad; p.cat = sp.cat; p.sku = sp.sku;
    } else {
      d.produtos.push({ ...clone(sp), estoque: 0 });
    }
  });
  return d;
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
  const absorbRef = useRef(null);
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
      // realinha o catálogo do código sobre os dados da nuvem (preserva
      // estoque e transações) — assim mudanças de produto aparecem sozinhas
      const rec = aplicarCatalogo(clone(data));
      setDb(rec);
      dbRef.current = rec;
      writeLocal(rec);
      setCloudStatus({ syncing: false, lastSync: Date.now(), error: null, ready: true });
      // absorve pedidos feitos na loja online que ainda não entraram no ERP
      if (absorbRef.current) absorbRef.current().catch(() => {});
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

  // Enquanto o dono está logado, verifica novos pedidos da loja a cada 40s.
  const logadoAgora = !!(session && session.user && session.user.id);
  useEffect(() => {
    if (!cloudEnabled || !logadoAgora) return;
    const t = setInterval(() => { if (absorbRef.current) absorbRef.current().catch(() => {}); }, 40000);
    const onFocus = () => { if (absorbRef.current) absorbRef.current().catch(() => {}); };
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [logadoAgora]);

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
    (ped) => {
      if (ped.total != null) return ped.total; // pedido importado com valor fechado (ex.: desconto do histórico)
      return ped.itens.reduce((t, it) => {
        const p = db.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
    },
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

  // Lançamento financeiro manual (despesa como aluguel/luz/gás, ou receita avulsa).
  const lancarFinanceiro = ({ tipo, cat, desc, valor, venc, status, data }) =>
    up((d) => {
      const hojeISO = new Date().toISOString().slice(0, 10);
      const t = tipo === "receita" ? "receita" : "despesa";
      d.financeiro.unshift({
        id: uid(),
        tipo: t,
        cat: (cat || "").trim() || (t === "receita" ? "Outras receitas" : "Despesa"),
        desc: (desc || "").trim() || "Lançamento manual",
        valor: Math.max(0, Number(valor) || 0),
        status: status === "pago" ? "pago" : "aberto",
        venc: (venc || "").trim() || "hoje",
        origem: "Manual",
        data: data || hojeISO,
      });
      log(d, `Lançamento manual — ${t} · R$ ${(Number(valor) || 0).toFixed(2)} · ${(desc || "").trim() || "sem descrição"}`);
    });

  // Remove um lançamento (usado apenas para lançamentos manuais na UI).
  const excluirLancamento = (id) =>
    up((d) => {
      const i = d.financeiro.findIndex((x) => x.id === id);
      if (i >= 0) { const [rm] = d.financeiro.splice(i, 1); log(d, `Lançamento removido — ${rm.desc}`); }
    });

  // Define o saldo inicial do caixa (o dinheiro que já existe hoje).
  const definirSaldoInicial = (valor) =>
    up((d) => {
      d.saldoInicial = Math.max(0, Number(valor) || 0);
      log(d, `Saldo inicial de caixa definido — R$ ${(Number(valor) || 0).toFixed(2)}`);
    });

  // Prévia da importação (não grava) — usada pela tela de Importação.
  const previewImportacao = (linhas, opts) => planejarImport(linhas, dbRef.current, opts);

  // Importa o histórico: clientes, vendas (com desconto por qtd) e o consumo de
  // insumos (backflush) — lançando a compra de produção. Opcionalmente zera os
  // dados de teste antes.
  const importarHistorico = (linhas, opts = {}) => {
    const plano = planejarImport(linhas, dbRef.current, opts);
    up((d) => {
      if (opts.zerar) {
        d.pedidos = []; d.clientes = []; d.financeiro = []; d.ordens = [];
        d.produtos.forEach((p) => { p.estoque = 0; });
        d.insumos.forEach((i) => { i.estoque = 0; });
        d.seqPedido = 1042;
      }
      const nomeById = {};
      const idmap = {};
      plano.clientes.forEach((c) => {
        nomeById[c.id] = c.nome;
        const novo = {
          id: uid(), nome: c.nome, tel: (c.tel || "").toString(), wpp: !!c.tel,
          aniv: "—", origem: "Histórico", cashback: 0, pontos: 0,
          pedidos: c.pedidos, gasto: Math.round(c.gasto * 100) / 100, ultimo: "—",
        };
        idmap[c.id] = novo.id;
        d.clientes.unshift(novo);
      });
      // pedidos + recebíveis (do mais antigo para o mais novo → números crescentes)
      plano.pedidos.slice().reverse().forEach((pe) => {
        const numero = calcNumero(d); d.seqPedido = numero;
        const pago = pe.statusPag === "pago";
        d.pedidos.unshift({
          id: numero, numero, clienteId: idmap[pe.clienteId] || null, canal: pe.canal,
          status: "Entregue", pagamento: pago ? "Pago" : "Pendente", forma: pe.forma,
          itens: pe.itens, total: pe.total, obs: "", criado: "histórico", data: pe.data,
          ts: new Date(pe.data + "T12:00:00").getTime(), importado: true,
        });
        d.financeiro.unshift({
          id: uid(), tipo: "receita", cat: "Vendas",
          desc: `Pedido #${numero} — ${nomeById[pe.clienteId] || "cliente"}`,
          valor: pe.total, status: pago ? "pago" : "aberto", venc: pe.data, data: pe.data, origem: "Importação",
        });
      });
      // "compra para produção" das vendas (custo dos insumos consumidos)
      const custo = plano.resumo.custoInsumos;
      const dia0 = plano.resumo.periodo ? plano.resumo.periodo[0] : new Date().toISOString().slice(0, 10);
      if (custo > 0) {
        d.financeiro.unshift({
          id: uid(), tipo: "despesa", cat: "Matéria-prima",
          desc: "Compra de insumos p/ produção (histórico importado)",
          valor: Math.round(custo * 100) / 100, status: "pago", venc: dia0, data: dia0, origem: "Compras",
        });
      }
      const r = plano.resumo;
      log(d, `🗂️ Histórico importado — ${r.nPedidos} pedidos · ${r.nItens} itens · faturamento R$ ${r.faturamento.toFixed(2)} · insumos R$ ${r.custoInsumos.toFixed(2)}`);
    });
    return plano.resumo;
  };

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
  // Próximo número de pedido (sequência limpa, ex.: 1043, 1044…), persistida em d.seqPedido.
  // Ignora os números de venda rápida (7000+) para a sequência não pular.
  const calcNumero = (d) => {
    const nums = (d.pedidos || [])
      .map((p) => Number(p.numero != null ? p.numero : p.id))
      .filter((n) => Number.isFinite(n) && n < 7000);
    return Math.max(1042, d.seqPedido || 0, ...(nums.length ? nums : [0])) + 1;
  };

  const pedidoSite = ({ nome, tel, itens, forma }) => {
    const numero = calcNumero(db);
    const hojeISO = new Date().toISOString().slice(0, 10);
    const ts = Date.now();
    up((d) => {
      const cid = uid();
      d.clientes.unshift({
        id: cid, nome: (nome || "").trim() || "Cliente do site", tel: (tel || "").trim(),
        wpp: true, aniv: "—", origem: "Site", cashback: 0, pontos: 0, pedidos: 0, gasto: 0, ultimo: "agora",
      });
      d.seqPedido = numero;
      const total = itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
      const pagamento = forma === "pix" ? "Aguardando PIX" : "A combinar";
      d.pedidos.unshift({ id: numero, numero, clienteId: cid, canal: "Site", status: "Novo", pagamento, forma: forma || null, itens, obs: "", criado: "hoje", data: hojeISO, ts });
      d.financeiro.unshift({ id: uid(), tipo: "receita", cat: "Vendas", desc: `Pedido #${numero}`, valor: total, status: "aberto", venc: "hoje", origem: "Pedidos", data: hojeISO });
      log(d, `Pedido #${numero} (Site) — ${nome || "cliente"} · ${pagamento} · recebível lançado`);
    });
    // Envia o pedido para a nuvem (fila) para aparecer no painel do dono.
    // Segue mesmo se o dono não estiver logado — é o visitante inserindo.
    enviarPedidoOnline({ numero, nome, tel, itens, forma: forma || null, criadoISO: hojeISO, ts })
      .catch(() => {});
    return numero;
  };

  // Painel do dono: puxa os pedidos feitos na loja online e os absorve no
  // ERP (cria cliente, pedido e recebível), gravando na nuvem compartilhada.
  const absorverPedidosOnline = async () => {
    if (!cloudEnabled || !loggedInRef.current) return 0;
    const { data } = await puxarPedidosOnline();
    if (!data || !data.length) return 0;
    const next = clone(dbRef.current);
    const idsOk = [];
    data.forEach((row) => {
      if (next.pedidos.some((p) => p.onlineId === row.id)) { idsOk.push(row.id); return; }
      const pl = row.payload || {};
      const cid = uid();
      next.clientes.unshift({
        id: cid, nome: (pl.nome || "").trim() || "Cliente do site", tel: (pl.tel || "").trim(),
        wpp: true, aniv: "—", origem: "Site", cashback: 0, pontos: 0, pedidos: 0, gasto: 0, ultimo: "agora",
      });
      let numero = Number(pl.numero) || calcNumero(next);
      if (next.pedidos.some((p) => (p.numero || p.id) === numero)) numero = calcNumero(next);
      next.seqPedido = Math.max(next.seqPedido || 0, numero);
      const itens = Array.isArray(pl.itens) ? pl.itens : [];
      const total = itens.reduce((t, it) => {
        const p = next.produtos.find((x) => x.id === it.id);
        return t + precoLinha(p, it.qtd);
      }, 0);
      const pagamento = pl.forma === "pix" ? "Aguardando PIX" : "A combinar";
      const dia = pl.criadoISO || new Date().toISOString().slice(0, 10);
      next.pedidos.unshift({ id: numero, numero, onlineId: row.id, clienteId: cid, canal: "Site", status: "Novo", pagamento, forma: pl.forma || null, itens, obs: "", criado: "loja online", data: dia, ts: pl.ts || Date.now() });
      next.financeiro.unshift({ id: uid(), tipo: "receita", cat: "Vendas", desc: `Pedido #${numero}`, valor: total, status: "aberto", venc: "hoje", origem: "Pedidos", data: dia });
      log(next, `🌐 Pedido online #${numero} recebido — ${pl.nome || "cliente"} · ${pagamento}`);
      idsOk.push(row.id);
    });
    setDb(next);
    writeLocal(next);
    const r = await gravarEstado(next);
    if (r.ok) {
      setCloudStatus((s) => ({ ...s, lastSync: Date.now(), error: null }));
      await marcarPedidosProcessados(idsOk);
    }
    return idsOk.length;
  };
  absorbRef.current = absorverPedidosOnline;

  // Confirma o pagamento de um pedido (ex.: comprovante do PIX recebido).
  const marcarPago = (pedidoId) =>
    up((d) => {
      const p = d.pedidos.find((x) => x.id === pedidoId);
      if (!p) return;
      p.pagamento = "Pago";
      const fin = d.financeiro.find((f) => f.tipo === "receita" && f.desc && f.desc.includes(`#${pedidoId}`));
      if (fin) fin.status = "pago";
      log(d, `Pedido #${pedidoId} — pagamento confirmado ✅`);
    });

  // Marca o pedido como pendente de pagamento (volta o recebível para "aberto").
  const marcarPendente = (pedidoId) =>
    up((d) => {
      const p = d.pedidos.find((x) => x.id === pedidoId);
      if (!p) return;
      p.pagamento = "Pendente";
      const fin = d.financeiro.find((f) => f.tipo === "receita" && f.desc && f.desc.includes(`#${pedidoId}`));
      if (fin) fin.status = "aberto";
      log(d, `Pedido #${pedidoId} — marcado como pendente de pagamento ⏳`);
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

  // Edita os dados cadastrais de um cliente (não mexe em gasto/pontos/histórico).
  const editarCliente = (id, dados) =>
    up((d) => {
      const c = d.clientes.find((x) => x.id === id);
      if (!c) return;
      if (dados.nome != null && dados.nome.trim()) c.nome = dados.nome.trim();
      if (dados.tel != null) c.tel = dados.tel.trim();
      if (dados.wpp != null) c.wpp = !!dados.wpp;
      if (dados.aniv != null) c.aniv = dados.aniv.trim() || "—";
      if (dados.origem != null && dados.origem.trim()) c.origem = dados.origem.trim();
      log(d, `Cliente atualizado — ${c.nome}`);
    });

  // Exclui o cadastro do cliente. Os pedidos ficam, só perdem o vínculo.
  const excluirCliente = (id) =>
    up((d) => {
      const c = d.clientes.find((x) => x.id === id);
      d.clientes = d.clientes.filter((x) => x.id !== id);
      d.pedidos.forEach((p) => { if (p.clienteId === id) p.clienteId = null; });
      if (c) log(d, `Cliente excluído — ${c.nome}`);
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
      aplicarCatalogo(d);
      log(d, "Catálogo atualizado — produtos, ingredientes e custos realinhados");
    });

  return {
    db, theme, toggleTheme, resetar, sincronizarCatalogo, criarCliente, editarCliente, excluirCliente, limparExemplos, pedidoSite, produzir, marcarPago, marcarPendente,
    buscarPedidosOnline: absorverPedidosOnline, previewImportacao, importarHistorico,
    // nuvem (login + sincronização)
    cloud,
    // seletores
    custoProduto, margemProduto, totalPedido, precoVenda, precoLinha,
    // ações
    criarPedido, enviarProducao, avancarOrdem, entregarPedido, cancelarPedido,
    receberCompra, registrarCompra, liquidar, lancarFinanceiro, excluirLancamento, definirSaldoInicial, setPagamento, despacharEntrega, registrarVendaRapida,
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
    // Compras de matéria-prima/insumos são CUSTO DE PRODUTO (viram CMV quando vendidos),
    // não despesa operacional — separamos para o DRE não contar o custo duas vezes.
    const ehCusto = (l) => l.cat === "Matéria-prima" || l.cat === "Insumos" || l.origem === "Compras";
    const despesasOperacionais = db.financeiro.filter((l) => l.tipo === "despesa" && l.status === "pago" && !ehCusto(l)).reduce((t, l) => t + l.valor, 0);

    // Receita do pedido: usa o total fechado (ex.: importado com desconto) quando houver.
    const valorPedido = (p) => (p.total != null ? p.total : p.itens.reduce((s, it) => { const pr = db.produtos.find((x) => x.id === it.id); return s + precoLinha(pr, it.qtd); }, 0));
    const receitaBruta = db.pedidos.filter((p) => p.status !== "Cancelado").reduce((t, p) => t + valorPedido(p), 0);
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

    const saldoInicial = Number(db.saldoInicial) || 0;
    return {
      receitaPaga, aReceber, aPagar, despesasPagas, despesasOperacionais, saldoInicial,
      caixa: saldoInicial + receitaPaga - despesasPagas,
      receitaBruta, cmv, lucroBruto, lucroLiquido: lucroBruto - despesasOperacionais,
      vendidos, produzidos, ticket, recorrentes, margemMedia,
      topProdutos, alertasInsumo, alertasProduto,
      emProducao: porStatus("Produção"), entregues: porStatus("Entregue"),
      cancelados: porStatus("Cancelado"), novos: porStatus("Novo"), prontos: porStatus("Pronto"),
    };
  }, [db, custoProduto, precoVenda, margemProduto]);
}
