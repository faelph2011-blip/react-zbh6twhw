import { useState, useEffect } from "react";
import { brl, waLink, msgPedido } from "../erp/format";
import { Modal, Btn } from "../erp/ui";
import { Brand } from "../erp/Emblem";
import { ind, med, gra, fresco } from "../erp/assets";

const FOTOS = { ind, med, gra };

const WPP = "5534984432000"; // (34) 98443-2000
const INSTA = "https://instagram.com/pudinsdalauren";

// Vitrine premium da Pudins da Lauren — identidade caramelo/creme.
// "Feito com amor em cada detalhe". Acesso ao ERP atrás de "Área do dono".
export default function Loja({ erp, onAdmin, full }) {
  const { db, precoVenda, pedidoSite } = erp;
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const add = (p) => setCart((c) => [...c, p]);
  const total = cart.reduce((t, p) => t + precoVenda(p), 0);

  // Efeitos de rolagem: elementos ".sr" surgem ao entrar na tela; vídeos de
  // fundo tocam quando visíveis e pausam quando saem (economia). Só visual.
  useEffect(() => {
    const srs = Array.from(document.querySelectorAll(".sr"));
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz || !("IntersectionObserver" in window)) {
      srs.forEach((el) => el.classList.add("sr-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("sr-in"); io.unobserve(en.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    srs.forEach((el) => io.observe(el));

    const vids = Array.from(document.querySelectorAll("video[data-autoplay]"));
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) { const pr = v.play && v.play(); if (pr && pr.catch) pr.catch(() => {}); }
        else if (v.pause) v.pause();
      });
    }, { threshold: 0.2 });
    vids.forEach((v) => vio.observe(v));

    return () => { io.disconnect(); vio.disconnect(); };
  }, []);

  // Cliente preenche os dados → cadastra na base, cria o pedido e envia pro WhatsApp.
  const enviarPedido = (nome, tel) => {
    if (!cart.length) return;
    const itens = Object.values(cart.reduce((acc, p) => {
      acc[p.id] = acc[p.id] || { id: p.id, qtd: 0 };
      acc[p.id].qtd += 1; return acc;
    }, {}));
    pedidoSite({ nome, tel, itens });
    const url = waLink(msgPedido({
      produtos: db.produtos, itens, total, canal: "Site", cliente: nome,
      extra: `📞 ${tel}\nEnviado pela loja online 🌐`,
    }));
    setCart([]);
    setCheckout(false);
    window.open(url, "_blank", "noopener");
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
              <button className="btn mini" style={{ marginLeft: 8 }} onClick={() => setCheckout(true)}>Finalizar</button></div>
          )}
          <button className="btn soft mini" onClick={onAdmin}>🔒 Área do dono</button>
        </div>
      </div>

      <div className="hero hero--cine">
        <video className="hero-bg" data-autoplay
          src={`${process.env.PUBLIC_URL}/hero.mp4`}
          poster={`${process.env.PUBLIC_URL}/hero-poster.jpg`}
          autoPlay muted loop playsInline preload="metadata"
          aria-label="Pudins da Lauren — vídeo do pudim artesanal" />
        <div className="hero-scrim" />
        <div className="hero-inner">
          <div className="hero-logo"><Brand size={132} /></div>
          <div className="script hero-script">Feito com amor</div>
          <h2 className="hero-title">em cada detalhe.</h2>
          <p className="hero-sub">
            Pudim artesanal de leite condensado <b>Leite Moça</b> — cremoso, delicioso e inesquecível.
            Feito no dia, entregue geladinho na sua porta.
          </p>
          <div className="hero-cta">
            <button className="btn"
              onClick={() => document.querySelector(".store-grid")?.scrollIntoView({ behavior: "smooth" })}>
              Escolher tamanho ↓
            </button>
            <a className="btn glassbtn" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer">
              💬 Pedir no WhatsApp
            </a>
          </div>
        </div>
        <div className="hero-fade" />
      </div>

      <div className="marquee">
        <span>🍮 Cremoso &nbsp;·&nbsp; Delicioso &nbsp;·&nbsp; Inesquecível &nbsp;·&nbsp; Feito com amor em cada detalhe &nbsp;·&nbsp; Leite Moça &nbsp;·&nbsp; Feito no dia &nbsp;·&nbsp; 🍮 Cremoso &nbsp;·&nbsp; Delicioso &nbsp;·&nbsp; Inesquecível &nbsp;·&nbsp; Feito com amor em cada detalhe &nbsp;·&nbsp; Leite Moça &nbsp;·&nbsp; Feito no dia &nbsp;·&nbsp;</span>
      </div>

      <div className="sr" style={{ textAlign: "center", padding: "40px 20px 6px" }}>
        <div className="script" style={{ fontSize: 34, color: "var(--brown)" }}>Escolha o seu tamanho</div>
        <div className="mut">Um só sabor, do jeito tradicional. Três tamanhos pra cada momento.</div>
      </div>

      <div className="store-grid">
        {db.produtos.map((p, i) => (
          <div className="pcard sr" key={p.id} style={{ transitionDelay: i * 0.08 + "s" }} onMouseMove={tilt} onMouseLeave={reset}>
            <div className="img" style={{ background: p.grad, padding: 0 }}>
              {FOTOS[p.id]
                ? <img src={FOTOS[p.id]} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : p.emoji}
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

      {/* Faixa cinematográfica com imagem de fundo (parallax) */}
      <section className="cine-band" style={{ backgroundImage: `url(${fresco})` }}>
        <div className="cine-band-scrim" />
        <div className="cine-band-content sr">
          <div className="script" style={{ fontSize: 36 }}>Feito no dia, com carinho</div>
          <p>Produção artesanal, fresquinho e geladinho — do jeito que você merece.</p>
        </div>
      </section>
      <div className="bastidores">
        {[[med, "No capricho"], [ind, "Feito no dia"], [fresco, "Geladinho"]].map(([src, cap], i) => (
          <div key={i} className="bast-card sr" style={{ transitionDelay: i * 0.1 + "s" }}>
            <img src={src} alt={cap} />
            <span className="bast-cap">{cap}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 26px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {[["🚚", "Entrega geladinha", "Chega refrigerado, do jeito certo"],
          ["🥇", "Leite Moça", "Receita tradicional, ingredientes selecionados"],
          ["🔒", "Pagamento fácil", "PIX, cartão e dinheiro"]].map(([ic, t, d], i) => (
          <div className="glass sr" key={t} style={{ padding: 18, transitionDelay: i * 0.1 + "s" }}>
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

      {checkout && <CheckoutModal total={total} onClose={() => setCheckout(false)} onConfirm={enviarPedido} />}
    </div>
  );
}

function CheckoutModal({ total, onClose, onConfirm }) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [erro, setErro] = useState("");

  const confirmar = () => {
    if (!nome.trim()) { setErro("Digite seu nome."); return; }
    if (!tel.trim()) { setErro("Digite seu WhatsApp para contato."); return; }
    onConfirm(nome.trim(), tel.trim());
  };

  return (
    <Modal title="🍮 Finalizar pedido" onClose={onClose}>
      <p className="mut" style={{ marginBottom: 14, fontSize: 13 }}>
        Preencha seus dados — enviamos seu pedido pelo WhatsApp e confirmamos tudo com você. 💬
      </p>
      <div className="field"><label>Seu nome *</label>
        <input autoFocus value={nome} placeholder="Ex: Maria Silva"
          onChange={(e) => { setNome(e.target.value); setErro(""); }} /></div>
      <div className="field"><label>Seu WhatsApp *</label>
        <input value={tel} placeholder="(34) 9 9999-9999"
          onChange={(e) => { setTel(e.target.value); setErro(""); }} /></div>
      <div className="pill" style={{ marginBottom: 14 }}>Total do pedido: <b>{brl(total)}</b></div>
      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">{erro}</span></div>}
      <Btn onClick={confirmar}>Enviar pedido pelo WhatsApp 💬</Btn>
    </Modal>
  );
}
