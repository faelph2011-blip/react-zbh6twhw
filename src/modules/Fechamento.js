import { useMemo, useState } from "react";
import { Card, Tag, Empty } from "../erp/ui";
import { brl, pct } from "../erp/format";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const mesLabel = (ym) => { const [a, m] = ym.split("-"); return `${MESES[+m - 1]}/${a}`; };
const fmtDM = (iso) => { const [, m, d] = (iso || "").split("-"); return d ? `${d}/${m}` : iso; };
const segunda = (iso) => { const dt = new Date(iso + "T12:00:00"); const off = (dt.getDay() + 6) % 7; dt.setDate(dt.getDate() - off); return dt.toISOString().slice(0, 10); };
const domingo = (segIso) => { const dt = new Date(segIso + "T12:00:00"); dt.setDate(dt.getDate() + 6); return dt.toISOString().slice(0, 10); };
const ehCusto = (l) => l.cat === "Matéria-prima" || l.cat === "Insumos" || l.origem === "Compras";

export default function Fechamento({ erp }) {
  const { db, totalPedido, custoProduto } = erp;
  const [modo, setModo] = useState("mes"); // mes | semana
  const [hover, setHover] = useState(null);

  const chave = (dia) => (modo === "mes" ? dia.slice(0, 7) : segunda(dia));
  const rotulo = (k) => (modo === "mes" ? mesLabel(k) : `${fmtDM(k)}–${fmtDM(domingo(k))}`);

  const periodos = useMemo(() => {
    const map = {};
    const g = (k) => (map[k] = map[k] || { key: k, fat: 0, cmv: 0, desp: 0, n: 0, un: 0, receb: 0, saiu: 0 });
    db.pedidos.filter((p) => p.status !== "Cancelado").forEach((p) => {
      const dia = p.data || new Date(p.ts || Date.now()).toISOString().slice(0, 10);
      const o = g(chave(dia));
      o.fat += totalPedido(p);
      o.cmv += p.itens.reduce((s, it) => { const pr = db.produtos.find((x) => x.id === it.id); return s + (pr ? custoProduto(pr) * it.qtd : 0); }, 0);
      o.n += 1; o.un += p.itens.reduce((s, i) => s + i.qtd, 0);
    });
    db.financeiro.forEach((l) => {
      if (!l.data) return;
      const o = g(chave(l.data));
      if (l.tipo === "despesa" && l.status === "pago") { o.saiu += l.valor; if (!ehCusto(l)) o.desp += l.valor; }
      if (l.tipo === "receita" && l.status === "pago") o.receb += l.valor;
    });
    return Object.values(map).map((o) => ({
      ...o,
      fat: +o.fat.toFixed(2), cmv: +o.cmv.toFixed(2), desp: +o.desp.toFixed(2),
      lucro: +(o.fat - o.cmv - o.desp).toFixed(2),
      margem: o.fat ? (o.fat - o.cmv - o.desp) / o.fat : 0,
      ticket: o.n ? o.fat / o.n : 0,
      caixa: +(o.receb - o.saiu).toFixed(2),
    })).sort((a, b) => (a.key < b.key ? -1 : 1));
  }, [db, modo, totalPedido, custoProduto]);

  const atual = periodos[periodos.length - 1];
  const anterior = periodos[periodos.length - 2];
  const vari = (a, b) => (b ? (a - b) / Math.abs(b) : null);
  const maxFat = Math.max(1, ...periodos.map((p) => p.fat));

  const totFat = periodos.reduce((t, p) => t + p.fat, 0);
  const totLucro = periodos.reduce((t, p) => t + p.lucro, 0);

  const setinha = (v) => v == null ? null : (
    <span style={{ color: v >= 0 ? "var(--green)" : "var(--red)", fontSize: 12 }}>{v >= 0 ? "▲" : "▼"} {pct(Math.abs(v))}</span>
  );

  return (
    <>
      <div className="topbar">
        <div><h1>📆 Fechamento</h1>
          <div className="sub">Fluxo por {modo === "mes" ? "mês" : "semana"} — faturamento, custo, lucro e margem</div></div>
        <div className="qs-chips" style={{ margin: 0 }}>
          <button className={"qs-chip " + (modo === "mes" ? "on" : "")} onClick={() => setModo("mes")}>Mensal</button>
          <button className={"qs-chip " + (modo === "semana" ? "on" : "")} onClick={() => setModo("semana")}>Semanal</button>
        </div>
      </div>

      {periodos.length === 0 && <Empty>Sem vendas registradas ainda.</Empty>}

      {atual && (
        <div className="grid g4" style={{ marginBottom: 14 }}>
          <Card><div className="k">Faturamento {modo === "mes" ? "do mês" : "da semana"}</div>
            <div className="v" style={{ fontSize: 22 }}>{brl(atual.fat)}</div>
            {anterior && <div>{setinha(vari(atual.fat, anterior.fat))} <span className="mut" style={{ fontSize: 11 }}>vs {rotulo(anterior.key)}</span></div>}</Card>
          <Card><div className="k">Lucro líquido</div>
            <div className="v" style={{ fontSize: 22, color: atual.lucro >= 0 ? "var(--green)" : "var(--red)" }}>{brl(atual.lucro)}</div>
            {anterior && setinha(vari(atual.lucro, anterior.lucro))}</Card>
          <Card><div className="k">Margem</div><div className="v" style={{ fontSize: 22 }}>{pct(atual.margem)}</div>
            <Tag cls="t-org">{atual.n} pedidos</Tag></Card>
          <Card><div className="k">Ticket médio</div><div className="v" style={{ fontSize: 22 }}>{brl(atual.ticket)}</div>
            <Tag cls="t-mut">{atual.un} unid.</Tag></Card>
        </div>
      )}

      {periodos.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div className="hdr"><h2 style={{ margin: 0 }}>Faturamento por {modo === "mes" ? "mês" : "semana"}</h2>
            <Tag cls="t-mut">{brl(totFat)} no total</Tag></div>
          <div className="vd-chart-wrap">
            <div className="vd-yaxis">{[1, 0.5, 0].map((f) => <div key={f} className="vd-yline"><span>{brl(maxFat * f)}</span></div>)}</div>
            <div className="vd-bars">
              {periodos.map((p) => {
                const h = Math.max(2, Math.round((p.fat / maxFat) * 100));
                const on = hover === p.key;
                return (
                  <div key={p.key} className="vd-col" onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)}>
                    <div className="vd-bar-area">
                      {on && <div className="vd-tip"><b>{rotulo(p.key)}</b><br />Fat: {brl(p.fat)}<br />Lucro: {brl(p.lucro)}<br /><span className="mut">{p.n} pedidos</span></div>}
                      <div className={"vd-bar" + (on ? " on" : "")} style={{ height: h + "%" }} />
                    </div>
                    <div className="vd-xlabel">{rotulo(p.key)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {periodos.length > 0 && (
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Detalhe do fechamento</h2>
            <Tag cls="t-grn">lucro total {brl(totLucro)}</Tag></div>
          <div className="scroll-x">
            <table>
              <thead><tr>
                <th>{modo === "mes" ? "Mês" : "Semana"}</th><th>Pedidos</th><th>Faturamento</th>
                <th>CMV</th><th>Desp. oper.</th><th>Lucro</th><th>Margem</th><th>Caixa</th>
              </tr></thead>
              <tbody>
                {[...periodos].reverse().map((p) => (
                  <tr key={p.key}>
                    <td><div className="name" style={{ fontSize: 13 }}>{rotulo(p.key)}</div></td>
                    <td className="num">{p.n} · {p.un}un</td>
                    <td className="num" style={{ fontWeight: 700 }}>{brl(p.fat)}</td>
                    <td className="num" style={{ color: "var(--red)" }}>−{brl(p.cmv)}</td>
                    <td className="num" style={{ color: "var(--red)" }}>−{brl(p.desp)}</td>
                    <td className="num" style={{ fontWeight: 700, color: p.lucro >= 0 ? "var(--green)" : "var(--red)" }}>{brl(p.lucro)}</td>
                    <td className="num">{pct(p.margem)}</td>
                    <td className="num" style={{ color: p.caixa >= 0 ? "var(--txt)" : "var(--red)" }}>{brl(p.caixa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mut" style={{ fontSize: 11.5, marginTop: 10 }}>
            <b>CMV</b> = custo dos ingredientes/embalagem vendidos · <b>Desp. oper.</b> = despesas pagas (aluguel, luz…) fora de matéria-prima ·
            <b> Lucro</b> = Faturamento − CMV − Desp. oper. · <b>Caixa</b> = o que entrou − o que saiu no período.
          </div>
        </Card>
      )}
    </>
  );
}
