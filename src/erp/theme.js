// ============================================================
// DESIGN SYSTEM — Pudins da Lauren (premium dark)
// Tokens + estilos. Redesign visual: preto profundo, chocolate,
// caramelo e dourado. Tipografia editorial serifada + sans limpa.
// APENAS apresentação — nenhuma classe foi renomeada/removida.
// ============================================================

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Dancing+Script:wght@600;700&display=swap');

/* ---- Paleta premium dark (padrão) ---- */
:root, [data-theme="dark"]{
  --bg:#080503; --bg-2:#0D0907; --surface:#150C07; --surface-2:#1B1009;
  --elev:#241509; --line:rgba(216,166,74,.14); --line-2:rgba(216,166,74,.30);
  --brand:#D8A64A; --brand-soft:#F2CB73; --caramel:#E88A25; --caramel-deep:#B95D16;
  --brown:#F2CB73; --txt:#F5EFE4; --cream:#F7E7C6; --mut:#B7A588;
  --green:#5FD08A; --red:#F0705A; --blue:#6FA8FF; --purple:#B98BFF;
  --shadow:0 22px 55px rgba(0,0,0,.60); --glow:0 0 22px rgba(216,166,74,.30);
  --grad:linear-gradient(135deg,var(--brand-soft),var(--caramel));
  --btn-ink:#1E1206;
}
[data-theme="light"]{
  --bg:#F6EEDF; --bg-2:#FBF5EA; --surface:#FFFDF9; --surface-2:#FFFDF9;
  --elev:#F2E6D2; --line:rgba(150,100,35,.16); --line-2:rgba(150,100,35,.32);
  --brand:#B47A1E; --brand-soft:#D8A64A; --caramel:#B95D16; --caramel-deep:#8A4310;
  --brown:#5A3216; --txt:#3A2412; --cream:#5A3216; --mut:#96805f;
  --green:#2E9E63; --red:#D9503A; --blue:#3D74D6; --purple:#8455D6;
  --shadow:0 16px 40px rgba(120,80,30,.15); --glow:0 0 18px rgba(180,122,30,.20);
  --grad:linear-gradient(135deg,var(--brand),var(--caramel));
  --btn-ink:#FFF7EA;
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  background:
    radial-gradient(1100px 720px at 80% -160px, rgba(216,166,74,.10), transparent 60%),
    radial-gradient(760px 560px at -8% 6%, rgba(184,93,22,.09), transparent 55%),
    var(--bg);
  background-attachment:fixed;
  color:var(--txt);
  -webkit-font-smoothing:antialiased;
}
::selection{background:rgba(216,166,74,.28);color:var(--txt)}
::placeholder{color:var(--mut);opacity:.7}

/* scrollbar premium */
*::-webkit-scrollbar{width:10px;height:10px}
*::-webkit-scrollbar-thumb{background:rgba(216,166,74,.22);border-radius:99px;border:2px solid transparent;background-clip:content-box}
*::-webkit-scrollbar-thumb:hover{background:rgba(216,166,74,.42);background-clip:content-box}
*::-webkit-scrollbar-track{background:transparent}

/* foco acessível */
:focus-visible{outline:2px solid var(--brand);outline-offset:2px;border-radius:8px}

.app{display:flex;min-height:100vh;background:transparent;color:var(--txt);font-family:Inter,system-ui,sans-serif;font-size:14px}

/* tipografia editorial */
h1,h2,h3{font-family:'Playfair Display',Georgia,serif;letter-spacing:.1px}

