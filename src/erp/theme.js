// ============================================================
// DESIGN SYSTEM — Pudins da Lauren (light · modern · fluid)
// Base clara e quente, detalhes escuros, aurora animada,
// glassmorphism, cantos generosos e microinterações fluidas.
// APENAS apresentação — nenhuma classe renomeada/removida.
// ============================================================

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@600;700&display=swap');

/* ---- Base clara moderna (padrão) ---- */
:root, [data-theme="light"]{
  --bg:#FAF5EC; --bg-2:#F2E7D6; --surface:#FFFFFF; --surface-2:#FCF8F1;
  --glass:rgba(255,255,255,.62); --glass-2:rgba(255,255,255,.78);
  --elev:#F5EEE1; --line:rgba(45,31,22,.09); --line-2:rgba(45,31,22,.16);
  --ink:#20160F; --ink-2:#3A2A1C;
  --brand:#C06A17; --brand-soft:#E88A25; --caramel:#B95D16; --gold:#D8A64A;
  --brown:#3C2A1A; --txt:#241A12; --cream:#FFF7EA; --mut:#8B7A66;
  --green:#1F9D57; --red:#DA4B33; --blue:#2F6FE0; --purple:#7A4FE0;
  --soft:0 1px 2px rgba(60,40,20,.05), 0 10px 30px -14px rgba(90,55,20,.22);
  --shadow:0 30px 60px -18px rgba(120,70,20,.30);
  --glow:0 0 30px rgba(216,166,74,.35);
  --grad:linear-gradient(135deg,var(--brand-soft),var(--caramel));
  --ink-grad:linear-gradient(140deg,#2E2016,#150E08);
  --btn-ink:#FDEFDA;
}
/* ---- Variante escura (opcional pelo toggle) ---- */
[data-theme="dark"]{
  --bg:#0C0906; --bg-2:#120C07; --surface:#181009; --surface-2:#1E140B;
  --glass:rgba(30,20,11,.55); --glass-2:rgba(30,20,11,.72);
  --elev:#241609; --line:rgba(216,166,74,.14); --line-2:rgba(216,166,74,.30);
  --ink:#F5EFE4; --ink-2:#E8D8C0;
  --brand:#E9A94A; --brand-soft:#F3C583; --caramel:#D77E28; --gold:#E9C877;
  --brown:#F2CB73; --txt:#F5EFE4; --cream:#FFF7EA; --mut:#B7A588;
  --green:#5FD08A; --red:#F0705A; --blue:#6FA8FF; --purple:#B98BFF;
  --soft:0 2px 12px rgba(0,0,0,.35); --shadow:0 30px 60px -18px rgba(0,0,0,.7);
  --glow:0 0 26px rgba(233,169,74,.32);
  --grad:linear-gradient(135deg,var(--brand-soft),var(--caramel));
  --ink-grad:linear-gradient(140deg,#E9A94A,#C87A22);
  --btn-ink:#1A1206;
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;background:var(--bg)}
body{position:relative;z-index:0;color:var(--txt);-webkit-font-smoothing:antialiased;background:transparent}

/* aurora fluida ao fundo */
body::before{content:"";position:fixed;inset:-10%;z-index:-1;pointer-events:none;
  background:
    radial-gradient(38% 38% at 14% 18%, rgba(232,138,37,.20), transparent 62%),
    radial-gradient(42% 42% at 86% 12%, rgba(216,166,74,.22), transparent 62%),
    radial-gradient(40% 40% at 78% 88%, rgba(201,112,28,.16), transparent 62%),
    radial-gradient(34% 34% at 20% 92%, rgba(245,190,120,.16), transparent 62%);
  filter:blur(20px);
  animation:aurora 26s ease-in-out infinite alternate;
}
@keyframes aurora{
  0%{transform:translate3d(0,0,0) scale(1)}
  50%{transform:translate3d(1.5%,-1.5%,0) scale(1.06)}
  100%{transform:translate3d(-1.5%,1.5%,0) scale(1.03)}
}
::selection{background:rgba(201,112,28,.22);color:var(--txt)}
::placeholder{color:var(--mut);opacity:.75}

/* scrollbar */
*::-webkit-scrollbar{width:10px;height:10px}
*::-webkit-scrollbar-thumb{background:rgba(120,80,30,.22);border-radius:99px;border:2px solid transparent;background-clip:content-box}
*::-webkit-scrollbar-thumb:hover{background:rgba(120,80,30,.4);background-clip:content-box}
*::-webkit-scrollbar-track{background:transparent}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px;border-radius:8px}

.app{display:flex;min-height:100vh;background:transparent;color:var(--txt);font-family:Inter,system-ui,sans-serif;font-size:14px}
h1,h2,h3{font-family:'Space Grotesk',system-ui,sans-serif;letter-spacing:-.4px}

/* ---- Sidebar (vidro claro, detalhe escuro no ativo) ---- */
.side{width:240px;background:var(--glass-2);backdrop-filter:blur(18px) saturate(1.2);border-right:1px solid var(--line);padding:18px 12px;display:flex;flex-direction:column;gap:3px;flex-shrink:0;position:sticky;top:0;height:100vh;overflow:auto}
.brand{font-weight:700;font-size:18px;letter-spacing:.2px;padding:8px 10px 8px;display:flex;align-items:center;gap:10px}
.logo-dot{width:30px;height:30px;border-radius:10px;background:var(--grad);display:inline-flex;align-items:center;justify-content:center;font-size:17px;box-shadow:var(--glow)}
.brand small{display:block;font-family:Inter;font-weight:400;font-size:10.5px;color:var(--mut);letter-spacing:.5px}
.navgroup{font-size:10px;text-transform:uppercase;letter-spacing:1.4px;color:var(--mut);padding:16px 12px 6px;opacity:.75}
.nav{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:12px;color:var(--ink-2);cursor:pointer;font-weight:500;border:none;background:none;font-size:13.5px;text-align:left;width:100%;transition:transform .16s cubic-bezier(.34,1.56,.64,1),background .18s,color .18s;position:relative}
.nav:hover{background:rgba(120,80,30,.07);transform:translateX(2px)}
.nav.on{background:var(--ink-grad);color:var(--btn-ink);box-shadow:0 10px 22px -10px rgba(30,20,12,.5)}
.nav.on .ic{filter:saturate(1.2)}
.nav .ic{font-size:15px;width:18px;text-align:center}
.nav .badge{margin-left:auto;background:var(--grad);color:#1a1206;font-size:10.5px;font-weight:700;border-radius:99px;padding:1px 7px}

/* ---- Main ---- */
.main{flex:1;padding:30px 36px;overflow:auto;max-width:100%}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;gap:14px;flex-wrap:wrap}
h1{font-size:27px;font-weight:600;margin-bottom:3px}
.sub{color:var(--mut);font-size:13.5px}
h2{font-size:17px;font-weight:600;margin-bottom:13px}

/* ---- Grid ---- */
.grid{display:grid;gap:16px}
.g2{grid-template-columns:repeat(2,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g4{grid-template-columns:repeat(4,1fr)}
.g5{grid-template-columns:repeat(5,1fr)}

/* ---- Cards (superfície clara + sombra suave, hover fluido) ---- */
.card{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:18px 20px;box-shadow:var(--soft);position:relative;animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s}
.card.pad{padding:20px 22px}
.k{color:var(--mut);font-size:11px;text-transform:uppercase;letter-spacing:.9px;font-weight:600}
.v{font-family:'Space Grotesk';font-size:27px;font-weight:600;margin-top:8px;letter-spacing:-.6px;color:var(--txt)}
.v small{font-size:12px;color:var(--mut);font-weight:400;font-family:Inter}
.kpi-ic{width:40px;height:40px;border-radius:13px;background:var(--ink-grad);color:var(--btn-ink);display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;box-shadow:0 8px 18px -8px rgba(30,20,12,.5)}

/* ---- Tags ---- */
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;border:1px solid transparent}
.t-org{background:rgba(201,112,28,.12);color:var(--caramel);border-color:rgba(201,112,28,.2)}
.t-grn{background:rgba(31,157,87,.12);color:var(--green);border-color:rgba(31,157,87,.2)}
.t-red{background:rgba(218,75,51,.12);color:var(--red);border-color:rgba(218,75,51,.2)}
.t-blu{background:rgba(47,111,224,.12);color:var(--blue);border-color:rgba(47,111,224,.2)}
.t-pur{background:rgba(122,79,224,.12);color:var(--purple);border-color:rgba(122,79,224,.2)}
.t-mut{background:rgba(139,122,102,.12);color:var(--mut);border-color:rgba(139,122,102,.2)}

/* ---- Buttons (primário escuro, detalhe premium) ---- */
.btn{background:var(--ink-grad);color:var(--btn-ink);border:none;border-radius:12px;padding:10px 17px;font-weight:600;cursor:pointer;font-size:13px;font-family:Inter;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,filter .2s;box-shadow:0 10px 22px -10px rgba(30,20,12,.55)}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 30px -10px rgba(30,20,12,.6),0 0 0 1px rgba(216,166,74,.4);filter:brightness(1.08)}
.btn:active{transform:translateY(0)}
.btn.ghost{background:var(--glass);backdrop-filter:blur(8px);color:var(--ink);border:1px solid var(--line-2);box-shadow:none}
.btn.ghost:hover{border-color:var(--brand);color:var(--caramel);background:rgba(201,112,28,.06)}
.btn.soft{background:var(--elev);color:var(--ink-2);border:1px solid var(--line);box-shadow:none}
.btn.soft:hover{border-color:var(--line-2);color:var(--caramel)}
.btn.mini{padding:7px 13px;font-size:12px;border-radius:10px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;filter:none}
.linklike{background:none;border:none;color:var(--brand);font-weight:600;cursor:pointer;font-size:inherit;font-family:inherit;padding:0;text-decoration:underline;text-underline-offset:2px}

/* ---- Rows / tables ---- */
.row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:none}
.name{font-weight:600}
.mut{color:var(--mut);font-size:12.5px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;color:var(--mut);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.7px;padding:10px 10px;border-bottom:1px solid var(--line-2)}
td{padding:12px 10px;border-bottom:1px solid var(--line)}
tr:last-child td{border-bottom:none}
tbody tr{transition:background .15s}
tbody tr:hover{background:rgba(201,112,28,.05)}
.num{font-family:'Space Grotesk';font-variant-numeric:tabular-nums}

