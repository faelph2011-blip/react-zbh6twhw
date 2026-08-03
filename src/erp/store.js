// ============================================================
// STORE — núcleo de domínio integrado (Service Layer)
// Um único hook concentra estado + regras de negócio.
// É aqui que os módulos "conversam": um pedido gera ordem de
// produção, a produção consome insumos, a entrega vira caixa,
// o caixa alimenta o DRE, o cliente ganha cashback. Tudo em cascata.
// ============================================================
import { useCallback, useMemo, useState } from "react";
import * as seed from "./seed";
import { uid } from "./format";

const clone = (o) => JSON.parse(JSON.stringify(o));
const LS_KEY = "pudimerp_state_v1";

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
    () => localStorage.getItem("pudimerp_theme") || "dark"
  );

  const persist = useCallback((next) => {
    setDb(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch (_) {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const n = t === "dark" ? "light" : "dark";
      localStorage.setItem("pudimerp_theme", n);
      return n;
    });
  }, []);

  const resetar = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setDb(carregar());
  }, []);

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
        return t + (p ? precoVenda(p) * it.qtd : 0);
      }, 0),
    [db.produtos]
  );

  // ---------- AÇÕES INTEGRADAS ----------

  // Pedidos → cria recebível no financeiro
  const criarPedido = (clienteId, itens, canal) =>
    up((d) => {
      const id = 1000 + Math.floor(Math.random() * 9000);
      const ped = { id, clienteId, canal, status: "Novo", pagamento: "Pendente", itens, obs: "", criado: "agora" };
      d.pedidos.unshift(ped);
      const total = itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + (p ? (p.promo || p.preco) * it.qtd : 0);
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
        return t + (p ? (p.promo || p.preco) * it.qtd : 0);
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
  const registrarVendaRapida = (itens, canal, forma, quando) =>
    up((d) => {
      const id = 7000 + Math.floor(Math.random() * 2999);
      const total = itens.reduce((t, it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        return t + (p ? (p.promo || p.preco) * it.qtd : 0);
      }, 0);
      d.pedidos.unshift({
        id, clienteId: null, canal, status: "Entregue", pagamento: forma,
        itens, obs: "", criado: quando, rapida: true, ts: Date.now(),
      });
      itens.forEach((it) => {
        const p = d.produtos.find((x) => x.id === it.id);
        if (p) p.estoque = Math.max(0, p.estoque - it.qtd);
      });
      d.financeiro.unshift({
        id: uid(), tipo: "receita", cat: "Vendas", desc: `Venda rápida #${id} (${canal})`,
        valor: total, status: "pago", venc: "hoje", origem: "Venda Rápida",
      });
      const un = itens.reduce((t, i) => t + i.qtd, 0);
      log(d, `Venda rápida #${id} — ${canal} · ${un} un · ${forma} · caixa +${total.toFixed(2)}`);
    });

  return {
    db, theme, toggleTheme, resetar,
    // seletores
    custoProduto, margemProduto, totalPedido, precoVenda,
    // ações
    criarPedido, enviarProducao, avancarOrdem, entregarPedido, cancelarPedido,
    receberCompra, liquidar, setPagamento, despacharEntrega, registrarVendaRapida,
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

    const receitaBruta = db.pedidos.filter((p) => p.status !== "Cancelado").reduce((t, p) => t + p.itens.reduce((s, it) => { const pr = db.produtos.find((x) => x.id === it.id); return s + (pr ? precoVenda(pr) * it.qtd : 0); }, 0), 0);
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