/* ---- Sidebar ---- */
.side{width:238px;background:linear-gradient(180deg,var(--surface),var(--bg-2));border-right:1px solid var(--line);padding:18px 12px;display:flex;flex-direction:column;gap:2px;flex-shrink:0;position:sticky;top:0;height:100vh;overflow:auto;backdrop-filter:blur(6px)}
.brand{font-weight:700;font-size:18px;letter-spacing:.3px;padding:8px 10px 6px;display:flex;align-items:center;gap:10px}
.logo-dot{width:30px;height:30px;border-radius:9px;background:var(--grad);display:inline-flex;align-items:center;justify-content:center;font-size:17px;box-shadow:var(--glow)}
.brand small{display:block;font-family:Inter;font-weight:400;font-size:10.5px;color:var(--mut);letter-spacing:.5px}
.navgroup{font-size:10px;text-transform:uppercase;letter-spacing:1.4px;color:var(--mut);padding:16px 12px 6px;opacity:.7}
.nav{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:10px;color:var(--mut);cursor:pointer;font-weight:500;border:none;background:none;font-size:13.5px;text-align:left;width:100%;transition:background .18s,color .18s;position:relative}
.nav:hover{background:var(--elev);color:var(--txt)}
.nav.on{background:linear-gradient(90deg,rgba(216,166,74,.15),rgba(216,166,74,.02));color:var(--brand)}
.nav.on:before{content:"";position:absolute;left:0;top:7px;bottom:7px;width:3px;border-radius:0 99px 99px 0;background:var(--grad);box-shadow:var(--glow)}
.nav .ic{font-size:15px;width:18px;text-align:center}
.nav .badge{margin-left:auto;background:var(--grad);color:var(--btn-ink);font-size:10.5px;font-weight:700;border-radius:99px;padding:1px 7px;box-shadow:var(--glow)}

/* ---- Main ---- */
.main{flex:1;padding:28px 34px;overflow:auto;max-width:100%}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;gap:14px;flex-wrap:wrap}
h1{font-size:26px;font-weight:600;margin-bottom:3px;letter-spacing:-.2px}
.sub{color:var(--mut);font-size:13.5px}
h2{font-size:17px;font-weight:600;margin-bottom:13px}

/* ---- Grid ---- */
.grid{display:grid;gap:15px}
.g2{grid-template-columns:repeat(2,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g4{grid-template-columns:repeat(4,1fr)}
.g5{grid-template-columns:repeat(5,1fr)}

/* ---- Cards ---- */
.card{background:linear-gradient(180deg,var(--surface),var(--surface-2));border:1px solid var(--line);border-radius:16px;padding:17px 18px;box-shadow:0 2px 12px rgba(0,0,0,.28);position:relative;animation:fadeUp .45s ease both}
.card.pad{padding:19px 21px}
.k{color:var(--mut);font-size:11px;text-transform:uppercase;letter-spacing:.9px;font-weight:500}
.v{font-family:'Space Grotesk';font-size:26px;font-weight:600;margin-top:8px;letter-spacing:-.5px;color:var(--txt)}
.v small{font-size:12px;color:var(--mut);font-weight:400;font-family:Inter}
.kpi-ic{width:38px;height:38px;border-radius:11px;background:radial-gradient(circle at 30% 25%,rgba(216,166,74,.22),var(--elev));border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:11px}

/* ---- Tags ---- */
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;border:1px solid transparent}
.t-org{background:rgba(216,166,74,.14);color:var(--brand);border-color:rgba(216,166,74,.22)}
.t-grn{background:rgba(95,208,138,.14);color:var(--green);border-color:rgba(95,208,138,.2)}
.t-red{background:rgba(240,112,90,.14);color:var(--red);border-color:rgba(240,112,90,.2)}
.t-blu{background:rgba(111,168,255,.14);color:var(--blue);border-color:rgba(111,168,255,.2)}
.t-pur{background:rgba(185,139,255,.14);color:var(--purple);border-color:rgba(185,139,255,.2)}
.t-mut{background:rgba(183,165,136,.12);color:var(--mut);border-color:rgba(183,165,136,.18)}

/* ---- Buttons ---- */
.btn{background:var(--grad);color:var(--btn-ink);border:none;border-radius:11px;padding:9px 16px;font-weight:700;cursor:pointer;font-size:13px;font-family:Inter;transition:transform .18s,box-shadow .18s,filter .18s;box-shadow:0 6px 18px rgba(184,93,22,.28),inset 0 1px 0 rgba(255,255,255,.25)}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(184,93,22,.42),0 0 22px rgba(216,166,74,.30),inset 0 1px 0 rgba(255,255,255,.3);filter:brightness(1.04)}
.btn:active{transform:translateY(0)}
.btn.ghost{background:transparent;color:var(--brand);border:1px solid var(--line-2);box-shadow:none}
.btn.ghost:hover{border-color:var(--brand);background:rgba(216,166,74,.07);box-shadow:0 0 18px rgba(216,166,74,.22)}
.btn.soft{background:var(--elev);color:var(--txt);border:1px solid var(--line);box-shadow:none}
.btn.soft:hover{border-color:var(--line-2);color:var(--brand);box-shadow:none;filter:none}
.btn.mini{padding:6px 12px;font-size:12px;border-radius:9px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;filter:none}
.linklike{background:none;border:none;color:var(--brand);font-weight:600;cursor:pointer;font-size:inherit;font-family:inherit;padding:0;text-decoration:underline;text-underline-offset:2px}

