// ============================================================
// DESIGN SYSTEM — tokens + estilos (dark & light)
// Identidade PudimERP: caramelo/creme, premium, minimalista.
// Um único arquivo CSS injetado uma vez pelo App.
// ============================================================

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Dancing+Script:wght@600;700&display=swap');

:root, [data-theme="light"]{
  --bg:#F5E9D6; --surface:#FFFCF6; --elev:#F4E8D5; --line:#E7D5BB;
  --brand:#C8701C; --brand-soft:#E9A94A; --caramel:#A85616; --brown:#5A3216;
  --txt:#4A2E17; --mut:#9A8266;
  --green:#2E9E63; --red:#D9503A; --blue:#3D74D6; --purple:#8455D6;
  --shadow:0 14px 38px rgba(120,80,30,.16);
}
[data-theme="dark"]{
  --bg:#141009; --surface:#1E1710; --elev:#2A2015; --line:#38291A;
  --brand:#E9A94A; --brand-soft:#F3C583; --caramel:#C8701C; --brown:#F3D9B5;
  --txt:#F6ECDB; --mut:#B0A088;
  --green:#5FD08A; --red:#F0705A; --blue:#6FA8FF; --purple:#B98BFF;
  --shadow:0 14px 44px rgba(0,0,0,.5);
}

*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg)}
.app{display:flex;min-height:100vh;background:var(--bg);color:var(--txt);font-family:Inter,system-ui,sans-serif;font-size:14px}

/* ---- Sidebar ---- */
.side{width:230px;background:var(--surface);border-right:1px solid var(--line);padding:18px 12px;display:flex;flex-direction:column;gap:2px;flex-shrink:0;position:sticky;top:0;height:100vh;overflow:auto}
.brand{font-family:'Space Grotesk';font-weight:700;font-size:18px;letter-spacing:.3px;padding:6px 10px 4px;display:flex;align-items:center;gap:10px}
.logo-dot{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--brand),var(--caramel));display:inline-flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 0 18px rgba(224,164,92,.4)}
.brand small{display:block;font-family:Inter;font-weight:400;font-size:10.5px;color:var(--mut);letter-spacing:.4px}
.navgroup{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--mut);padding:14px 12px 6px;opacity:.7}
.nav{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:9px;color:var(--mut);cursor:pointer;font-weight:500;border:none;background:none;font-size:13.5px;text-align:left;width:100%;transition:.15s}
.nav:hover{background:var(--elev);color:var(--txt)}
.nav.on{background:var(--elev);color:var(--brand)}
.nav .ic{font-size:15px;width:18px;text-align:center}
.nav .badge{margin-left:auto;background:var(--brand);color:#1a1206;font-size:10.5px;font-weight:700;border-radius:99px;padding:1px 7px}

/* ---- Main ---- */
.main{flex:1;padding:26px 32px;overflow:auto;max-width:100%}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;gap:14px;flex-wrap:wrap}
h1{font-family:'Space Grotesk';font-size:23px;font-weight:600;margin-bottom:2px;letter-spacing:-.2px}
.sub{color:var(--mut);font-size:13.5px}
h2{font-family:'Space Grotesk';font-size:15px;font-weight:600;margin-bottom:12px}

/* ---- Grid ---- */
.grid{display:grid;gap:14px}
.g2{grid-template-columns:repeat(2,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g4{grid-template-columns:repeat(4,1fr)}
.g5{grid-template-columns:repeat(5,1fr)}

/* ---- Cards ---- */
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px}
.card.pad{padding:18px 20px}
.k{color:var(--mut);font-size:11px;text-transform:uppercase;letter-spacing:.7px}
.v{font-family:'Space Grotesk';font-size:25px;font-weight:600;margin-top:7px;letter-spacing:-.5px}
.v small{font-size:12px;color:var(--mut);font-weight:400;font-family:Inter}
.kpi-ic{width:34px;height:34px;border-radius:10px;background:var(--elev);display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:10px}

/* ---- Tags ---- */
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap}
.t-org{background:rgba(224,164,92,.16);color:var(--brand)}
.t-grn{background:rgba(95,208,138,.16);color:var(--green)}
.t-red{background:rgba(240,112,90,.16);color:var(--red)}
.t-blu{background:rgba(111,168,255,.16);color:var(--blue)}
.t-pur{background:rgba(185,139,255,.16);color:var(--purple)}
.t-mut{background:rgba(167,154,136,.16);color:var(--mut)}

