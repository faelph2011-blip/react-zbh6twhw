import { useState, useEffect } from "react";
import { brl, waLink, msgPedido } from "../erp/format";
import { Modal, Btn, Wa } from "../erp/ui";
import { Brand } from "../erp/Emblem";
import { pixCopiaCola, pixQrDataUrl, PIX } from "../erp/pix";
import { hero as heroPhoto, ind, med, gra, fresco, ninho, frutas } from "../erp/assets";

// Apresentação do cardápio agrupada por sabor (3 tipos × tamanhos)
const SABORES = ["Tradicional", "Ninho com Nutella", "Ninho com Frutas Vermelhas"];
const PORTE_ORDER = { Individual: 0, "Médio": 1, Grande: 2 };
const DESC_SABOR = {
  "Tradicional": "O clássico de leite condensado — cremoso e na medida certa.",
  "Ninho com Nutella": "Leite Ninho com Nutella — puro afeto em cada colherada.",
  "Ninho com Frutas Vermelhas": "Leite Ninho com morango e amora — docinho e irresistível.",
};
// Título exibido de cada sabor (o "Tradicional" ganha o complemento do sabor)
const NOME_SABOR = {
  "Tradicional": "Tradicional de Leite Condensado",
};
const FOTO_SABOR = { "Tradicional": med, "Ninho com Nutella": ninho, "Ninho com Frutas Vermelhas": frutas };

// Deduz sabor/porte caso o produto (vindo da nuvem antiga) não tenha as etiquetas
const PORTE_BY_ID = { ind: "Individual", med: "Médio", gra: "Grande" };
const saborDe = (p) => p.sabor || (p.cat === "Tradicional" ? "Tradicional" : p.nome);
const porteDe = (p) => p.porte || PORTE_BY_ID[p.id] || p.tamanho || "";

const WPP = "5534984432000"; // (34) 98443-2000
const INSTA = "https://instagram.com/pudinsdalauren";

