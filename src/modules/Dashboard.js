import { Card, KPI, Tag, Bar, Sparkbars, Donut } from "../erp/ui";
import { brl, pct, num, hoje } from "../erp/format";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const CORES = ["var(--brand)", "var(--caramel)", "var(--brand-soft)"];

export default function Dashboard({ erp, k, go }) {
  const { db, totalPedido, precoVenda } = erp;

  // Série real de vendas dos últimos 7 dias (pela data do pedido)
  const dias7 = [...Array(7)].map((_, i) => { const dt = new Date(); dt.setHours(12, 0, 0, 0); dt.setDate(dt.getDate() - (6 - i)); return dt; });
  const serie = dias7.map((dt) => {
    const iso = dt.toISOString().slice(0, 10);
    return db.pedidos.filter((p) => p.status !== "Cancelado" && p.data === iso).reduce((t, p) => t + totalPedido(p), 0);
  });
  const labels = dias7.map((dt) => DIAS[dt.getDay()]);
  const totalSemana = serie.reduce((a, b) => a + b, 0);

  // Composição de receita real (por produto)
  const compRaw = db.produtos.map((p, i) => {
    const q = (k.topProdutos.find((t) => t.prod.id === p.id) || {}).q || 0;
    return { label: p.nome.replace("Pudim ", ""), v: q * precoVenda(p), color: CORES[i % CORES.length] };
  }).filter((s) => s.v > 0);
  const totComp = compRaw.reduce((a, b) => a + b.v, 0) || 1;
  const comp = compRaw.map((s) => ({ ...s, v: Math.round((s.v / totComp) * 100) }));

  const nAlertas = k.alertasInsumo.length + k.alertasProduto.length;

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Dashboard Executivo</h1>
          <div className="sub">Visão consolidada · {hoje()} — todos os módulos integrados em tempo real</div>
        </div>
        <div className="pill">{nAlertas === 0 ? "🟢 Operação saudável" : `🟠 ${nAlertas} alerta(s) ativo(s)`}</div>
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
              <div className="v" style={{ fontSize: 22 }}>{brl(totalSemana)}</div></div>
            {totalSemana > 0 && <Tag cls="t-grn">{db.pedidos.filter((p) => p.status !== "Cancelado").length} pedidos</Tag>}
          </div>
          <Sparkbars data={serie} height={120} />
          <div className="mut" style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {labels.map((d, i) => <span key={i}>{d}</span>)}
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
          {comp.length === 0 && <div className="mut">Sem vendas ainda — a composição aparece conforme os pedidos.</div>}
          {comp.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Donut segments={comp} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {comp.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  {s.label} <b style={{ marginLeft: "auto" }}>{s.v}%</b>
                </div>
              ))}
            </div>
          </div>}
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
