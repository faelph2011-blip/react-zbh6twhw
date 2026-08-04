import { useState } from "react";
import { brl } from "../erp/format";
import { Brand } from "../erp/Emblem";

const WPP = "5534984432000"; // (34) 98443-2000
const INSTA = "https://instagram.com/pudinsdalauren";

// Vitrine premium da Pudins da Lauren — identidade caramelo/creme.
// "Feito com amor em cada detalhe". Acesso ao ERP atrás de "Área do dono".
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
    alert("Pedido enviado! 🍮 Ele já aparece no ERP (Pedidos · canal Site).");
  };

  const tilt = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  };
  const reset = (e) => { e.currentTarget.style.transform = ""; };

  return (
    <div className={"store" + (full ? " store--full" : "")}>
      {/* Faixa de inauguração */}
      <div className="promo-banner">
        🎉 Promoção de Inauguração — <b>1 Pudim por R$ 12</b> ou <b>2 Pudins por R$ 20</b>
      </div>

      <div className="store-nav">
        <div className="store-logo" style={{ gap: 10 }}>
          <Brand size={46} />
          <span className="script" style={{ fontSize: 26, color: "var(--brown)" }}>Pudins da Lauren</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {cart.length > 0 && (
            <div className="pill">🛒 {cart.length} · {brl(total)}
              <button className="btn mini" style={{ marginLeft: 8 }} onClick={finalizar}>Finalizar</button></div>
          )}
          <button className="btn soft mini" onClick={onAdmin}>🔒 Área do dono</button>
        </div>
      </div>

      <div className="hero">
        <div style={{ width: 210, margin: "6px auto 26px", animation: "float 4s ease-in-out infinite", filter: "drop-shadow(0 18px 30px rgba(120,80,30,.28))" }}>
          <Brand size={210} />
        </div>
        <div className="script" style={{ fontSize: "clamp(38px,8vw,72px)", color: "var(--caramel)", marginBottom: 6 }}>
          Feito com amor
        </div>
        <h2 className="reveal" style={{ marginTop: 0 }}>em cada detalhe.</h2>
        <p className="reveal" style={{ animationDelay: ".15s" }}>
          Pudim artesanal de leite condensado <b>Leite Moça</b> — cremoso, delicioso e inesquecível.
          Feito no dia, entregue geladinho na sua porta.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn reveal" style={{ animationDelay: ".3s", padding: "12px 26px", fontSize: 15 }}
            onClick={() => document.querySelector(".store-grid")?.scrollIntoView({ behavior: "smooth" })}>
            Escolher tamanho ↓
          </button>
          <a className="btn soft reveal" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer"
            style={{ animationDelay: ".35s", padding: "12px 22px", fontSize: 15, textDecoration: "none" }}>
            💬 Pedir no WhatsApp
          </a>
        </div>
      </div>

      <div className="marquee">
        <span>🍮 Cremoso &nbsp;·&nbsp; Delicioso &nbsp;·&nbsp; Inesquecível &nbsp;·&nbsp; Feito com amor em cada detalhe &nbsp;·&nbsp; Leite Moça &nbsp;·&nbsp; Feito no dia &nbsp;·&nbsp; 🍮 Cremoso &nbsp;·&nbsp; Delicioso &nbsp;·&nbsp; Inesquecível &nbsp;·&nbsp; Feito com amor em cada detalhe &nbsp;·&nbsp; Leite Moça &nbsp;·&nbsp; Feito no dia &nbsp;·&nbsp;</span>
      </div>

      <div style={{ textAlign: "center", padding: "26px 20px 6px" }}>
        <div className="script" style={{ fontSize: 30, color: "var(--brown)" }}>Escolha o seu tamanho</div>
        <div className="mut">Um só sabor, do jeito tradicional. Três tamanhos pra cada momento.</div>
      </div>

      <div className="store-grid">
        {db.produtos.map((p, i) => (
          <div className="pcard reveal" key={p.id} style={{ animationDelay: i * 0.08 + "s" }} onMouseMove={tilt} onMouseLeave={reset}>
            <div className="img" style={{ background: p.grad }}>
              {p.emoji}
              <span className="size-badge" style={{ position: "absolute", top: 10, right: 10 }}>{p.tamanho}</span>
            </div>
            <div className="body">
              <h3>{p.nome}</h3>
              <div className="mut" style={{ fontSize: 11.5, marginBottom: 10 }}>
                {p.tamanho} · {p.rendimento > 1 ? `${p.rendimento} porções` : "porção individual"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="price">{brl(precoVenda(p))}</span>
                <button className="btn mini" onClick={() => add(p)}>+ Carrinho</button>
              </div>
              {p.combo && <div className="tag t-org" style={{ marginTop: 10 }}>🎉 {p.combo}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 26px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {[["🚚", "Entrega geladinha", "Chega refrigerado, do jeito certo"],
          ["🥇", "Leite Moça", "Receita tradicional, ingredientes selecionados"],
          ["🔒", "Pagamento fácil", "PIX, cartão e dinheiro"]].map(([ic, t, d]) => (
          <div className="glass" key={t} style={{ padding: 18 }}>
            <div style={{ fontSize: 26 }}>{ic}</div>
            <div className="name" style={{ marginTop: 8 }}>{t}</div>
            <div className="mut" style={{ fontSize: 12.5 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Rodapé com contatos reais */}
      <div style={{ borderTop: "1px solid var(--line)", padding: "24px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Brand size={54} />
          <div>
            <div className="script" style={{ fontSize: 22, color: "var(--brown)" }}>Pudins da Lauren</div>
            <div className="mut" style={{ fontSize: 12 }}>Cremoso · Delicioso · Inesquecível</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn soft mini" href={INSTA} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>📷 @pudinsdalauren</a>
          <a className="btn mini" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>💬 (34) 98443-2000</a>
          <button className="btn soft mini" onClick={onAdmin}>🔒 Área do dono</button>
        </div>
      </div>

      <a className="wa-float" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer" title="Pedir no WhatsApp">💬</a>
    </div>
  );
}