// Vitrine premium da Pudins da Lauren — identidade caramelo/creme.
// "Feito com amor em cada detalhe". Acesso ao ERP atrás de "Área do dono".
export default function Loja({ erp, full }) {
  const { db, precoVenda, precoLinha, pedidoSite } = erp;
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const add = (p) => setCart((c) => [...c, p]);
  // total do carrinho já com o combo aplicado (ex.: 2 individuais por R$ 20)
  const total = Object.entries(cart.reduce((a, p) => { a[p.id] = (a[p.id] || 0) + 1; return a; }, {}))
    .reduce((t, [id, qtd]) => t + precoLinha(db.produtos.find((x) => x.id === id), qtd), 0);

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

  // Cliente preenche os dados → cadastra na base e cria o pedido.
  // No PIX o WhatsApp NÃO abre sozinho (senão o app tomaria a tela e esconderia o QR);
  // ele fica como botão na tela de pagamento. No modo "combinar", abre direto.
  const enviarPedido = (nome, tel, forma) => {
    if (!cart.length) return null;
    const itens = Object.values(cart.reduce((acc, p) => {
      acc[p.id] = acc[p.id] || { id: p.id, qtd: 0 };
      acc[p.id].qtd += 1; return acc;
    }, {}));
    const numero = pedidoSite({ nome, tel, itens, forma });
    const pag = forma === "pix"
      ? `💳 Pagamento: PIX — ${brl(total)} (segue o comprovante 👇)`
      : "💳 Pagamento: combinar no WhatsApp";
    const url = waLink(msgPedido({
      produtos: db.produtos, itens, total, canal: "Site", cliente: nome, numero, precoLinha,
      extra: `📞 ${tel}\n${pag}\nEnviado pela loja online 🌐`,
    }));
    if (forma !== "pix") window.open(url, "_blank", "noopener");
    return { url, numero };
  };

  const finalizarCheckout = () => { setCart([]); setCheckout(false); };

  return (
    <div className={"store" + (full ? " store--full" : "")}>
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
          <a className="btn mini" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}><Wa size={15} /> WhatsApp</a>
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
            Pudim artesanal de leite condensado — cremoso, delicioso e inesquecível.
            Feito no dia, entregue geladinho na sua porta.
          </p>
          <div className="hero-cta">
            <button className="btn"
              onClick={() => document.querySelector(".cardapio")?.scrollIntoView({ behavior: "smooth" })}>
              Ver o cardápio ↓
            </button>
            <a className="btn glassbtn" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer">
              <Wa size={18} /> Pedir no WhatsApp
            </a>
          </div>
        </div>
        <div className="hero-fade" />
      </div>

      <div className="marquee">
        <span>🍮 Cremoso &nbsp;·&nbsp; Delicioso &nbsp;·&nbsp; Inesquecível &nbsp;·&nbsp; Feito com amor em cada detalhe &nbsp;·&nbsp; Artesanal &nbsp;·&nbsp; Feito no dia &nbsp;·&nbsp; 🍮 Cremoso &nbsp;·&nbsp; Delicioso &nbsp;·&nbsp; Inesquecível &nbsp;·&nbsp; Feito com amor em cada detalhe &nbsp;·&nbsp; Artesanal &nbsp;·&nbsp; Feito no dia &nbsp;·&nbsp;</span>
      </div>

      {/* Parallax — declaração da marca */}
      <section className="cine-band" style={{ backgroundImage: `url(${heroPhoto})` }}>
        <div className="cine-band-scrim" />
        <div className="cine-band-content sr">
          <div className="script" style={{ fontSize: 42 }}>Cremoso, delicioso, inesquecível</div>
          <p>Pudim de leite condensado, feito no capricho — a sobremesa que vira memória afetiva.</p>
        </div>
      </section>

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
          ["🥇", "Receita artesanal", "Ingredientes selecionados, do jeito tradicional"],
          ["🔒", "Pagamento fácil", "PIX, cartão e dinheiro"]].map(([ic, t, d], i) => (
          <div className="glass sr" key={t} style={{ padding: 18, transitionDelay: i * 0.1 + "s" }}>
            <div style={{ fontSize: 26 }}>{ic}</div>
            <div className="name" style={{ marginTop: 8 }}>{t}</div>
            <div className="mut" style={{ fontSize: 12.5 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Parallax — chamada para o cardápio */}
      <section className="cine-band" style={{ backgroundImage: `url(${gra})` }}>
        <div className="cine-band-scrim" />
        <div className="cine-band-content sr">
          <div className="script" style={{ fontSize: 42 }}>Bateu a vontade?</div>
          <p>Escolha o seu tamanho logo abaixo — é rapidinho e a gente confirma tudo no WhatsApp. 🍮</p>
        </div>
      </section>

      {/* Cardápio — 3 sabores × tamanhos (final do site) */}
      <div className="sr" style={{ textAlign: "center", padding: "44px 20px 10px" }}>
        <div className="script" style={{ fontSize: 36, color: "var(--brown)" }}>Nosso cardápio</div>
        <div className="mut">Três sabores, três tamanhos — escolha o seu momento.</div>
      </div>
      <div className="cardapio">
        {SABORES.map((sabor) => {
          const itens = db.produtos
            .filter((p) => saborDe(p) === sabor)
            .sort((a, b) => (PORTE_ORDER[porteDe(a)] ?? 9) - (PORTE_ORDER[porteDe(b)] ?? 9));
          if (!itens.length) return null;
          const rep = itens[0];
          const foto = FOTO_SABOR[sabor];
          return (
            <div className="flavor sr" key={sabor}>
              <div className="flavor-media" style={{ background: rep.grad }}>
                {foto
                  ? <img src={foto} alt={sabor} />
                  : <span className="flavor-emoji">{rep.emoji}</span>}
              </div>
              <div className="flavor-info">
                <h3>{NOME_SABOR[sabor] || sabor}</h3>
                <p className="mut" style={{ fontSize: 13, marginBottom: 12 }}>{DESC_SABOR[sabor]}</p>
                <div className="flavor-sizes">
                  {itens.map((p) => (
                    <div className="size-opt" key={p.id}>
                      <div className="size-opt-info">
                        <span className="size-opt-porte">{porteDe(p)}{p.combo && <span className="combo-inline">🎉 {p.combo}</span>}</span>
                        <span className="mut" style={{ fontSize: 11.5 }}>{p.tamanho} · {p.rendimento > 1 ? `${p.rendimento} porções` : "individual"}</span>
                      </div>
                      <span className="size-opt-price">{brl(precoVenda(p))}</span>
                      <button className="btn mini" onClick={() => add(p)}>+ Carrinho</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé homogêneo (escuro premium, combina com o hero) */}
      <footer className="store-foot">
        <div className="store-foot-inner">
          <div className="foot-brand">
            <Brand size={66} />
            <div>
              <div className="script" style={{ fontSize: 28 }}>Pudins da Lauren</div>
              <div className="foot-tag">Cremoso · Delicioso · Inesquecível</div>
            </div>
          </div>
          <div className="foot-links">
            <a href={INSTA} target="_blank" rel="noreferrer">📷 @pudinsdalauren</a>
            <a href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer"><Wa size={15} /> (34) 98443-2000</a>
          </div>
        </div>
        <div className="foot-copy">Feito com amor em cada detalhe 💛</div>
      </footer>

      {cart.length > 0 && (
        <button className="cart-float" onClick={() => setCheckout(true)} aria-label="Ver carrinho" title="Ver carrinho">
          🛒<span className="cart-float-badge">{cart.length}</span>
        </button>
      )}
      <a className="wa-float" href={`https://wa.me/${WPP}`} target="_blank" rel="noreferrer" title="Pedir no WhatsApp"><Wa size={30} /></a>

      {checkout && <CheckoutModal total={total} onClose={() => setCheckout(false)} onConfirm={enviarPedido} onFinish={finalizarCheckout} />}
    </div>
  );
}

function CheckoutModal({ total, onClose, onConfirm, onFinish }) {
  const [step, setStep] = useState("form"); // form → pix
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [forma, setForma] = useState("pix");
  const [waUrl, setWaUrl] = useState("");
  const [numero, setNumero] = useState(null);
  const [erro, setErro] = useState("");

  const confirmar = () => {
    if (!nome.trim()) { setErro("Digite seu nome."); return; }
    if (!tel.trim()) { setErro("Digite seu WhatsApp para contato."); return; }
    const res = onConfirm(nome.trim(), tel.trim(), forma) || {};
    if (forma === "pix") { setWaUrl(res.url || ""); setNumero(res.numero || null); setStep("pix"); }
    else onFinish();
  };

  if (step === "pix") {
    return (
      <Modal title="💳 Pague com PIX" onClose={onFinish}>
        <PixPagamento total={total} nome={nome} numero={numero} waUrl={waUrl} onDone={onFinish} />
      </Modal>
    );
  }

  return (
    <Modal title="🍮 Finalizar pedido" onClose={onClose}>
      <p className="mut" style={{ marginBottom: 14, fontSize: 13 }}>
        Preencha seus dados — o pedido também é enviado pelo WhatsApp e a gente confirma tudo com você. 💬
      </p>
      <div className="field"><label>Seu nome *</label>
        <input autoFocus value={nome} placeholder="Ex: Maria Silva"
          onChange={(e) => { setNome(e.target.value); setErro(""); }} /></div>
      <div className="field"><label>Seu WhatsApp *</label>
        <input value={tel} placeholder="(34) 9 9999-9999"
          onChange={(e) => { setTel(e.target.value); setErro(""); }} /></div>

      <div className="field"><label>Forma de pagamento</label>
        <div className="pay-opts">
          <button type="button" className={"pay-opt" + (forma === "pix" ? " on" : "")}
            onClick={() => setForma("pix")}>⚡ PIX <small>na hora</small></button>
          <button type="button" className={"pay-opt" + (forma === "whats" ? " on" : "")}
            onClick={() => setForma("whats")}>💬 Combinar <small>no WhatsApp</small></button>
        </div>
      </div>

      <div className="pill" style={{ marginBottom: 14 }}>Total do pedido: <b>{brl(total)}</b></div>
      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">{erro}</span></div>}
      <Btn onClick={confirmar}>
        {forma === "pix" ? <>Pagar com PIX ⚡</> : <>Enviar pedido pelo WhatsApp <Wa size={16} /></>}
      </Btn>
    </Modal>
  );
}

// Tela de pagamento PIX: QR Code + Copia e Cola já com o valor do pedido.
function PixPagamento({ total, nome, numero, waUrl, onDone }) {
  const txid = "PDL" + Date.now().toString().slice(-8);
  const payload = pixCopiaCola({ valor: total, txid });
  const qr = pixQrDataUrl(payload, 5);
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try { await navigator.clipboard.writeText(payload); }
    catch { const t = document.createElement("textarea"); t.value = payload; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="pix-pay">
      {numero && <div className="pix-num">🧾 Pedido <b>#{numero}</b></div>}
      <p className="mut" style={{ fontSize: 13, marginBottom: 12 }}>
        {nome ? `${nome}, ` : ""}escaneie o QR Code no app do seu banco ou use o <b>PIX Copia e Cola</b>. 🍮
      </p>
      <div className="pix-total">Valor a pagar <b>{brl(total)}</b></div>
      <div className="pix-qr"><img src={qr} alt="QR Code PIX" /></div>
      <button type="button" className={"btn pix-copy" + (copiado ? " ok" : "")} onClick={copiar}>
        {copiado ? "✅ Código copiado!" : "📋 Copiar PIX Copia e Cola"}
      </button>
      <div className="pix-info">
        <div><span>Recebedor</span><b>{PIX.titular}</b></div>
        <div><span>Cidade</span><b>{PIX.cidade}</b></div>
        <div><span>Instituição</span><b>{PIX.banco}</b></div>
      </div>
      <p className="mut" style={{ fontSize: 12, margin: "12px 0 8px" }}>
        Depois de pagar, envie o comprovante no nosso WhatsApp para confirmar o pedido. 💬
      </p>
      {waUrl && (
        <a className="btn glassbtn pix-wa" href={waUrl} target="_blank" rel="noreferrer">
          <Wa size={16} /> Enviar comprovante no WhatsApp
        </a>
      )}
      <Btn onClick={onDone}>Concluir ✅</Btn>
    </div>
  );
}
