import { useMemo, useState } from "react";
import { Card, Tag, Btn, KPI, Modal } from "../erp/ui";
import { brl, pct } from "../erp/format";

const CATS_DESPESA = ["Aluguel", "Energia", "Água", "Gás", "Ingredientes", "Embalagens", "Pró-labore", "Marketing", "Impostos", "Transporte", "Outros"];
const CATS_RECEITA = ["Venda avulsa", "Encomenda", "Outras receitas"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const mesLabel = (ym) => { const [a, m] = ym.split("-"); return `${MESES[+m - 1]}/${a}`; };
const ehCusto = (l) => l.cat === "Matéria-prima" || l.cat === "Insumos" || l.origem === "Compras";

export default function Financeiro({ erp, k }) {
  const { db, totalPedido, custoProduto, liquidar, lancarFinanceiro, excluirLancamento, definirSaldoInicial } = erp;
  const [novo, setNovo] = useState(null); // "despesa" | "receita"
  const [saldoModal, setSaldoModal] = useState(false);

  // meses com movimento (para o seletor do DRE)
  const meses = useMemo(() => {
    const set = new Set();
    db.pedidos.forEach((p) => { if (p.data) set.add(p.data.slice(0, 7)); });
    db.financeiro.forEach((l) => { if (l.data) set.add(l.data.slice(0, 7)); });
    return [...set].sort((a, b) => (a < b ? 1 : -1));
  }, [db.pedidos, db.financeiro]);
  const [mes, setMes] = useState(() => new Date().toISOString().slice(0, 7));

  const noPeriodo = (dia) => mes === "todos" || (dia && dia.slice(0, 7) === mes);

  // DRE do período selecionado
  const dre = useMemo(() => {
    let receitaBruta = 0, cmv = 0, nPedidos = 0, un = 0;
    db.pedidos.filter((p) => p.status !== "Cancelado").forEach((p) => {
      const dia = p.data || new Date(p.ts || Date.now()).toISOString().slice(0, 10);
      if (!noPeriodo(dia)) return;
      receitaBruta += totalPedido(p);
      cmv += p.itens.reduce((s, it) => { const pr = db.produtos.find((x) => x.id === it.id); return s + (pr ? custoProduto(pr) * it.qtd : 0); }, 0);
      nPedidos += 1; un += p.itens.reduce((s, i) => s + i.qtd, 0);
    });
    let despOper = 0, pago = 0, recebido = 0; const porCat = {};
    db.financeiro.forEach((l) => {
      if (!noPeriodo(l.data)) return;
      if (l.tipo === "despesa" && l.status === "pago") { pago += l.valor; if (!ehCusto(l)) { despOper += l.valor; porCat[l.cat || "Outros"] = (porCat[l.cat || "Outros"] || 0) + l.valor; } }
      if (l.tipo === "receita" && l.status === "pago") recebido += l.valor;
    });
    const lucroBruto = receitaBruta - cmv;
    const lucroLiq = lucroBruto - despOper;
    return {
      receitaBruta, cmv, lucroBruto, despOper, lucroLiq,
      margem: receitaBruta ? lucroLiq / receitaBruta : 0,
      nPedidos, un, ticket: nPedidos ? receitaBruta / nPedidos : 0,
      porCat: Object.entries(porCat).sort((a, b) => b[1] - a[1]),
      caixaPeriodo: recebido - pago, recebido, pago,
    };
  }, [db, mes, totalPedido, custoProduto]);

  // valor do estoque atual (capital imobilizado)
  const estoque = useMemo(() => {
    const valInsumos = db.insumos.reduce((t, i) => t + (i.estoque || 0) * (i.custo || 0), 0);
    const valProntos = db.produtos.reduce((t, p) => t + (p.estoque || 0) * custoProduto(p), 0);
    const porCat = {};
    db.insumos.forEach((i) => { const v = (i.estoque || 0) * (i.custo || 0); porCat[i.cat || "Outros"] = (porCat[i.cat || "Outros"] || 0) + v; });
    return { valInsumos, valProntos, total: valInsumos + valProntos, porCat: Object.entries(porCat).sort((a, b) => b[1] - a[1]) };
  }, [db.insumos, db.produtos, custoProduto]);

  const receber = db.financeiro.filter((l) => l.tipo === "receita" && l.status === "aberto");
  const pagar = db.financeiro.filter((l) => l.tipo === "despesa" && l.status === "aberto");

  const dreLinhas = [
    { label: "Receita bruta de vendas", v: dre.receitaBruta, tipo: "+" },
    { label: "(–) CMV (custo dos produtos)", v: -dre.cmv, tipo: "-" },
    { label: "= Lucro bruto", v: dre.lucroBruto, tipo: "=" },
    { label: "(–) Despesas operacionais", v: -dre.despOper, tipo: "-" },
    { label: "= Lucro líquido", v: dre.lucroLiq, tipo: "==" },
  ];

  const linha = (l) => (
    <div className="row" key={l.id}>
      <div style={{ flex: 1 }}>
        <div className="name" style={{ fontSize: 13 }}>{l.desc}{l.origem === "Manual" && <span className="mut" style={{ fontSize: 10.5 }}> · manual</span>}</div>
        <div className="mut" style={{ fontSize: 11.5 }}>{l.cat} · venc. {l.venc}{l.por ? ` · 🧑 ${l.por}` : ""}</div>
      </div>
      <span className="num" style={{ color: l.tipo === "receita" ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{brl(l.valor)}</span>
      {l.status === "aberto"
        ? <Btn variant="mini soft" onClick={() => liquidar(l.id)}>{l.tipo === "receita" ? "Baixar" : "Pagar"}</Btn>
        : <Tag cls={l.status === "pago" ? "t-grn" : "t-mut"}>{l.status}</Tag>}
      {l.origem === "Manual" && excluirLancamento &&
        <button className="lixo" title="Excluir lançamento" onClick={() => excluirLancamento(l.id)}>✕</button>}
    </div>
  );

  const periodoLabel = mes === "todos" ? "todo o período" : mesLabel(mes);

  return (
    <>
      <div className="topbar">
        <div><h1>Financeiro</h1>
          <div className="sub">DRE mensal, fluxo de caixa, capital em estoque e centro de custos</div></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select value={mes} onChange={(e) => setMes(e.target.value)} title="Mês do DRE" style={{ width: "auto", minWidth: 130 }}>
            <option value="todos">📅 Todo o período</option>
            {meses.map((m) => <option key={m} value={m}>{mesLabel(m)}</option>)}
          </select>
          <Btn variant="soft" onClick={() => setSaldoModal(true)}>💵 Saldo inicial</Btn>
          <Btn variant="soft" onClick={() => setNovo("receita")}>＋ Receita</Btn>
          <Btn onClick={() => setNovo("despesa")}>＋ Despesa</Btn>
        </div>
      </div>

      <div className="grid g4">
        <KPI ic="🟢" label="A receber" value={brl(k.aReceber)} tag="pendente" tagCls="t-blu" />
        <KPI ic="🔴" label="A pagar" value={brl(k.aPagar)} tag="obrigações" tagCls="t-red" />
        <KPI ic="💵" label="Saldo em caixa" value={brl(k.caixa)} tag={`inicial ${brl(k.saldoInicial || 0)}`} tagCls={k.caixa >= 0 ? "t-grn" : "t-red"} />
        <KPI ic="📦" label="Valor em estoque" value={brl(estoque.total)} tag="capital imobilizado" tagCls="t-org" />
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>DRE — {periodoLabel}</h2>
            <Tag cls={dre.lucroLiq >= 0 ? "t-grn" : "t-red"}>{pct(dre.margem)}</Tag></div>
          {dreLinhas.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0",
              borderBottom: "1px solid var(--line)", fontWeight: d.tipo.includes("=") ? 700 : 400,
              fontSize: d.tipo.includes("=") ? 14 : 13 }}>
              <span className={d.tipo.includes("=") ? "" : "mut"}>{d.label}</span>
              <span className="num" style={{ color: d.v >= 0 ? (d.tipo === "==" ? "var(--brand)" : "var(--txt)") : "var(--red)" }}>{brl(d.v)}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            <Tag cls="t-mut">{dre.nPedidos} pedidos</Tag>
            <Tag cls="t-mut">{dre.un} unid.</Tag>
            <Tag cls="t-mut">ticket {brl(dre.ticket)}</Tag>
            <Tag cls={dre.caixaPeriodo >= 0 ? "t-grn" : "t-red"}>caixa do mês {brl(dre.caixaPeriodo)}</Tag>
          </div>
        </Card>

        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Capital em estoque</h2><Tag cls="t-org">{brl(estoque.total)}</Tag></div>
          <div className="row"><div style={{ flex: 1 }} className="name" >🧂 Insumos & embalagens</div><span className="num" style={{ fontWeight: 600 }}>{brl(estoque.valInsumos)}</span></div>
          <div className="row"><div style={{ flex: 1 }} className="name">🍮 Pudins prontos</div><span className="num" style={{ fontWeight: 600 }}>{brl(estoque.valProntos)}</span></div>
          <div className="divider" style={{ margin: "8px 0" }} />
          <div className="mut" style={{ fontSize: 11.5, marginBottom: 6 }}>Insumos por categoria</div>
          {estoque.porCat.map(([c, v]) => (
            <div className="row" key={c} style={{ padding: "4px 0" }}>
              <div style={{ flex: 1, fontSize: 12.5 }}>{c}</div>
              <span className="num" style={{ fontSize: 12.5 }}>{brl(v)}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Despesas — {periodoLabel}</h2><Tag cls="t-red">{brl(dre.despOper + dre.cmv)}</Tag></div>
          <div className="row"><div style={{ flex: 1 }} className="name">🍫 Custo dos produtos (CMV)</div><span className="num" style={{ color: "var(--red)", fontWeight: 600 }}>{brl(dre.cmv)}</span></div>
          <div className="divider" style={{ margin: "8px 0" }} />
          <div className="mut" style={{ fontSize: 11.5, marginBottom: 6 }}>Despesas operacionais por categoria</div>
          {dre.porCat.length === 0 && <div className="mut" style={{ fontSize: 12.5 }}>Nenhuma despesa operacional no período.</div>}
          {dre.porCat.map(([c, v]) => (
            <div className="row" key={c} style={{ padding: "4px 0" }}>
              <div style={{ flex: 1, fontSize: 12.5 }}>{c}</div>
              <span className="num" style={{ fontSize: 12.5, color: "var(--red)" }}>{brl(v)}</span>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Contas a receber</h2><Tag cls="t-blu">{brl(k.aReceber)}</Tag></div>
          {receber.length === 0 && <div className="mut" style={{ fontSize: 12.5, padding: "6px 0" }}>Nada a receber. 🎉</div>}
          {receber.map(linha)}
        </Card>
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Contas a pagar</h2><Tag cls="t-red">{brl(k.aPagar)}</Tag></div>
          {pagar.length === 0 && <div className="mut" style={{ fontSize: 12.5, padding: "6px 0" }}>Nada a pagar. 🎉</div>}
          {pagar.map(linha)}
        </Card>
      </div>

      {novo && <NovoLancamento tipo={novo} onClose={() => setNovo(null)} onSalvar={(dados) => { lancarFinanceiro(dados); setNovo(null); }} />}
      {saldoModal && <SaldoInicial atual={k.saldoInicial || 0} onClose={() => setSaldoModal(false)} onSalvar={(v) => { definirSaldoInicial(v); setSaldoModal(false); }} />}
    </>
  );
}

function NovoLancamento({ tipo, onClose, onSalvar }) {
  const receita = tipo === "receita";
  const cats = receita ? CATS_RECEITA : CATS_DESPESA;
  const [desc, setDesc] = useState("");
  const [valor, setValor] = useState("");
  const [cat, setCat] = useState(cats[0]);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [pago, setPago] = useState(receita ? false : true);
  const [erro, setErro] = useState("");

  const salvar = () => {
    const v = Number(String(valor).replace(",", "."));
    if (!(v > 0)) { setErro("Informe um valor maior que zero."); return; }
    onSalvar({ tipo, cat, desc, valor: v, data, venc: data, status: pago ? "pago" : "aberto" });
  };

  return (
    <Modal title={receita ? "＋ Nova receita" : "＋ Nova despesa"} onClose={onClose}>
      <div className="field"><label>Descrição</label>
        <input autoFocus value={desc} placeholder={receita ? "Ex: Encomenda festa" : "Ex: Aluguel de agosto"}
          onChange={(e) => { setDesc(e.target.value); setErro(""); }} /></div>
      <div className="field"><label>Valor (R$)</label>
        <input value={valor} inputMode="decimal" placeholder="Ex: 350,00"
          onChange={(e) => { setValor(e.target.value); setErro(""); }} /></div>
      <div className="field"><label>Categoria</label>
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select></div>
      <div className="field"><label>Data</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
      <div className="field"><label>Situação</label>
        <div className="pay-opts">
          <button type="button" className={"pay-opt" + (pago ? " on" : "")} onClick={() => setPago(true)}>
            {receita ? "✅ Recebido" : "✅ Pago"}<small>já entrou/saiu do caixa</small></button>
          <button type="button" className={"pay-opt" + (!pago ? " on" : "")} onClick={() => setPago(false)}>
            ⏳ Em aberto<small>{receita ? "a receber" : "a pagar"}</small></button>
        </div>
      </div>
      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">{erro}</span></div>}
      <Btn onClick={salvar}>Lançar {receita ? "receita" : "despesa"}</Btn>
    </Modal>
  );
}

function SaldoInicial({ atual, onClose, onSalvar }) {
  const [valor, setValor] = useState(String(atual || ""));
  return (
    <Modal title="💵 Saldo inicial de caixa" onClose={onClose}>
      <p className="mut" style={{ fontSize: 13, marginBottom: 14 }}>
        Quanto você tem em caixa hoje (dinheiro + conta) antes de lançar as movimentações? Esse valor é o ponto de partida do seu fluxo de caixa.
      </p>
      <div className="field"><label>Saldo atual (R$)</label>
        <input autoFocus value={valor} inputMode="decimal" placeholder="Ex: 1200,00"
          onChange={(e) => setValor(e.target.value)} /></div>
      <Btn onClick={() => onSalvar(Number(String(valor).replace(",", ".")) || 0)}>Salvar saldo inicial</Btn>
    </Modal>
  );
}