/* ---- Rows / tables ---- */
.row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:none}
.name{font-weight:600}
.mut{color:var(--mut);font-size:12.5px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;color:var(--mut);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.7px;padding:10px 10px;border-bottom:1px solid var(--line-2)}
td{padding:12px 10px;border-bottom:1px solid var(--line)}
tr:last-child td{border-bottom:none}
tbody tr{transition:background .15s}
tbody tr:hover{background:rgba(216,166,74,.045)}
.num{font-family:'Space Grotesk';font-variant-numeric:tabular-nums}

/* ---- Bars / progress ---- */
.bar{height:7px;background:var(--elev);border-radius:99px;overflow:hidden;margin-top:8px;border:1px solid var(--line)}
.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--caramel),var(--brand-soft));border-radius:99px;transition:width .5s}

/* ---- Kanban ---- */
.kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;align-items:start}
.kanban.k4{grid-template-columns:repeat(4,1fr)}
.col h4{font-size:11.5px;color:var(--mut);text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.chip{background:var(--elev);border:1px solid var(--line);border-radius:13px;padding:13px;margin-bottom:10px;transition:border-color .18s,box-shadow .18s}
.chip:hover{border-color:var(--line-2)}
.chip .lote{font-family:'Space Grotesk';font-weight:600;letter-spacing:.5px;font-size:13px}

/* ---- Misc ---- */
.pill{display:inline-flex;gap:6px;align-items:center;background:var(--elev);border:1px solid var(--line);border-radius:99px;padding:6px 13px;font-size:12.5px}
.divider{height:1px;background:var(--line);margin:16px 0}
.empty{color:var(--mut);text-align:center;padding:28px;font-size:13px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--btn-ink);flex-shrink:0;box-shadow:var(--glow)}
.thumb{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:1px solid var(--line)}
.iconbtn{background:var(--elev);border:1px solid var(--line);color:var(--txt);width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:15px;display:inline-flex;align-items:center;justify-content:center;transition:.15s}
.iconbtn:hover{color:var(--brand);border-color:var(--line-2)}
.scroll-x{overflow-x:auto}
select,input,textarea{background:var(--elev);border:1px solid var(--line);color:var(--txt);border-radius:10px;padding:10px 12px;font-size:13px;font-family:Inter;width:100%;transition:border-color .15s,box-shadow .15s}
select:focus,input:focus,textarea:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(216,166,74,.16)}
label{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:6px}
.field{margin-bottom:13px}
.feed-item{font-size:12.5px;padding:9px 0;border-bottom:1px solid var(--line);color:var(--txt);display:flex;gap:8px}
.feed-item:before{content:"◆";color:var(--brand);font-size:9px;margin-top:3px}
.feed-item:last-child{border-bottom:none}

/* ---- Modal ---- */
.overlay{position:fixed;inset:0;background:rgba(6,4,3,.66);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;animation:fadeIn .2s ease}
.modal{background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line-2);border-radius:20px;padding:24px;width:100%;max-width:460px;box-shadow:var(--shadow),var(--glow);max-height:90vh;overflow:auto;animation:fadeUp .28s ease both}

