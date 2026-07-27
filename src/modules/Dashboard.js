import { Card, KPI, Tag, Bar, Sparkbars, Donut } from "../erp/ui";
import { brl, pct, num, hoje } from "../erp/format";
import { serieVendas } from "../erp/seed";

export default function Dashboard({ erp, k, go }) {
  const { db } = erp;
  const comp = [
    { label: "Tradicional", v: 42, color: "var(--brand)" },
    { label: "Especiais", v: 28, color: "var(--caramel)" },
    { label: "Individual", v: 30, color: "var(--brand-soft)" },
  ];
  return (
    <>
      <div className="topbar">
        <div>
          <h1>Dashboard Executivo</h1>
          <div className="sub">Visão consolidada · {hoje()} — todos os módulos integrados em tempo real</div>
        </div>
        <div className="pill">🟢 Operação saudável · 3 alertas ativos</div>
      </div>

      <div className="grid g4">
        <KPI ic="💰" label="Receita (caixa)" value={brl(k.receitaPaga)} tag={`+${brl(k.aReceber)} a receber`} tagCls="t-blu" />
        <KPI ic="📈" label="Lucro bruto" value={brl(k.lucroBruto)} tag={pct(k.margemMedia) + " margem média"} tagCls="t-grn" />
        <KPI ic="🎯" label="Ticket médio" value={brl(k.ticket)} tag={`${k.recorrentes} clientes recorrentes`} tagCls="t-org" />
        <KPI ic="🍮" label="Produzido / vendido" value={`${num(k.produzidos)}/${num(k.vendidos)}`} unit="un" tag={`${k.emProducao} em produção`} tagCls="t-pur" />
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <Card style={{ gridColumn: "span 2" }}>
          <div className="hdr" style={{ marginBottom: 6 }}>
            <div><div className="k">Vendas · últimos 7 dias</div>
              <div className="v" style={{ fontSize: 22 }}>{brl(serieVendas.reduce((a, b) => a + b, 0))}</div></div>
            <Tag cls="t-grn">▲ 18% vs. semana anterior</Tag>
          </div>
          <Sparkbars data={serieVendas} height={120} />
          <div className="mut" style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </Card>

        <Card>
          <div className="k" style={{ marginBottom: 10 }}>Fluxo de caixa</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Linha label="Entradas (pagas)" v={brl(k.receitaPaga)} cls="t-grn" />
            <Linha label="A receber" v={brl(k.aReceber)} cls="t-blu" />
            <Linha label="Saídas (pagas)" v={brl(-k.despesasPagas)} cls="t-red" />
            <Linha label="A pagar" v={brl(-k.aPagar)} cls="t-org" />
            <div className="divider" style={{ margin: "6px 0" }} />
            <Linha label="Saldo em caixa" v={brl(k.caixa)} cls={k.caixa >= 0 ? "t-grn" : "t-red"} big />
          </div>
        </Card>
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Produtos mais vendidos</h2><Tag cls="t-org" >ranking</Tag></div>
          {k.topProdutos.length === 0 && <div className="mut">Sem vendas ainda.</div>}
          {k.topProdutos.slice(0, 4).map(({ prod, q }, i) => (
            <div className="row" key={prod.id}>
              <div className="thumb" style={{ background: prod.grad }}>{prod.emoji}</div>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 13.5 }}>{prod.nome}</div>
                <Bar value={q} max={k.topProdutos[0].q} />
              </div>
              <div className="num" style={{ fontWeight: 600 }}>{q}×</div>
            </div>
          ))}
        </Card>

        <Card>
          <h2>Composição de receita</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Donut segments={comp} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {comp.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  {s.label} <b style={{ marginLeft: "auto" }}>{s.v}%</b>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Alertas inteligentes</h2><Tag cls="t-red">{k.alertasInsumo.length + k.alertasProduto.length}</Tag></div>
          {k.alertasInsumo.map((i) => (
            <div className="feed-item" key={i.id} style={{ color: "var(--red)" }}>
              Estoque baixo: <b>{i.nome}</b> ({i.estoque}{i.un} / mín {i.min})
            </div>
          ))}
          {k.alertasProduto.map((p) => (
            <div className="feed-item" key={p.id} style={{ color: "var(--brand)" }}>
              Produto acabando: <b>{p.nome}</b> ({p.estoque}un)
            </div>
          ))}
          {k.cancelados > 0 && <div className="feed-item">{k.cancelados} pedido(s) cancelado(s) hoje</div>}
          <button className="btn soft mini" style={{ marginTop: 12 }} onClick={() => go("compras")}>Resolver em Compras →</button>
        </Card>
      </div>

      <Card style={{ marginTop: 14 }}>
        <h2>Trilha de eventos do domínio</h2>
        <div className="grid g2">
          <div>{db.feed.slice(0, 6).map((f, i) => <div className="feed-item" key={i}>{f}</div>)}</div>
          <div>{db.feed.slice(6, 12).map((f, i) => <div className="feed-item" key={i}>{f}</div>)}</div>
        </div>
      </Card>
    </>
  );
}

const Linha = ({ label, v, cls, big }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span className="mut" style={{ fontSize: big ? 13 : 12.5 }}>{label}</span>
    <span className={"num tag " + cls} style={{ fontSize: big ? 14 : 12.5, background: "transparent", padding: 0, fontWeight: 700 }}>{v}</span>
  </div>
);