/* ---- Bars ---- */
.bar{height:8px;background:var(--elev);border-radius:99px;overflow:hidden;margin-top:8px;border:1px solid var(--line)}
.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--caramel),var(--gold));border-radius:99px;transition:width .6s cubic-bezier(.22,1,.36,1)}

/* ---- Kanban ---- */
.kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
.kanban.k4{grid-template-columns:repeat(4,1fr)}
.col h4{font-size:11.5px;color:var(--mut);text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.chip{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:13px;margin-bottom:10px;box-shadow:var(--soft);transition:transform .22s,box-shadow .22s}
.chip:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
.chip .lote{font-family:'Space Grotesk';font-weight:600;letter-spacing:.5px;font-size:13px}

/* ---- Misc ---- */
.pill{display:inline-flex;gap:6px;align-items:center;background:var(--glass);backdrop-filter:blur(8px);border:1px solid var(--line);border-radius:99px;padding:7px 14px;font-size:12.5px;box-shadow:var(--soft)}
.divider{height:1px;background:var(--line);margin:16px 0}
.empty{color:var(--mut);text-align:center;padding:30px;font-size:13px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:700;color:#1a1206;flex-shrink:0;box-shadow:var(--glow)}
.thumb{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:1px solid var(--line);background:var(--surface-2)}
.iconbtn{background:var(--elev);border:1px solid var(--line);color:var(--ink-2);width:36px;height:36px;border-radius:11px;cursor:pointer;font-size:15px;display:inline-flex;align-items:center;justify-content:center;transition:.16s}
.iconbtn:hover{color:var(--caramel);border-color:var(--line-2);transform:translateY(-1px)}
.scroll-x{overflow-x:auto}
select,input,textarea{background:var(--surface);border:1px solid var(--line-2);color:var(--txt);border-radius:12px;padding:11px 13px;font-size:13px;font-family:Inter;width:100%;transition:border-color .16s,box-shadow .16s}
select:focus,input:focus,textarea:focus{outline:none;border-color:var(--ink);box-shadow:0 0 0 3px rgba(45,31,22,.10)}
label{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:6px;font-weight:600}
.field{margin-bottom:14px}
.feed-item{font-size:12.5px;padding:9px 0;border-bottom:1px solid var(--line);color:var(--txt);display:flex;gap:8px}
.feed-item:before{content:"◆";color:var(--brand);font-size:9px;margin-top:3px}
.feed-item:last-child{border-bottom:none}

/* ---- Modal ---- */
.overlay{position:fixed;inset:0;background:rgba(40,26,16,.34);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;animation:fadeIn .22s ease}
.modal{background:var(--glass-2);backdrop-filter:blur(24px) saturate(1.3);border:1px solid var(--line-2);border-radius:24px;padding:26px;width:100%;max-width:460px;box-shadow:var(--shadow);max-height:90vh;overflow:auto;animation:pop .32s cubic-bezier(.34,1.56,.64,1) both}

/* ============ VENDA RÁPIDA ============ */
.qs-chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin:6px 0 16px;-webkit-overflow-scrolling:touch}
.qs-chip{flex-shrink:0;padding:10px 16px;border-radius:99px;border:1px solid var(--line-2);background:var(--surface);color:var(--ink-2);cursor:pointer;font-weight:600;font-size:13.5px;display:inline-flex;gap:7px;align-items:center;white-space:nowrap;transition:.16s;box-shadow:var(--soft)}
.qs-chip:hover{border-color:var(--brand);color:var(--caramel);transform:translateY(-1px)}
.qs-chip.on{background:var(--ink-grad);color:var(--btn-ink);border-color:transparent;box-shadow:0 8px 18px -8px rgba(30,20,12,.5)}
.qs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:13px}
.qs-tile{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:17px 12px;cursor:pointer;user-select:none;position:relative;transition:transform .18s cubic-bezier(.34,1.56,.64,1),border-color .16s,box-shadow .18s;text-align:center;box-shadow:var(--soft)}
.qs-tile:hover{border-color:var(--brand);transform:translateY(-3px);box-shadow:var(--shadow)}
.qs-tile:active{transform:scale(.96)}
.qs-tile.sel{border-color:var(--brand);box-shadow:0 0 0 2px rgba(201,112,28,.35),var(--soft)}
.qs-tile .em{font-size:42px;line-height:1}
.qs-qty{position:absolute;top:8px;right:8px;background:var(--ink-grad);color:var(--btn-ink);font-weight:700;border-radius:99px;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13.5px;padding:0 7px;font-family:'Space Grotesk'}
.qs-minus{position:absolute;bottom:10px;left:10px;width:30px;height:30px;border-radius:10px;border:1px solid var(--line-2);background:var(--surface);color:var(--ink-2);font-size:18px;cursor:pointer;line-height:1}
.qs-minus:hover{color:var(--red);border-color:var(--red)}
.qs-bar{position:sticky;bottom:12px;background:var(--glass-2);backdrop-filter:blur(18px) saturate(1.2);border:1px solid var(--line-2);border-radius:20px;padding:16px 18px;margin-top:18px;box-shadow:var(--shadow);z-index:4}
.qs-bar .btn{padding:13px 24px;margin-left:auto;white-space:nowrap}

