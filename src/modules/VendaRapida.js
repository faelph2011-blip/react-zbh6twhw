import { useMemo, useState } from "react";
import { Card, Tag, Btn, Empty } from "../erp/ui";
import { brl, num } from "../erp/format";

const CANAIS = [
  ["Balcão", "🏪"], ["iFood", "🛵"], ["Uber", "🚗"], ["WhatsApp", "💬"],
  ["Instagram", "📸"], ["Encomenda", "📦"],
];
const FORMAS = ["PIX", "Dinheiro", "Cartão", "App"];

const agora = () =>
  "hoje " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const hojeISO = () => new Date().toISOString().slice(0, 10);

export default function VendaRapida({ erp }) {
  const { db, precoVenda, registrarVendaRapida } = erp;
  const [canal, setCanal] = useState("Balcão");
  const [forma, setForma] = useState("PIX");
  const [cart, setCart] = useState({});
  const [manual, setManual] = useState("");
  const [data, setData] = useState(hojeISO());
  const hoje = hojeISO();
  const retroativo = data !== hoje;

  const add = (id, d) =>
    setCart((c) => {
      const q = (c[id] || 0) + d;
      const n = { ...c };
      if (q <= 0) delete n[id]; else n[id] = q;
      return n;
    });

  const itens = Object.entries(cart).map(([id, qtd]) => ({ id, qtd }));
  const total = itens.reduce((t, it) => {
    const p = db.produtos.find((x) => x.id === it.id);
    return t + (p ? precoVenda(p) * it.qtd : 0);
  }, 0);
  const totalUn = itens.reduce((t, i) => t + i.qtd, 0);

  const registrar = () => {
    if (!itens.length) return;
    let quando;
    if (!retroativo) {
      quando = manual ? "hoje " + manual : agora();
    } else {
      const dLabel = new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      quando = manual ? `${dLabel} ${manual}` : dLabel;
    }
    registrarVendaRapida(itens, canal, forma, quando, data);
    setCart({});
    setManual("");
    setData(hoje);
  };

  // vendas rápidas de hoje (resumo)
  const vendasHoje = useMemo(() => db.pedidos.filter((p) => p.rapida), [db.pedidos]);
  const resumo = useMemo(() => {
    let un = 0, valor = 0;
    const porCanal = {};
    vendasHoje.forEach((v) => {
      const t = v.itens.reduce((s, it) => {
        const p = db.produtos.find((x) => x.id === it.id);
        return s + (p ? precoVenda(p) * it.qtd : 0);
      }, 0);
      valor += t;
      un += v.itens.reduce((s, i) => s + i.qtd, 0);
      porCanal[v.canal] = (porCanal[v.canal] || 0) + t;
    });
    return { un, valor, n: vendasHoje.length, porCanal };
  }, [vendasHoje, db.produtos, precoVenda]);

  return (
    <>
      <div className="topbar">
        <div><h1>⚡ Venda Rápida</h1>
          <div className="sub">Registre a venda em segundos — feito pro balcão e pro celular</div></div>
        <div className="pill">🧾 {resumo.n} vendas hoje · {brl(resumo.valor)}</div>
      </div>

      {/* Canal */}
      <label>Canal da venda</label>
      <div className="qs-chips">
        {CANAIS.map(([c, ic]) => (
          <button key={c} className={"qs-chip " + (canal === c ? "on" : "")} onClick={() => setCanal(c)}>
            <span>{ic}</span>{c}
          </button>
        ))}
      </div>

      {/* Produtos — toque para adicionar */}
      <label style={{ marginTop: 6 }}>Produtos vendidos (toque para somar)</label>
      <div className="qs-grid">
        {db.produtos.map((p) => {
          const q = cart[p.id] || 0;
          return (
            <div key={p.id} className={"qs-tile " + (q ? "sel" : "")} onClick={() => add(p.id, 1)}>
              {q > 0 && <span className="qs-qty">{q}</span>}
              <div className="em">{p.emoji}</div>
              <div className="name" style={{ fontSize: 13, marginTop: 4 }}>{p.nome}</div>
              <div style={{ color: "var(--brand)", fontWeight: 700, marginTop: 2 }}>{brl(precoVenda(p))}</div>
              {q > 0 && (
                <button className="qs-minus" onClick={(e) => { e.stopPropagation(); add(p.id, -1); }}>−</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra de registro (sticky) */}
      <div className="qs-bar">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
          {FORMAS.map((f) => (
            <button key={f} className={"qs-chip " + (forma === f ? "on" : "")} onClick={() => setForma(f)}>{f}</button>
          ))}
          <input type="date" max={hoje} value={data} onChange={(e) => setData(e.target.value || hoje)}
            title="Data da venda (hoje ou um dia passado)" style={{ minWidth: 150 }} />
          <input placeholder="horário (ex: 14:30) · opcional" value={manual}
            onChange={(e) => setManual(e.target.value)} style={{ flex: 1, minWidth: 130 }} />
          {retroativo && <span className="tag t-org">📅 lançamento retroativo</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div className="mut" style={{ fontSize: 11.5 }}>{totalUn} un · {canal} · {forma}</div>
            <div className="num" style={{ fontSize: 24, fontWeight: 700 }}>{brl(total)}</div>
          </div>
          <Btn className="" onClick={registrar} disabled={!itens.length}
            variant="" >
            <span style={{ fontSize: 15 }}>✓ Registrar venda</span>
          </Btn>
        </div>
      </div>

      {/* Resumo do dia */}
      <div className="grid g4" style={{ marginTop: 18 }}>
        <Card><div className="k">Vendas hoje</div><div className="v" style={{ fontSize: 22 }}>{resumo.n}</div></Card>
        <Card><div className="k">Unidades vendidas</div><div className="v" style={{ fontSize: 22 }}>{num(resumo.un)}</div></Card>
        <Card><div className="k">Faturamento hoje</div><div className="v" style={{ fontSize: 22 }}>{brl(resumo.valor)}</div></Card>
        <Card><div className="k">Ticket médio</div><div className="v" style={{ fontSize: 22 }}>{brl(resumo.n ? resumo.valor / resumo.n : 0)}</div></Card>
      </div>

      <Card style={{ marginTop: 14 }}>
        <div className="hdr"><h2 style={{ margin: 0 }}>Últimas vendas rápidas</h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(resumo.porCanal).map(([c, v]) => <Tag key={c} cls="t-mut">{c} {brl(v)}</Tag>)}
          </div>
        </div>
        {vendasHoje.length === 0 && <Empty>Nenhuma venda rápida ainda. Registre a primeira acima. ⚡</Empty>}
        {vendasHoje.slice(0, 12).map((v) => {
          const t = v.itens.reduce((s, it) => { const p = db.produtos.find((x) => x.id === it.id); return s + (p ? precoVenda(p) * it.qtd : 0); }, 0);
          const canalIc = (CANAIS.find((c) => c[0] === v.canal) || ["", "🧾"])[1];
          return (
            <div className="row" key={v.id}>
              <div className="thumb" style={{ background: "var(--elev)", width: 34, height: 34, fontSize: 17 }}>{canalIc}</div>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 13 }}>
                  {v.itens.map((it, i) => { const p = db.produtos.find((x) => x.id === it.id); return (i ? ", " : "") + it.qtd + "× " + (p ? p.nome.replace("Pudim ", "") : ""); })}
                </div>
                <div className="mut" style={{ fontSize: 11.5 }}>{v.canal} · {v.criado} · {v.pagamento}</div>
              </div>
              <span className="num" style={{ fontWeight: 700 }}>{brl(t)}</span>
            </div>
          );
        })}
      </Card>
    </>
  );
}