/* ---- Buttons ---- */
.btn{background:linear-gradient(135deg,var(--brand),var(--caramel));color:#1a1206;border:none;border-radius:9px;padding:8px 14px;font-weight:600;cursor:pointer;font-size:13px;transition:.15s;font-family:Inter}
.btn:hover{filter:brightness(1.07);transform:translateY(-1px)}
.btn.ghost{background:transparent;color:var(--brand);border:1px solid var(--brand)}
.btn.soft{background:var(--elev);color:var(--txt);border:1px solid var(--line)}
.btn.mini{padding:5px 11px;font-size:12px;border-radius:8px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* ---- Rows / tables ---- */
.row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:none}
.name{font-weight:600}
.mut{color:var(--mut);font-size:12.5px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;color:var(--mut);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.6px;padding:9px 10px;border-bottom:1px solid var(--line)}
td{padding:11px 10px;border-bottom:1px solid var(--line)}
tr:last-child td{border-bottom:none}
.num{font-family:'Space Grotesk';font-variant-numeric:tabular-nums}

/* ---- Bars / progress ---- */
.bar{height:7px;background:var(--elev);border-radius:99px;overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--brand),var(--brand-soft));border-radius:99px;transition:width .4s}

/* ---- Kanban ---- */
.kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}
.kanban.k4{grid-template-columns:repeat(4,1fr)}
.col h4{font-size:11.5px;color:var(--mut);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.chip{background:var(--elev);border:1px solid var(--line);border-radius:11px;padding:12px;margin-bottom:10px}
.chip .lote{font-family:'Space Grotesk';font-weight:600;letter-spacing:.5px;font-size:13px}

/* ---- Misc ---- */
.pill{display:inline-flex;gap:6px;align-items:center;background:var(--elev);border:1px solid var(--line);border-radius:99px;padding:5px 12px;font-size:12.5px}
.divider{height:1px;background:var(--line);margin:16px 0}
.empty{color:var(--mut);text-align:center;padding:26px;font-size:13px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--caramel));display:flex;align-items:center;justify-content:center;font-weight:700;color:#1a1206;flex-shrink:0}
.thumb{width:46px;height:46px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.iconbtn{background:var(--elev);border:1px solid var(--line);color:var(--txt);width:34px;height:34px;border-radius:9px;cursor:pointer;font-size:15px;display:inline-flex;align-items:center;justify-content:center}
.iconbtn:hover{color:var(--brand)}
.scroll-x{overflow-x:auto}
select,input,textarea{background:var(--elev);border:1px solid var(--line);color:var(--txt);border-radius:9px;padding:9px 11px;font-size:13px;font-family:Inter;width:100%}
label{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px}
.field{margin-bottom:12px}
.feed-item{font-size:12.5px;padding:9px 0;border-bottom:1px solid var(--line);color:var(--txt);display:flex;gap:8px}
.feed-item:before{content:"◆";color:var(--brand);font-size:9px;margin-top:3px}
.feed-item:last-child{border-bottom:none}

/* ---- Modal ---- */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px}
.modal{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px;width:100%;max-width:460px;box-shadow:var(--shadow);max-height:90vh;overflow:auto}

/* ============ VENDA RÁPIDA (mobile-first) ============ */
.qs-chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin:6px 0 16px;-webkit-overflow-scrolling:touch}
.qs-chip{flex-shrink:0;padding:9px 15px;border-radius:99px;border:1px solid var(--line);background:var(--surface);color:var(--mut);cursor:pointer;font-weight:600;font-size:13.5px;display:inline-flex;gap:7px;align-items:center;white-space:nowrap;transition:.12s}
.qs-chip:hover{color:var(--txt)}
.qs-chip.on{background:linear-gradient(135deg,var(--brand),var(--caramel));color:#1a1206;border-color:transparent}
.qs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px}
.qs-tile{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:16px 12px;cursor:pointer;user-select:none;position:relative;transition:transform .1s,border-color .1s;text-align:center}
.qs-tile:hover{border-color:var(--brand)}
.qs-tile:active{transform:scale(.96)}
.qs-tile.sel{border-color:var(--brand);box-shadow:0 0 0 2px rgba(224,164,92,.35)}
.qs-tile .em{font-size:42px;line-height:1}
.qs-qty{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,var(--brand),var(--caramel));color:#1a1206;font-weight:700;border-radius:99px;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13.5px;padding:0 7px;font-family:'Space Grotesk'}
.qs-minus{position:absolute;bottom:10px;left:10px;width:30px;height:30px;border-radius:9px;border:1px solid var(--line);background:var(--elev);color:var(--txt);font-size:18px;cursor:pointer;line-height:1}
.qs-minus:hover{color:var(--red);border-color:var(--red)}
.qs-bar{position:sticky;bottom:12px;background:color-mix(in srgb,var(--surface) 92%,transparent);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:16px;padding:14px 16px;margin-top:18px;box-shadow:var(--shadow);z-index:4}
.qs-bar .btn{padding:12px 20px;margin-left:auto;white-space:nowrap}