/* ============ MARCA ============ */
.script{font-family:'Dancing Script',cursive;font-weight:700;line-height:.95}
.emblem{width:40px;height:40px;border-radius:50%;background:var(--surface);border:2px solid var(--brand);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.promo-banner{background:var(--ink-grad);color:var(--cream);text-align:center;padding:13px 18px;font-weight:600;font-size:13.5px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;letter-spacing:.2px}
.promo-banner b{background:var(--grad);color:#1a1206;padding:2px 11px;border-radius:99px}
.wa-float{position:fixed;right:22px;bottom:22px;background:#1fbe57;color:#fff;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:27px;box-shadow:0 14px 30px -6px rgba(31,190,87,.5);z-index:30;text-decoration:none;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}
.wa-float:hover{transform:scale(1.1) translateY(-2px);box-shadow:0 20px 40px -8px rgba(31,190,87,.6)}
.cart-float{position:fixed;right:22px;bottom:94px;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;background:var(--grad);color:#1a1206;font-size:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px -6px rgba(201,112,28,.5);z-index:30;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}
.cart-float:hover{transform:scale(1.1) translateY(-2px);box-shadow:0 20px 40px -8px rgba(201,112,28,.6)}
.cart-float-badge{position:absolute;top:-3px;right:-3px;background:#e23b3b;color:#fff;min-width:22px;height:22px;border-radius:99px;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 6px;border:2px solid var(--bg);font-family:'Space Grotesk'}

/* ============ STOREFRONT (loja premium clara) ============ */
.store{background:transparent;border-radius:20px;overflow:hidden;border:1px solid var(--line)}
.store--full{border:none;border-radius:0;min-height:100vh;max-width:1180px;margin:0 auto;background:transparent}
.size-badge{display:inline-block;background:rgba(20,12,6,.55);border:1px solid rgba(255,255,255,.18);color:#FFF3E0;border-radius:99px;padding:3px 11px;font-size:11px;font-weight:600;backdrop-filter:blur(6px)}
.store-nav{display:flex;justify-content:space-between;align-items:center;padding:15px 26px;position:sticky;top:0;background:var(--glass-2);backdrop-filter:blur(20px) saturate(1.3);border-bottom:1px solid var(--line);z-index:5}
.store-logo{font-weight:700;font-size:18px;display:flex;align-items:center;gap:9px}
.hero{position:relative;text-align:center;padding:66px 24px 36px;overflow:hidden}
.hero:before{content:"";position:absolute;top:-30px;left:50%;transform:translateX(-50%);width:min(720px,92%);height:480px;background:radial-gradient(circle,rgba(232,138,37,.20),transparent 62%);pointer-events:none;z-index:0;animation:pulse 6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.7;transform:translateX(-50%) scale(1)}50%{opacity:1;transform:translateX(-50%) scale(1.08)}}
.hero>*{position:relative;z-index:1}
.hero h2{font-family:'Space Grotesk',sans-serif;font-size:clamp(32px,6.5vw,62px);font-weight:700;line-height:1.03;letter-spacing:-1.5px;margin-bottom:14px;background:linear-gradient(100deg,var(--brown),var(--caramel),var(--gold),var(--caramel));background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:heroIn .9s cubic-bezier(.22,1,.36,1) both, shine 7s linear infinite .6s}
@keyframes shine{to{background-position:200% center}}
@keyframes heroIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.hero p{color:var(--mut);font-size:16px;max-width:520px;margin:0 auto 26px;line-height:1.6}
.pudim3d{width:180px;height:180px;margin:10px auto 30px;position:relative;filter:drop-shadow(0 24px 40px rgba(201,112,28,.4));animation:spin3d 9s ease-in-out infinite}
.pudim3d .body{font-size:150px;line-height:1;display:block;animation:float 4s ease-in-out infinite}
.drip{position:absolute;top:44%;left:50%;width:8px;height:0;background:linear-gradient(var(--caramel),var(--gold));border-radius:0 0 8px 8px;transform:translateX(-50%);animation:drip 3.4s ease-in infinite}
@keyframes spin3d{0%,100%{transform:rotateY(-8deg)}50%{transform:rotateY(8deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes drip{0%{height:0;opacity:0}20%{opacity:1}70%{height:52px;opacity:.9}100%{height:60px;opacity:0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pop{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.reveal{opacity:0;transform:translateY(26px);animation:reveal .85s cubic-bezier(.22,1,.36,1) forwards}
@keyframes reveal{to{opacity:1;transform:none}}
.store-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(214px,1fr));gap:22px;padding:24px 26px 44px}
.pcard{background:var(--surface);border:1px solid var(--line);border-radius:22px;overflow:hidden;cursor:pointer;box-shadow:var(--soft);transition:transform .32s cubic-bezier(.22,1,.36,1),box-shadow .32s,border-color .32s}
.pcard:hover{transform:translateY(-10px);box-shadow:var(--shadow);border-color:var(--line-2)}
.pcard .img{height:184px;display:flex;align-items:center;justify-content:center;font-size:60px;position:relative;overflow:hidden}
.pcard .img img{transition:transform .7s cubic-bezier(.22,1,.36,1)}
.pcard:hover .img img{transform:scale(1.08)}
.pcard .img:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-120%);transition:.7s}
.pcard:hover .img:after{transform:translateX(120%)}
.pcard .body{padding:16px 17px}
.pcard h3{font-family:'Space Grotesk',sans-serif;font-size:18px;margin-bottom:4px;font-weight:600;letter-spacing:-.3px}
.price{font-family:'Space Grotesk';font-weight:700;font-size:20px;color:var(--caramel)}
.price s{color:var(--mut);font-size:13px;font-weight:400;margin-right:6px}
.marquee{overflow:hidden;white-space:nowrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 0;background:var(--glass)}
.marquee span{display:inline-block;animation:scroll 24s linear infinite;color:var(--mut);font-size:13px;letter-spacing:.3px}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.glass{background:var(--glass);backdrop-filter:blur(14px) saturate(1.1);border:1px solid var(--line);border-radius:20px;box-shadow:var(--soft)}

/* ============ CARDÁPIO — blocos por sabor (linear) ============ */
.cardapio{max-width:1000px;margin:0 auto;padding:12px 22px 46px;display:flex;flex-direction:column;gap:20px}
.flavor{display:flex;background:var(--surface);border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:var(--soft);transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}
.flavor:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
.flavor-media{position:relative;width:300px;min-height:230px;flex-shrink:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.flavor-media img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;transition:transform .6s cubic-bezier(.22,1,.36,1)}
.flavor:hover .flavor-media img{transform:scale(1.06)}
.flavor-emoji{font-size:88px;line-height:1;filter:drop-shadow(0 12px 22px rgba(0,0,0,.35))}
.flavor-combo{position:absolute;left:14px;bottom:14px;z-index:1;background:var(--grad);color:#1a1206;font-weight:700;font-size:12px;padding:5px 12px;border-radius:99px;box-shadow:var(--soft)}
.flavor-info{flex:1;padding:22px 26px;min-width:0}
.flavor-info h3{font-family:'Space Grotesk',sans-serif;font-size:25px;font-weight:700;letter-spacing:-.6px;margin-bottom:4px}
.flavor-sizes{display:flex;flex-direction:column}
.size-opt{display:flex;align-items:center;gap:14px;padding:13px 2px;border-top:1px solid var(--line)}
.size-opt:first-child{border-top:none}
.size-opt-info{flex:1;display:flex;flex-direction:column;min-width:0;gap:1px}
.size-opt-porte{font-weight:700;font-size:15px}
.size-opt-price{font-family:'Space Grotesk';font-weight:700;font-size:19px;color:var(--caramel);white-space:nowrap}
.combo-inline{display:inline-block;margin-left:8px;background:var(--grad);color:#1a1206;font-weight:700;font-size:10.5px;padding:2px 9px;border-radius:99px;vertical-align:middle;white-space:nowrap}
.size-opt .btn{white-space:nowrap}
/* Checkout — forma de pagamento */
.pay-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pay-opt{display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 8px;border-radius:14px;border:1.5px solid var(--line);background:var(--surface);color:var(--ink);font-weight:700;font-size:14px;cursor:pointer;transition:.2s}
.pay-opt small{font-weight:500;font-size:11px;color:var(--mut)}
.pay-opt:hover{border-color:var(--brand)}
.pay-opt.on{border-color:var(--brand);background:linear-gradient(180deg,rgba(200,112,28,.10),rgba(200,112,28,.02));box-shadow:0 0 0 3px rgba(200,112,28,.12)}
/* Checkout — pagamento PIX */
.pix-pay{text-align:center}
.pix-num{display:inline-block;background:var(--glass);border:1px solid var(--line);border-radius:99px;padding:4px 14px;font-size:12.5px;color:var(--mut);margin-bottom:10px}
.pix-num b{color:var(--ink)}
.pix-total{display:flex;flex-direction:column;gap:2px;font-size:12.5px;color:var(--mut);margin-bottom:12px}
.pix-total b{font-size:26px;color:var(--brand);font-weight:800;letter-spacing:-.5px}
.pix-qr{display:flex;justify-content:center;margin-bottom:14px}
.pix-qr img{width:220px;height:220px;image-rendering:pixelated;border:8px solid #fff;border-radius:16px;box-shadow:var(--soft)}
.pix-copy{width:100%;margin-bottom:14px;background:var(--surface);border:1.5px dashed var(--brand);color:var(--brand);font-weight:700}
.pix-copy.ok{border-style:solid;background:linear-gradient(180deg,rgba(46,160,90,.12),rgba(46,160,90,.03));border-color:#2ea05a;color:#1f7d43}
.pix-info{display:flex;flex-direction:column;gap:6px;background:var(--glass);border:1px solid var(--line);border-radius:14px;padding:12px 14px;text-align:left;margin-bottom:4px}
.pix-info div{display:flex;justify-content:space-between;gap:10px;font-size:12.5px}
.pix-info span{color:var(--mut)}
.pix-info b{color:var(--ink);text-align:right}
.pix-wa{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-bottom:10px;text-decoration:none}
@media(max-width:720px){
  .flavor{flex-direction:column}
  .flavor-media{width:100%;min-height:190px}
  .flavor-emoji{font-size:74px}
  .cardapio{padding:10px 16px 36px}
  .flavor-info{padding:18px 18px}
}

/* ============ HERO CINEMATOGRÁFICO (vídeo de fundo) ============ */
.hero--cine{position:relative;min-height:min(88vh,780px);display:flex;align-items:center;justify-content:center;text-align:center;padding:0;overflow:hidden}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hero-scrim{position:absolute;inset:0;z-index:1;background:radial-gradient(120% 92% at 50% 30%,rgba(8,5,2,.40),rgba(5,3,1,.80) 78%),linear-gradient(180deg,rgba(6,4,2,.68),rgba(6,4,2,.44) 42%,rgba(6,4,2,.95))}
.hero-fade{position:absolute;left:0;right:0;bottom:0;height:130px;z-index:1;background:linear-gradient(180deg,transparent,var(--bg))}
.hero-inner{position:relative;z-index:2;max-width:840px;padding:60px 24px}
.hero-logo{width:132px;margin:0 auto 18px;filter:drop-shadow(0 16px 32px rgba(0,0,0,.55));animation:float 4s ease-in-out infinite}
.hero-script{font-size:clamp(40px,8vw,78px);color:var(--gold);margin-bottom:2px;text-shadow:0 8px 34px rgba(0,0,0,.55)}
.hero-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(30px,6vw,58px);font-weight:700;letter-spacing:-1.2px;line-height:1.03;margin-bottom:16px;background:linear-gradient(100deg,#FFF6E7,var(--gold),#FFF6E7);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shine 7s linear infinite}
.hero-sub{color:rgba(255,244,228,.86);font-size:16px;max-width:520px;margin:0 auto 26px;line-height:1.6}
.hero-sub b{color:#fff}
.hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.hero-cta .btn{padding:13px 26px;font-size:15px;background:var(--grad);color:#1a1206;box-shadow:0 12px 30px -8px rgba(201,112,28,.6)}
.hero-cta .btn:hover{box-shadow:0 18px 38px -8px rgba(201,112,28,.72),0 0 0 1px rgba(255,240,205,.4)}
.hero-cta .glassbtn{background:rgba(255,255,255,.12);color:#FFF3E2;border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(8px);text-decoration:none;padding:13px 24px;font-size:15px;font-weight:600;border-radius:12px;transition:transform .2s,background .2s;display:inline-flex;align-items:center;gap:7px;cursor:pointer}
.hero-cta .glassbtn:hover{background:rgba(255,255,255,.2);transform:translateY(-2px)}

/* ============ FAIXA CINEMATOGRÁFICA (imagem parallax) ============ */
.cine-band{position:relative;min-height:360px;display:flex;align-items:center;justify-content:center;text-align:center;background-size:cover;background-position:center;background-attachment:fixed;margin:10px 0}
.cine-band-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,5,3,.56),rgba(8,5,3,.46))}
.cine-band-content{position:relative;z-index:1;padding:44px 24px;max-width:640px}
.cine-band-content .script{color:var(--gold);text-shadow:0 6px 24px rgba(0,0,0,.55)}
.cine-band-content p{color:rgba(255,244,228,.9);margin-top:6px;font-size:15px;line-height:1.5}
.bastidores{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;padding:22px 26px 32px}
.bast-card{position:relative;border-radius:20px;overflow:hidden;box-shadow:var(--soft);aspect-ratio:4/3}
.bast-card img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s cubic-bezier(.22,1,.36,1)}
.bast-card:hover img{transform:scale(1.07)}
.bast-cap{position:absolute;left:12px;bottom:12px;background:rgba(10,6,3,.52);color:#FFF3E2;padding:5px 13px;border-radius:99px;font-size:12.5px;font-weight:600;backdrop-filter:blur(5px)}

/* ============ REVEAL AO ROLAR ============ */
.sr{opacity:0;transform:translateY(34px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
.sr-in{opacity:1;transform:none}

/* ============ RODAPÉ HOMOGÊNEO (escuro premium) ============ */
.store-foot{position:relative;margin-top:22px;background:var(--ink-grad);color:#F3E7CE;padding:46px 26px 30px;border-top:1px solid rgba(216,166,74,.22)}
.store-foot-inner{max-width:1000px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:22px;flex-wrap:wrap}
.foot-brand{display:flex;align-items:center;gap:14px}
.foot-brand .script{color:var(--gold);line-height:1}
.foot-tag{color:rgba(243,231,206,.7);font-size:12.5px;letter-spacing:.3px;margin-top:2px}
.foot-links{display:flex;gap:10px;flex-wrap:wrap}
.foot-links a,.foot-links button{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);color:#F3E7CE;padding:10px 16px;border-radius:99px;font-size:12.5px;font-weight:600;cursor:pointer;text-decoration:none;transition:transform .18s,background .18s,border-color .18s;display:inline-flex;align-items:center;gap:6px;font-family:Inter}
.foot-links a:hover,.foot-links button:hover{background:rgba(216,166,74,.18);border-color:var(--gold);color:#fff;transform:translateY(-2px)}
.foot-copy{max-width:1000px;margin:26px auto 0;text-align:center;color:rgba(243,231,206,.55);font-size:12px;border-top:1px solid rgba(255,255,255,.08);padding-top:18px}

/* ---- responsivo ---- */
@media(max-width:1000px){
  .g4,.g5{grid-template-columns:repeat(2,1fr)}
  .g3{grid-template-columns:1fr}
  .kanban,.kanban.k4{grid-template-columns:1fr}
}
@media(max-width:720px){
  .side{width:64px;padding:14px 8px}
  .side .lbl,.brand small,.brand .txt,.navgroup{display:none}
  .nav{justify-content:center;padding:11px 6px}
  .nav:hover{transform:none}
  .nav .badge{display:none}
  .main{padding:18px 15px}
  .g2,.g4,.g5{grid-template-columns:1fr}
  .store-nav{padding:13px 18px}
  .store-grid{padding:18px 16px 34px;gap:16px}
  .hero{padding:44px 20px 26px}
  .hero--cine{min-height:80vh}
  .hero-inner{padding:44px 20px}
  .cine-band{background-attachment:scroll;min-height:280px}
  .bastidores{padding:18px 16px 26px}
}

/* respeita redução de movimento */
@media(prefers-reduced-motion:reduce){
  *,*:before,*:after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
}
`;