/* ============ VENDA RÁPIDA (mobile-first) ============ */
.qs-chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin:6px 0 16px;-webkit-overflow-scrolling:touch}
.qs-chip{flex-shrink:0;padding:9px 15px;border-radius:99px;border:1px solid var(--line);background:var(--surface);color:var(--mut);cursor:pointer;font-weight:600;font-size:13.5px;display:inline-flex;gap:7px;align-items:center;white-space:nowrap;transition:.15s}
.qs-chip:hover{color:var(--txt);border-color:var(--line-2)}
.qs-chip.on{background:var(--grad);color:var(--btn-ink);border-color:transparent;box-shadow:0 4px 14px rgba(184,93,22,.3)}
.qs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px}
.qs-tile{background:linear-gradient(180deg,var(--surface),var(--surface-2));border:1px solid var(--line);border-radius:16px;padding:16px 12px;cursor:pointer;user-select:none;position:relative;transition:transform .12s,border-color .15s,box-shadow .15s;text-align:center}
.qs-tile:hover{border-color:var(--line-2);box-shadow:var(--glow)}
.qs-tile:active{transform:scale(.96)}
.qs-tile.sel{border-color:var(--brand);box-shadow:0 0 0 2px rgba(216,166,74,.35)}
.qs-tile .em{font-size:42px;line-height:1}
.qs-qty{position:absolute;top:8px;right:8px;background:var(--grad);color:var(--btn-ink);font-weight:700;border-radius:99px;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13.5px;padding:0 7px;font-family:'Space Grotesk';box-shadow:var(--glow)}
.qs-minus{position:absolute;bottom:10px;left:10px;width:30px;height:30px;border-radius:9px;border:1px solid var(--line);background:var(--elev);color:var(--txt);font-size:18px;cursor:pointer;line-height:1}
.qs-minus:hover{color:var(--red);border-color:var(--red)}
.qs-bar{position:sticky;bottom:12px;background:color-mix(in srgb,var(--surface) 88%,transparent);backdrop-filter:blur(14px);border:1px solid var(--line-2);border-radius:16px;padding:15px 17px;margin-top:18px;box-shadow:var(--shadow);z-index:4}
.qs-bar .btn{padding:12px 22px;margin-left:auto;white-space:nowrap}