/* ============ MARCA — Pudins da Lauren ============ */
.script{font-family:'Dancing Script',cursive;font-weight:700;line-height:.95}
.emblem{width:40px;height:40px;border-radius:50%;background:var(--surface);border:2px solid var(--brand);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.promo-banner{background:linear-gradient(100deg,var(--caramel),var(--brand));color:#fff;text-align:center;padding:11px 18px;font-weight:600;font-size:13.5px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap}
.promo-banner b{background:rgba(255,255,255,.22);padding:2px 10px;border-radius:99px}
.wa-float{position:fixed;right:20px;bottom:20px;background:#25D366;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 8px 24px rgba(37,211,102,.45);z-index:30;text-decoration:none;transition:.15s}
.wa-float:hover{transform:scale(1.08)}

/* ============ STOREFRONT (loja premium) ============ */
.store{background:radial-gradient(1200px 600px at 70% -10%,rgba(232,169,74,.20),transparent),var(--bg);border-radius:16px;overflow:hidden;border:1px solid var(--line)}
.store--full{border:none;border-radius:0;min-height:100vh;max-width:1180px;margin:0 auto}
.size-badge{display:inline-block;background:var(--elev);border:1px solid var(--line);color:var(--mut);border-radius:99px;padding:2px 9px;font-size:11px;font-weight:600}
.store-nav{display:flex;justify-content:space-between;align-items:center;padding:18px 26px;position:sticky;top:0;background:color-mix(in srgb,var(--surface) 82%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);z-index:5}
.store-logo{font-family:'Space Grotesk';font-weight:700;font-size:18px;display:flex;align-items:center;gap:9px}
.hero{position:relative;text-align:center;padding:60px 24px 30px}
.hero h2{font-family:'Space Grotesk';font-size:clamp(30px,6vw,58px);font-weight:700;line-height:1.02;letter-spacing:-1.5px;margin-bottom:14px;background:linear-gradient(120deg,var(--txt),var(--brand));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--mut);font-size:16px;max-width:520px;margin:0 auto 26px}
.pudim3d{width:180px;height:180px;margin:10px auto 30px;position:relative;filter:drop-shadow(0 24px 40px rgba(199,123,59,.4));animation:spin3d 9s ease-in-out infinite}
.pudim3d .body{font-size:150px;line-height:1;display:block;animation:float 4s ease-in-out infinite}
.drip{position:absolute;top:44%;left:50%;width:8px;height:0;background:linear-gradient(var(--caramel),var(--brand-soft));border-radius:0 0 8px 8px;transform:translateX(-50%);animation:drip 3.4s ease-in infinite}
@keyframes spin3d{0%,100%{transform:rotateY(-8deg)}50%{transform:rotateY(8deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes drip{0%{height:0;opacity:0}20%{opacity:1}70%{height:52px;opacity:.9}100%{height:60px;opacity:0}}
.reveal{opacity:0;transform:translateY(24px);animation:reveal .8s forwards}
@keyframes reveal{to{opacity:1;transform:none}}
.store-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px;padding:20px 26px 40px}
.pcard{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;cursor:pointer;transition:transform .25s,box-shadow .25s}
.pcard:hover{transform:translateY(-8px) rotateX(3deg);box-shadow:var(--shadow)}
.pcard .img{height:170px;display:flex;align-items:center;justify-content:center;font-size:60px;position:relative;overflow:hidden}
.pcard .img:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);transform:translateX(-120%);transition:.5s}
.pcard:hover .img:after{transform:translateX(120%)}
.pcard .body{padding:14px}
.pcard h3{font-family:'Space Grotesk';font-size:15px;margin-bottom:4px}
.price{font-family:'Space Grotesk';font-weight:700;font-size:18px;color:var(--brand)}
.price s{color:var(--mut);font-size:13px;font-weight:400;margin-right:6px}
.marquee{overflow:hidden;white-space:nowrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:12px 0;background:var(--surface)}
.marquee span{display:inline-block;animation:scroll 22s linear infinite;color:var(--mut);font-size:13px}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.glass{background:color-mix(in srgb,var(--surface) 70%,transparent);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:16px}

/* ---- responsivo ---- */
@media(max-width:1000px){
  .g4,.g5{grid-template-columns:repeat(2,1fr)}
  .g3{grid-template-columns:1fr}
  .kanban,.kanban.k4{grid-template-columns:1fr}
}
@media(max-width:720px){
  .side{width:60px;padding:14px 8px}
  .side .lbl,.brand small,.brand .txt,.navgroup{display:none}
  .nav{justify-content:center;padding:10px 6px}
  .nav .badge{display:none}
  .main{padding:18px 14px}
  .g2,.g4,.g5{grid-template-columns:1fr}
}
`;
