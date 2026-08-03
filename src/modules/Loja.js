import { useState } from "react";
import { brl } from "../erp/format";

// Vitrine premium (tela principal / pública) — inspiração Apple/Stripe:
// hero cinematográfico, pudim 3D girando, caramelo escorrendo, cards com tilt.
// O acesso ao ERP fica atrás do botão "Área do dono".
export default function Loja({ erp, onAdmin, full }) {
  const { db, precoVenda, criarPedido } = erp;
  const [cart, setCart] = useState([]);
  const add = (p) => setCart((c) => [...c, p]);
  const total = cart.reduce((t, p) => t + precoVenda(p), 0);

  const finalizar = () => {
    if (!cart.length) return;
    const itens = Object.values(cart.reduce((acc, p) => {
      acc[p.id] = acc[p.id] || { id: p.id, qtd: 0 };
      acc[p.id].qtd += 1; return acc;
    }, {}));
    criarPedido(db.clientes.at(-1).id, itens, "Site");
    setCart([]);
    alert("Pedido enviado! Ele já aparece no ERP (Pedidos · canal Site). 🍮");
  };

  const tilt = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  };
  const reset = (e) => { e.currentTarget.style.transform = ""; };

  return (
    <div className={"store" + (full ? " store--full" : "")}>
      <div className="store-nav">
        <div className="store-logo"><span className="logo-dot">🍮</span> Pudim<span style={{ color: "var(--brand)" }}>&amp;Cia</span></div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {cart.length > 0 && (
            <div className="pill">🛒 {cart.length} · {brl(total)}
              <button className="btn mini" style={{ marginLeft: 8 }} onClick={finalizar}>Finalizar</button></div>
          )}
          <button className="btn soft mini" onClick={onAdmin}>🔒 Área do dono</button>
        </div>
      </div>

      <div className="hero">
        <div className="pudim3d"><span className="body">🍮</span><span className="drip" /></div>
        <h2 className="reveal">O pudim perfeito,<br />agora a um clique.</h2>
        <p className="reveal" style={{ animationDelay: ".15s" }}>
          Caramelo que escorre, textura de nuvem. Feito no dia, entregue geladinho na sua porta.
        </p>
        <button className="btn reveal" style={{ animationDelay: ".3s", padding: "12px 26px", fontSize: 15 }}
          onClick={() => document.querySelector(".store-grid")?.scrollIntoView({ behavior: "smooth" })}>
          Ver sabores ↓
        </button>
      </div>

      <div className="marquee">
        <span>🍮 Feito no dia &nbsp;·&nbsp; 🚚 Entrega geladinha &nbsp;·&nbsp; ⭐ 4,9 de 2.400 avaliações &nbsp;·&nbsp; 🎁 Cashback em todo pedido &nbsp;·&nbsp; 💳 PIX &amp; Cartão &nbsp;·&nbsp; 🍮 Feito no dia &nbsp;·&nbsp; 🚚 Entrega geladinha &nbsp;·&nbsp; ⭐ 4,9 de 2.400 avaliações &nbsp;·&nbsp; 🎁 Cashback em todo pedido &nbsp;·&nbsp; 💳 PIX &amp; Cartão &nbsp;·&nbsp;</span>
      </div>

      <div className="store-grid">
        {db.produtos.map((p, i) => (
          <div className="pcard reveal" key={p.id} style={{ animationDelay: i * 0.08 + "s" }} onMouseMove={tilt} onMouseLeave={reset}>
            <div className="img" style={{ background: p.grad }}>{p.emoji}</div>
            <div className="body">
              <h3>{p.nome}</h3>
              <div className="mut" style={{ fontSize: 11.5, marginBottom: 10 }}>{p.rendimento} fatias · geladinho</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="price">{p.promo && <s>{brl(p.preco)}</s>}{brl(precoVenda(p))}</span>
                <button className="btn mini" onClick={() => add(p)}>+ Carrinho</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 26px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {[["🚚", "Entrega refrigerada", "Chega geladinho, do jeito certo"],
          ["🎁", "Programa fidelidade", "3% de cashback em cada compra"],
          ["🔒", "Pagamento seguro", "PIX, cartão e checkout protegido"]].map(([ic, t, d]) => (
          <div className="glass" key={t} style={{ padding: 18 }}>
            <div style={{ fontSize: 26 }}>{ic}</div>
            <div className="name" style={{ marginTop: 8 }}>{t}</div>
            <div className="mut" style={{ fontSize: 12.5 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "18px", borderTop: "1px solid var(--line)", color: "var(--mut)", fontSize: 12.5 }}>
        Pudim&amp;Cia · feito com PudimERP · <button className="btn soft mini" onClick={onAdmin}>Entrar como administrador</button>
      </div>
    </div>
  );
}