/* ============ MARCA — Pudins da Lauren ============ */
.script{font-family:'Dancing Script',cursive;font-weight:700;line-height:.95}
.emblem{width:40px;height:40px;border-radius:50%;background:var(--surface);border:2px solid var(--brand);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.promo-banner{background:linear-gradient(100deg,#5A2B0A,var(--caramel-deep),var(--caramel));color:#FFF3E2;text-align:center;padding:12px 18px;font-weight:600;font-size:13.5px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;letter-spacing:.2px}
.promo-banner b{background:rgba(255,255,255,.18);padding:2px 10px;border-radius:99px}
.wa-float{position:fixed;right:20px;bottom:20px;background:#20b358;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 10px 28px rgba(32,179,88,.45);z-index:30;text-decoration:none;transition:transform .18s,box-shadow .18s}
.wa-float:hover{transform:scale(1.08) translateY(-2px);box-shadow:0 14px 34px rgba(32,179,88,.55)}

/* ============ STOREFRONT (loja premium) ============ */
.store{background:radial-gradient(1200px 600px at 72% -10%,rgba(216,166,74,.14),transparent 55%),var(--bg);border-radius:16px;overflow:hidden;border:1px solid var(--line)}
.store--full{border:none;border-radius:0;min-height:100vh;max-width:1180px;margin:0 auto}
.size-badge{display:inline-block;background:rgba(0,0,0,.45);border:1px solid var(--line-2);color:var(--cream);border-radius:99px;padding:3px 10px;font-size:11px;font-weight:600;backdrop-filter:blur(4px)}
.store-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 26px;position:sticky;top:0;background:color-mix(in srgb,var(--bg-2) 72%,transparent);backdrop-filter:blur(16px) saturate(1.3);border-bottom:1px solid var(--line-2);z-index:5}
.store-logo{font-weight:700;font-size:18px;display:flex;align-items:center;gap:9px}
.hero{position:relative;text-align:center;padding:64px 24px 34px;overflow:hidden}
.hero:before{content:"";position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:min(680px,90%);height:460px;background:radial-gradient(circle,rgba(216,166,74,.18),transparent 62%);pointer-events:none;z-index:0}
.hero>*{position:relative;z-index:1}
.hero h2{font-family:'Playfair Display',serif;font-size:clamp(30px,6vw,58px);font-weight:700;line-height:1.04;letter-spacing:-.5px;margin-bottom:14px;background:linear-gradient(120deg,var(--cream) 10%,var(--brand) 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--mut);font-size:16px;max-width:520px;margin:0 auto 26px;line-height:1.6}
.pudim3d{width:180px;height:180px;margin:10px auto 30px;position:relative;filter:drop-shadow(0 24px 40px rgba(216,166,74,.4));animation:spin3d 9s ease-in-out infinite}
.pudim3d .body{font-size:150px;line-height:1;display:block;animation:float 4s ease-in-out infinite}
.drip{position:absolute;top:44%;left:50%;width:8px;height:0;background:linear-gradient(var(--caramel),var(--brand-soft));border-radius:0 0 8px 8px;transform:translateX(-50%);animation:drip 3.4s ease-in infinite}
@keyframes spin3d{0%,100%{transform:rotateY(-8deg)}50%{transform:rotateY(8deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes drip{0%{height:0;opacity:0}20%{opacity:1}70%{height:52px;opacity:.9}100%{height:60px;opacity:0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.reveal{opacity:0;transform:translateY(24px);animation:reveal .8s forwards}
@keyframes reveal{to{opacity:1;transform:none}}
.store-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(212px,1fr));gap:20px;padding:22px 26px 42px}
.pcard{background:linear-gradient(180deg,var(--surface),var(--surface-2));border:1px solid var(--line);border-radius:18px;overflow:hidden;cursor:pointer;transition:transform .3s,box-shadow .3s,border-color .3s}
.pcard:hover{transform:translateY(-8px);box-shadow:var(--shadow),var(--glow);border-color:var(--line-2)}
.pcard .img{height:180px;display:flex;align-items:center;justify-content:center;font-size:60px;position:relative;overflow:hidden}
.pcard .img img{transition:transform .6s ease}
.pcard:hover .img img{transform:scale(1.07)}
.pcard .img:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,240,205,.22) 50%,transparent 70%);transform:translateX(-120%);transition:.6s}
.pcard:hover .img:after{transform:translateX(120%)}
.pcard .body{padding:15px 16px}
.pcard h3{font-family:'Playfair Display',serif;font-size:18px;margin-bottom:4px;font-weight:600}
.price{font-family:'Space Grotesk';font-weight:700;font-size:19px;color:var(--brand)}
.price s{color:var(--mut);font-size:13px;font-weight:400;margin-right:6px}
.marquee{overflow:hidden;white-space:nowrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:13px 0;background:var(--surface-2)}
.marquee span{display:inline-block;animation:scroll 24s linear infinite;color:var(--mut);font-size:13px;letter-spacing:.3px}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.glass{background:color-mix(in srgb,var(--surface) 62%,transparent);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}

/* ---- responsivo ---- */
@media(max-width:1000px){
  .g4,.g5{grid-template-columns:repeat(2,1fr)}
  .g3{grid-template-columns:1fr}
  .kanban,.kanban.k4{grid-template-columns:1fr}
}
@media(max-width:720px){
  .side{width:62px;padding:14px 8px}
  .side .lbl,.brand small,.brand .txt,.navgroup{display:none}
  .nav{justify-content:center;padding:11px 6px}
  .nav .badge{display:none}
  .main{padding:18px 15px}
  .g2,.g4,.g5{grid-template-columns:1fr}
  .store-nav{padding:14px 18px}
  .store-grid{padding:18px 16px 34px;gap:16px}
}

/* respeita redução de movimento */
@media(prefers-reduced-motion:reduce){
  *,*:before,*:after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
}
`;
