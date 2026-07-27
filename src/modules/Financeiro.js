import { Card, Tag, Btn, KPI } from "../erp/ui";
import { brl, pct } from "../erp/format";

export default function Financeiro({ erp, k }) {
  const { db, liquidar } = erp;
  const receber = db.financeiro.filter((l) => l.tipo === "receita");
  const pagar = db.financeiro.filter((l) => l.tipo === "despesa");

  // DRE simplificado
  const dre = [
    { label: "Receita bruta de vendas", v: k.receitaBruta, tipo: "+" },
    { label: "(–) CMV (custo dos produtos)", v: -k.cmv, tipo: "-" },
    { label: "= Lucro bruto", v: k.lucroBruto, tipo: "=" },
    { label: "(–) Despesas operacionais", v: -k.despesasPagas, tipo: "-" },
    { label: "= Lucro líquido", v: k.lucroLiquido, tipo: "==" },
  ];

  return (
    <>
      <div className="topbar">
        <div><h1>Financeiro</h1>
          <div className="sub">Contas a pagar/receber, fluxo de caixa, DRE e centro de custos</div></div>
      </div>

      <div className="grid g4">
        <KPI ic="🟢" label="A receber" value={brl(k.aReceber)} tag="pendente" tagCls="t-blu" />
        <KPI ic="🔴" label="A pagar" value={brl(k.aPagar)} tag="obrigações" tagCls="t-red" />
        <KPI ic="💵" label="Saldo em caixa" value={brl(k.caixa)} tag="realizado" tagCls={k.caixa >= 0 ? "t-grn" : "t-red"} />
        <KPI ic="📊" label="Margem líquida" value={pct(k.receitaBruta ? k.lucroLiquido / k.receitaBruta : 0)} tag="sobre receita" tagCls="t-org" />
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <Card>
          <h2>Contas a receber</h2>
          {receber.map((l) => (
            <div className="row" key={l.id}>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13 }}>{l.desc}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>{l.cat} · venc. {l.venc}</div></div>
              <span className="num" style={{ color: "var(--green)", fontWeight: 600 }}>{brl(l.valor)}</span>
              {l.status === "aberto" ? <Btn variant="mini soft" onClick={() => liquidar(l.id)}>Baixar</Btn>
                : <Tag cls={l.status === "pago" ? "t-grn" : "t-mut"}>{l.status}</Tag>}
            </div>
          ))}
        </Card>

        <Card>
          <h2>Contas a pagar</h2>
          {pagar.map((l) => (
            <div className="row" key={l.id}>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13 }}>{l.desc}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>{l.cat} · venc. {l.venc}</div></div>
              <span className="num" style={{ color: "var(--red)", fontWeight: 600 }}>{brl(l.valor)}</span>
              {l.status === "aberto" ? <Btn variant="mini soft" onClick={() => liquidar(l.id)}>Pagar</Btn>
                : <Tag cls="t-grn">pago</Tag>}
            </div>
          ))}
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
          <div className="divider" />
          <div className="k" style={{ marginBottom: 8 }}>Formas de pagamento (mix)</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag cls="t-grn">PIX 54%</Tag><Tag cls="t-blu">Cartão 31%</Tag>
            <Tag cls="t-org">Dinheiro 12%</Tag><Tag cls="t-mut">Boleto 3%</Tag>
          </div>
        </Card>
      </div>
    </>
  );
}
