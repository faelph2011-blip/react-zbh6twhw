import { useState } from "react";
import { Card, Tag, Btn, KPI, Modal } from "../erp/ui";
import { brl, pct } from "../erp/format";

const CATS_DESPESA = ["Aluguel", "Energia", "Água", "Gás", "Ingredientes", "Embalagens", "Pró-labore", "Marketing", "Impostos", "Transporte", "Outros"];
const CATS_RECEITA = ["Venda avulsa", "Encomenda", "Outras receitas"];

export default function Financeiro({ erp, k }) {
  const { db, liquidar, lancarFinanceiro, excluirLancamento, definirSaldoInicial } = erp;
  const receber = db.financeiro.filter((l) => l.tipo === "receita");
  const pagar = db.financeiro.filter((l) => l.tipo === "despesa");
  const [novo, setNovo] = useState(null); // "despesa" | "receita"
  const [saldoModal, setSaldoModal] = useState(false);

  // DRE simplificado
  const dre = [
    { label: "Receita bruta de vendas", v: k.receitaBruta, tipo: "+" },
    { label: "(–) CMV (custo dos produtos)", v: -k.cmv, tipo: "-" },
    { label: "= Lucro bruto", v: k.lucroBruto, tipo: "=" },
    { label: "(–) Despesas operacionais", v: -k.despesasOperacionais, tipo: "-" },
    { label: "= Lucro líquido", v: k.lucroLiquido, tipo: "==" },
  ];

  const linha = (l) => (
    <div className="row" key={l.id}>
      <div style={{ flex: 1 }}>
        <div className="name" style={{ fontSize: 13 }}>{l.desc}{l.origem === "Manual" && <span className="mut" style={{ fontSize: 10.5 }}> · manual</span>}</div>
        <div className="mut" style={{ fontSize: 11.5 }}>{l.cat} · venc. {l.venc}</div>
      </div>
      <span className="num" style={{ color: l.tipo === "receita" ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{brl(l.valor)}</span>
      {l.status === "aberto"
        ? <Btn variant="mini soft" onClick={() => liquidar(l.id)}>{l.tipo === "receita" ? "Baixar" : "Pagar"}</Btn>
        : <Tag cls={l.status === "pago" ? "t-grn" : "t-mut"}>{l.status}</Tag>}
      {l.origem === "Manual" && excluirLancamento &&
        <button className="lixo" title="Excluir lançamento" onClick={() => excluirLancamento(l.id)}>✕</button>}
    </div>
  );

  return (
    <>
      <div className="topbar">
        <div><h1>Financeiro</h1>
          <div className="sub">Contas a pagar/receber, fluxo de caixa, DRE e centro de custos</div></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn variant="soft" onClick={() => setSaldoModal(true)}>💵 Saldo inicial</Btn>
          <Btn variant="soft" onClick={() => setNovo("receita")}>＋ Receita</Btn>
          <Btn onClick={() => setNovo("despesa")}>＋ Despesa</Btn>
        </div>
      </div>

      <div className="grid g4">
        <KPI ic="🟢" label="A receber" value={brl(k.aReceber)} tag="pendente" tagCls="t-blu" />
        <KPI ic="🔴" label="A pagar" value={brl(k.aPagar)} tag="obrigações" tagCls="t-red" />
        <KPI ic="💵" label="Saldo em caixa" value={brl(k.caixa)} tag={`inicial ${brl(k.saldoInicial || 0)}`} tagCls={k.caixa >= 0 ? "t-grn" : "t-red"} />
        <KPI ic="📊" label="Margem líquida" value={pct(k.receitaBruta ? k.lucroLiquido / k.receitaBruta : 0)} tag="sobre receita" tagCls="t-org" />
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <Card>
          <h2>Contas a receber</h2>
          {receber.length === 0 && <div className="mut" style={{ fontSize: 12.5, padding: "6px 0" }}>Nenhum lançamento.</div>}
          {receber.map(linha)}
        </Card>

        <Card>
          <h2>Contas a pagar</h2>
          {pagar.length === 0 && <div className="mut" style={{ fontSize: 12.5, padding: "6px 0" }}>Nenhuma despesa lançada. Use “＋ Despesa”.</div>}
          {pagar.map(linha)}
        </Card>

        <Card>
          <h2>DRE do período</h2>
          {dre.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0",
              borderBottom: "1px solid var(--line)", fontWeight: d.tipo.includes("=") ? 700 : 400,
              fontSize: d.tipo.includes("=") ? 14 : 13 }}>
              <span className={d.tipo.includes("=") ? "" : "mut"}>{d.label}</span>
              <span className="num" style={{ color: d.v >= 0 ? (d.tipo === "==" ? "var(--brand)" : "var(--txt)") : "var(--red)" }}>{brl(d.v)}</span>
            </div>
          ))}
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
