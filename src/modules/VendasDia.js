import { useMemo, useState } from "react";
import { Card, Tag, Empty } from "../erp/ui";
import { brl } from "../erp/format";

const CANAL_IC = { Balcão: "🏪", WhatsApp: "💬", Site: "🌐", Delivery: "🛵", Uber: "🚗", iFood: "🛵", Instagram: "📸", Encomenda: "📦" };
const fmtDia = (iso) => { const [a, m, d] = (iso || "").split("-"); return d ? `${d}/${m}` : iso; };
const fmtDiaAno = (iso) => { const [a, m, d] = (iso || "").split("-"); return d ? `${d}/${m}/${a}` : iso; };
const diaSemana = (iso) => { try { return ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"][new Date(iso + "T12:00:00").getDay()]; } catch { return ""; } };

export default function VendasDia({ erp }) {
  const { db, totalPedido } = erp;
  const [hover, setHover] = useState(null);

  const dias = useMemo(() => {
    const porDia = {};
    db.pedidos.filter((p) => p.status !== "Cancelado").forEach((p) => {
      const dia = p.data || new Date(p.ts || Date.now()).toISOString().slice(0, 10);
      if (!porDia[dia]) porDia[dia] = { dia, n: 0, un: 0, valor: 0, canais: {} };
      const t = totalPedido(p);
      porDia[dia].n += 1;
      porDia[dia].un += p.itens.reduce((s, i) => s + i.qtd, 0);
      porDia[dia].valor += t;
      porDia[dia].canais[p.canal] = (porDia[dia].canais[p.canal] || 0) + t;
    });
    return Object.values(porDia).sort((a, b) => (a.dia < b.dia ? -1 : 1));
  }, [db.pedidos, totalPedido]);

  const totalGeral = dias.reduce((t, d) => t + d.valor, 0);
  const totalUn = dias.reduce((t, d) => t + d.un, 0);
  const totalN = dias.reduce((t, d) => t + d.n, 0);
  const maxValor = Math.max(1, ...dias.map((d) => d.valor));
  const melhor = dias.reduce((m, d) => (d.valor > (m?.valor || 0) ? d : m), null);
  const mediaDia = dias.length ? totalGeral / dias.length : 0;

  // mix por canal no período
  const canalTotal = {};
  dias.forEach((d) => Object.entries(d.canais).forEach(([c, v]) => { canalTotal[c] = (canalTotal[c] || 0) + v; }));
  const canaisOrd = Object.entries(canalTotal).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <div className="topbar">
        <div><h1>📅 Vendas por dia</h1>
          <div className="sub">Faturamento diário de todas as vendas — balcão, WhatsApp, site, delivery e encomendas</div></div>
      </div>

      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card><div className="k">Faturamento total</div><div className="v" style={{ fontSize: 22 }}>{brl(totalGeral)}</div><Tag cls="t-grn">{dias.length} dias</Tag></Card>
        <Card><div className="k">Média por dia</div><div className="v" style={{ fontSize: 22 }}>{brl(mediaDia)}</div></Card>
        <Card><div className="k">Melhor dia</div><div className="v" style={{ fontSize: 22 }}>{melhor ? brl(melhor.valor) : "—"}</div>{melhor && <Tag cls="t-org">{fmtDiaAno(melhor.dia)}</Tag>}</Card>
        <Card><div className="k">Pedidos · unidades</div><div className="v" style={{ fontSize: 22 }}>{totalN} · {totalUn}</div></Card>
      </div>

      {dias.length === 0 && <Empty>Nenhuma venda registrada ainda.</Empty>}

      {dias.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div className="hdr"><h2 style={{ margin: 0 }}>Faturamento por dia</h2>
            <Tag cls="t-mut">passe o mouse nas barras</Tag></div>

          <div className="vd-chart-wrap">
            {/* eixo y de referência */}
            <div className="vd-yaxis">
              {[1, 0.5, 0].map((f) => (
                <div key={f} className="vd-yline"><span>{brl(maxValor * f)}</span></div>
              ))}
            </div>
            <div className="vd-bars">
              {dias.map((d) => {
                const h = Math.max(2, Math.round((d.valor / maxValor) * 100));
                const on = hover && hover.dia === d.dia;
                return (
                  <div key={d.dia} className="vd-col"
                    onMouseEnter={() => setHover(d)} onMouseLeave={() => setHover(null)}>
                    <div className="vd-bar-area">
                      {on && (
                        <div className="vd-tip">
                          <b>{fmtDiaAno(d.dia)}</b> · {diaSemana(d.dia)}<br />
                          {brl(d.valor)}<br />
                          <span className="mut">{d.n} pedidos · {d.un} un</span>
                        </div>
                      )}
                      <div className={"vd-bar" + (on ? " on" : "")} style={{ height: h + "%" }} />
                    </div>
                    <div className="vd-xlabel">{fmtDia(d.dia)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      <div className="grid g2">
        <Card>
          <h2>Detalhe por dia</h2>
          <div className="scroll-x">
            <table>
              <thead><tr><th>Dia</th><th>Pedidos</th><th>Unid.</th><th>Ticket</th><th style={{ textAlign: "right" }}>Faturamento</th></tr></thead>
              <tbody>
                {[...dias].reverse().map((d) => (
                  <tr key={d.dia}>
                    <td><div className="name" style={{ fontSize: 13 }}>{fmtDiaAno(d.dia)}</div>
                      <div className="mut" style={{ fontSize: 11 }}>{diaSemana(d.dia)}</div></td>
                    <td className="num">{d.n}</td>
                    <td className="num">{d.un}</td>
                    <td className="num">{brl(d.n ? d.valor / d.n : 0)}</td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 700, color: "var(--brand)" }}>{brl(d.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2>Por canal (período)</h2>
          {canaisOrd.length === 0 && <div className="mut">Sem dados.</div>}
          {canaisOrd.map(([c, v]) => {
            const pct = totalGeral ? Math.round((v / totalGeral) * 100) : 0;
            return (
              <div key={c} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{CANAL_IC[c] || "🧾"} {c}</span>
                  <span className="num" style={{ fontWeight: 600 }}>{brl(v)} <span className="mut">· {pct}%</span></span>
                </div>
                <div className="vd-track"><div className="vd-fill" style={{ width: pct + "%" }} /></div>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}
