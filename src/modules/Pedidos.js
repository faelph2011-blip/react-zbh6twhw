import { useState } from "react";
import { Card, Tag, Btn, Modal, Empty } from "../erp/ui";
import { brl } from "../erp/format";

const STATUS_CLS = { Novo: "t-blu", Produção: "t-org", Pronto: "t-pur", Entregue: "t-grn", Cancelado: "t-red" };
const CANAL_IC = { Balcão: "🏪", WhatsApp: "💬", Site: "🌐", Delivery: "🛵" };

export default function Pedidos({ erp }) {
  const { db, totalPedido, enviarProducao, entregarPedido, cancelarPedido } = erp;
  const [novo, setNovo] = useState(false);
  const [filtro, setFiltro] = useState("Todos");

  const list = db.pedidos.filter((p) => filtro === "Todos" || p.status === filtro);

  return (
    <>
      <div className="topbar">
        <div><h1>Pedidos</h1>
          <div className="sub">Balcão, WhatsApp, Site e Delivery — cada avanço movimenta produção, estoque e caixa</div></div>
        <Btn onClick={() => setNovo(true)}>+ Novo pedido</Btn>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {["Todos", "Novo", "Produção", "Pronto", "Entregue", "Cancelado"].map((s) => (
          <button key={s} className={"nav " + (filtro === s ? "on" : "")} style={{ width: "auto", padding: "6px 14px", borderRadius: 99 }}
            onClick={() => setFiltro(s)}>{s}</button>
        ))}
      </div>

      <div className="grid g3">
        {list.length === 0 && <Empty>Nenhum pedido neste filtro.</Empty>}
        {list.map((p) => {
          const cli = db.clientes.find((c) => c.id === p.clienteId);
          return (
            <Card key={p.id}>
              <div className="hdr" style={{ marginBottom: 8 }}>
                <div><div className="name">#{p.id} · {CANAL_IC[p.canal]} {p.canal}</div>
                  <div className="mut" style={{ fontSize: 12 }}>{cli?.nome} · {p.criado}</div></div>
                <Tag cls={STATUS_CLS[p.status]}>{p.status}</Tag>
              </div>
              {p.itens.map((it, i) => {
                const prod = db.produtos.find((x) => x.id === it.id);
                return <div key={i} className="mut" style={{ fontSize: 12.5, padding: "2px 0" }}>{it.qtd}× {prod?.nome}</div>;
              })}
              {p.obs && <div className="mut" style={{ fontSize: 11.5, fontStyle: "italic", marginTop: 6 }}>“{p.obs}”</div>}
              <div className="divider" style={{ margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="num" style={{ fontWeight: 700, fontSize: 16 }}>{brl(totalPedido(p))}</span>
                <Tag cls={p.pagamento === "Pendente" ? "t-red" : "t-grn"}>{p.pagamento}</Tag>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {p.status === "Novo" && <Btn variant="mini" onClick={() => enviarProducao(p.id)}>→ Produção</Btn>}
                {(p.status === "Pronto" || p.status === "Produção") && <Btn variant="mini" onClick={() => entregarPedido(p.id)}>Entregar</Btn>}
                {p.status !== "Entregue" && p.status !== "Cancelado" &&
                  <Btn variant="mini soft" onClick={() => cancelarPedido(p.id)}>Cancelar</Btn>}
              </div>
            </Card>
          );
        })}
      </div>

      {novo && <NovoPedido erp={erp} onClose={() => setNovo(false)} />}
    </>
  );
}

function NovoPedido({ erp, onClose }) {
  const { db, criarPedido, precoVenda } = erp;
  const [cliente, setCliente] = useState(db.clientes[0].id);
  const [canal, setCanal] = useState("Balcão");
  const [cart, setCart] = useState({});

  const add = (id, d) => setCart((c) => { const q = (c[id] || 0) + d; const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; });
  const total = Object.entries(cart).reduce((t, [id, q]) => { const p = db.produtos.find((x) => x.id === id); return t + (p ? precoVenda(p) * q : 0); }, 0);
  const itens = Object.entries(cart).map(([id, qtd]) => ({ id, qtd }));

  return (
    <Modal title="Novo pedido" onClose={onClose}>
      <div className="field"><label>Cliente</label>
        <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
          {db.clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select></div>
      <div className="field"><label>Canal</label>
        <select value={canal} onChange={(e) => setCanal(e.target.value)}>
          {["Balcão", "WhatsApp", "Site", "Delivery"].map((c) => <option key={c}>{c}</option>)}
        </select></div>
      <label>Itens</label>
      {db.produtos.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)" }}>
          <span className="thumb" style={{ background: p.grad, width: 28, height: 28, fontSize: 15 }}>{p.emoji}</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{p.nome}</div><div className="mut" style={{ fontSize: 11 }}>{brl(precoVenda(p))}</div></div>
          <button className="iconbtn" style={{ width: 26, height: 26 }} onClick={() => add(p.id, -1)}>–</button>
          <span className="num" style={{ width: 18, textAlign: "center" }}>{cart[p.id] || 0}</span>
          <button className="iconbtn" style={{ width: 26, height: 26 }} onClick={() => add(p.id, 1)}>+</button>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0" }}>
        <span className="mut">Total</span><span className="num" style={{ fontSize: 20, fontWeight: 700 }}>{brl(total)}</span>
      </div>
      <Btn disabled={itens.length === 0} onClick={() => { criarPedido(cliente, itens, canal); onClose(); }}>Criar pedido</Btn>
    </Modal>
  );
}
