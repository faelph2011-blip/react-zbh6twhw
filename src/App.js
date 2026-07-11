import { useState } from "react";

// ============================================================
// SISTEMA BIT v0.1 — Protótipo funcional unificado
// Complexo BIT · Bit Car + Bit Beauty + Locações + Fidelidade ₿
// Design: identidade Bit Car (dark premium, laranja ₿ #F7931A)
// Estrutura de módulos espelha os bounded contexts (Cap. 3)
// ============================================================

const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
:root{
  --bg:#0B0B0D; --surface:#141417; --elev:#1D1D22; --line:#26262C;
  --orange:#F7931A; --orange-soft:#FFB347; --txt:#F2EFE9; --mut:#9B978E;
  --green:#3ECF8E; --red:#F0564A; --blue:#5CA8FF;
}
*{box-sizing:border-box;margin:0;padding:0}
.bit{display:flex;min-height:100vh;background:var(--bg);color:var(--txt);font-family:Inter,sans-serif;font-size:14px}
.side{width:216px;background:var(--surface);border-right:1px solid var(--line);padding:20px 12px;display:flex;flex-direction:column;gap:4px;flex-shrink:0}
.logo{font-family:'Space Grotesk';font-weight:700;font-size:20px;letter-spacing:.5px;padding:4px 10px 18px;display:flex;align-items:center;gap:8px}
.bcoin{width:26px;height:26px;border-radius:50%;background:var(--orange);color:#0B0B0D;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;box-shadow:0 0 14px rgba(247,147,26,.45)}
.nav{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;color:var(--mut);cursor:pointer;font-weight:500;border:none;background:none;font-size:14px;text-align:left;width:100%}
.nav:hover{background:var(--elev);color:var(--txt)}
.nav.on{background:var(--elev);color:var(--orange)}
.nav .dot{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.85}
.main{flex:1;padding:26px 30px;overflow:auto}
h1{font-family:'Space Grotesk';font-size:22px;font-weight:600;margin-bottom:2px}
.sub{color:var(--mut);margin-bottom:22px}
.grid{display:grid;gap:14px}
.g3{grid-template-columns:repeat(3,1fr)}
.g4{grid-template-columns:repeat(4,1fr)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px}
.k{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.6px}
.v{font-family:'Space Grotesk';font-size:26px;font-weight:600;margin-top:6px}
.v small{font-size:13px;color:var(--mut);font-weight:400;font-family:Inter}
.tag{display:inline-block;padding:3px 9px;border-radius:99px;font-size:11.5px;font-weight:600}
.t-org{background:rgba(247,147,26,.14);color:var(--orange)}
.t-grn{background:rgba(62,207,142,.14);color:var(--green)}
.t-red{background:rgba(240,86,74,.14);color:var(--red)}
.t-blu{background:rgba(92,168,255,.14);color:var(--blue)}
.t-mut{background:rgba(155,151,142,.14);color:var(--mut)}
.btn{background:var(--orange);color:#0B0B0D;border:none;border-radius:8px;padding:7px 13px;font-weight:600;cursor:pointer;font-size:13px}
.btn:hover{background:var(--orange-soft)}
.btn.ghost{background:transparent;color:var(--orange);border:1px solid var(--orange)}
.btn.mini{padding:4px 10px;font-size:12px}
.row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:none}
.name{font-weight:600}
.mut{color:var(--mut);font-size:12.5px}
.cols{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}
.col h4{font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;display:flex;justify-content:space-between}
.os{background:var(--elev);border:1px solid var(--line);border-radius:10px;padding:12px;margin-bottom:10px}
.os .plate{font-family:'Space Grotesk';font-weight:600;letter-spacing:1px}
.bal{display:inline-flex;align-items:center;gap:5px;font-family:'Space Grotesk';font-weight:600;color:var(--orange)}
.bal .bcoin{width:17px;height:17px;font-size:11px;box-shadow:none}
.bar{height:6px;background:var(--elev);border-radius:99px;overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:var(--orange);border-radius:99px}
.salas{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
@media(max-width:900px){.side{width:64px}.side .lbl,.logo span{display:none}.g3,.g4,.salas,.cols{grid-template-columns:1fr 1fr}.main{padding:18px}}
`;

// ---------- seed (em memória — substituído pelo Postgres/Prisma em produção)
const seedClientes = [
  { id: 1, nome: "Camila Andrade", tel: "(34) 99911-2211", saldo: 84, car: true, beauty: true, origem: "Instagram" },
  { id: 2, nome: "Ricardo Mota", tel: "(34) 99822-3344", saldo: 152, car: true, beauty: false, origem: "Fachada" },
  { id: 3, nome: "Fernanda Lopes", tel: "(34) 99733-1122", saldo: 27, car: false, beauty: true, origem: "Indicação" },
  { id: 4, nome: "João Pereira", tel: "(34) 99644-5566", saldo: 61, car: true, beauty: false, origem: "Google" },
];
const seedOS = [
  { id: 101, placa: "RTX-2F45", modelo: "Corolla Cross", cliente: "Ricardo Mota", servico: "Lavagem VIP + Cera", plano: "VIP", etapa: 0 },
  { id: 102, placa: "QNJ-8B12", modelo: "T-Cross", cliente: "Camila Andrade", servico: "Lavagem Completa", plano: "Plano 8 · 5/8", etapa: 1 },
  { id: 103, placa: "PXA-1C09", modelo: "Hilux", cliente: "João Pereira", servico: "Higienização Interna", plano: "Avulso", etapa: 2 },
];
const seedAg = [
  { id: 201, hora: "09:00", cliente: "Camila Andrade", proc: "Limpeza de Pele Premium", prof: "Dra. Paula", status: "CONFIRMADO", pacote: "Pele · 3/6" },
  { id: 202, hora: "10:30", cliente: "Fernanda Lopes", proc: "Drenagem Linfática", prof: "Dra. Paula", status: "PENDENTE", pacote: "Avulso" },
  { id: 203, hora: "14:00", cliente: "Beatriz Nunes", proc: "Peeling de Diamante", prof: "Marina S.", status: "CONFIRMADO", pacote: "Avulso" },
  { id: 204, hora: "16:00", cliente: "Camila Andrade", proc: "Massagem Relaxante", prof: "Marina S.", status: "PENDENTE", pacote: "₿ resgate" },
];
const seedSalas = [
  { n: 1, status: "OCUPADA", inquilino: "Barbearia Premium Norte", aluguel: 3200, venc: "05/07", pago: true, parceiroB: true },
  { n: 2, status: "OCUPADA", inquilino: "OdontoStudio", aluguel: 3500, venc: "10/07", pago: false, parceiroB: false },
  { n: 3, status: "OCUPADA", inquilino: "Café Grão Real", aluguel: 2900, venc: "05/07", pago: true, parceiroB: true },
  { n: 4, status: "OCUPADA", inquilino: "Ótica Vision", aluguel: 3100, venc: "15/07", pago: true, parceiroB: false },
  { n: 5, status: "VAGA", inquilino: null, aluguel: 3200, venc: null, pago: null, parceiroB: false },
  { n: 6, status: "VAGA", inquilino: null, aluguel: 3400, venc: null, pago: null, parceiroB: false },
];
const ETAPAS = ["Fila", "Em execução", "Conferência", "Pronto"];
const brl = (v) => "R$ " + v.toLocaleString("pt-BR");

export default function SistemaBIT() {
  const [tab, setTab] = useState("dash");
  const [os, setOs] = useState(seedOS);
  const [ag, setAg] = useState(seedAg);
  const [salas, setSalas] = useState(seedSalas);
  const [clientes] = useState(seedClientes);
  const [feed, setFeed] = useState([
    "₿ +12 creditados — Camila Andrade (OS #98 paga)",
    "Aluguel Sala 1 liquidado — Barbearia Premium Norte",
    "Oferta cross aceita — Ricardo Mota agendou avaliação Beauty",
  ]);
  const log = (m) => setFeed((f) => [m, ...f].slice(0, 8));

  const avanca = (id) =>
    setOs((l) => l.map((o) => (o.id === id ? { ...o, etapa: Math.min(o.etapa + 1, 3) } : o)));
  const entrega = (id) => {
    const o = os.find((x) => x.id === id);
    setOs((l) => l.filter((x) => x.id !== id));
    log(`OS #${id} entregue — ${o.cliente} · ₿ creditados · lançado no caixa CAR`);
  };
  const confirma = (id) =>
    setAg((l) => l.map((a) => (a.id === id ? { ...a, status: "CONFIRMADO" } : a)));
  const realiza = (id) => {
    const a = ag.find((x) => x.id === id);
    setAg((l) => l.filter((x) => x.id !== id));
    log(`Atendimento ${a.hora} realizado — ${a.cliente} · evolução registrada · caixa BEAUTY`);
  };
  const baixaAluguel = (n) => {
    setSalas((l) => l.map((s) => (s.n === n ? { ...s, pago: true } : s)));
    log(`Aluguel Sala ${n} liquidado — lançado no DRE LOCAÇÕES`);
  };

  const ocupadas = salas.filter((s) => s.status === "OCUPADA").length;
  const receitaAluguel = salas.filter((s) => s.pago).reduce((t, s) => t + s.aluguel, 0);
  const cross = clientes.filter((c) => c.car && c.beauty).length;

  const NAVS = [
    ["dash", "Dashboard"],
    ["car", "Bit Car"],
    ["beauty", "Bit Beauty"],
    ["salas", "Locações"],
    ["cli", "Clientes ₿"],
  ];

  return (
    <div className="bit">
      <style>{css}</style>
      <aside className="side">
        <div className="logo"><span className="bcoin">₿</span><span>COMPLEXO BIT</span></div>
        {NAVS.map(([k, l]) => (
          <button key={k} className={"nav " + (tab === k ? "on" : "")} onClick={() => setTab(k)}>
            <span className="dot" /><span className="lbl">{l}</span>
          </button>
        ))}
      </aside>

      <main className="main">
        {tab === "dash" && (
          <>
            <h1>Visão do Complexo</h1>
            <div className="sub">Três motores de receita · sexta-feira, 10 de julho</div>
            <div className="grid g4">
              <div className="card"><div className="k">Bit Car · hoje</div><div className="v">{os.length} <small>carros no pátio</small></div><span className="tag t-org">meta 9/dia</span></div>
              <div className="card"><div className="k">Bit Beauty · agenda</div><div className="v">{ag.length} <small>atendimentos</small></div><span className="tag t-grn">{ag.filter(a=>a.status==="CONFIRMADO").length} confirmados</span></div>
              <div className="card"><div className="k">Locações</div><div className="v">{ocupadas}/6 <small>salas</small></div><span className="tag t-org">{brl(receitaAluguel)} recebido</span></div>
              <div className="card"><div className="k">Cross Car×Beauty</div><div className="v">{Math.round((cross/clientes.length)*100)}% <small>da base</small></div><span className="tag t-blu">meta H1: 12%</span></div>
            </div>
            <div className="grid g3" style={{ marginTop: 14 }}>
              <div className="card" style={{ gridColumn: "span 2" }}>
                <div className="k" style={{ marginBottom: 8 }}>Eventos do sistema (trilha de domínio)</div>
                {feed.map((f, i) => (<div key={i} className="row"><span style={{fontSize:13}}>{f}</span></div>))}
              </div>
              <div className="card">
                <div className="k">MRR assinaturas</div>
                <div className="v">R$ 8.940</div>
                <div className="mut">Car (Plano 4/8/VIP/Frota) + Beauty (pacotes)</div>
                <div className="bar"><i style={{ width: "58%" }} /></div>
                <div className="mut" style={{ marginTop: 6 }}>58% da meta do mês</div>
              </div>
            </div>
          </>
        )}

        {tab === "car" && (
          <>
            <div className="hdr"><div><h1>Bit Car · Pátio</h1><div className="sub">Fila em tempo real — toda OS nasce com checklist e cliente único</div></div>
              <button className="btn" onClick={() => { const id = Date.now()%1000+300; setOs(l=>[...l,{id,placa:"NOVA-000",modelo:"Novo veículo",cliente:"Cliente balcão",servico:"Lavagem Completa",plano:"Avulso",etapa:0}]); log(`OS #${id} criada — checklist de entrada pendente`);}}>+ Nova OS</button></div>
            <div className="cols">
              {ETAPAS.map((et, i) => (
                <div className="col" key={et}>
                  <h4>{et}<span>{os.filter(o=>o.etapa===i).length}</span></h4>
                  {os.filter(o=>o.etapa===i).map(o=>(
                    <div className="os" key={o.id}>
                      <div className="plate">{o.placa}</div>
                      <div className="mut">{o.modelo} · {o.cliente}</div>
                      <div style={{margin:"6px 0"}}><span className={"tag "+(o.plano==="Avulso"?"t-mut":"t-org")}>{o.plano}</span></div>
                      <div className="mut">{o.servico}</div>
                      <div style={{marginTop:9}}>
                        {i<3 ? <button className="btn mini" onClick={()=>avanca(o.id)}>Avançar →</button>
                             : <button className="btn mini" onClick={()=>entrega(o.id)}>Entregar + ₿</button>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "beauty" && (
          <>
            <h1>Bit Beauty · Agenda do dia</h1>
            <div className="sub">Confirmação automática ataca o no-show · termo obrigatório antes do atendimento</div>
            <div className="card">
              {ag.map(a=>(
                <div className="row" key={a.id}>
                  <div style={{width:52,fontFamily:"'Space Grotesk'",fontWeight:600}}>{a.hora}</div>
                  <div style={{flex:1}}>
                    <div className="name">{a.cliente}</div>
                    <div className="mut">{a.proc} · {a.prof}</div>
                  </div>
                  <span className={"tag "+(a.pacote.startsWith("₿")?"t-org":a.pacote==="Avulso"?"t-mut":"t-blu")}>{a.pacote}</span>
                  <span className={"tag "+(a.status==="CONFIRMADO"?"t-grn":"t-red")}>{a.status==="CONFIRMADO"?"Confirmado":"Aguardando"}</span>
                  {a.status==="PENDENTE"
                    ? <button className="btn mini ghost" onClick={()=>confirma(a.id)}>Confirmar</button>
                    : <button className="btn mini" onClick={()=>realiza(a.id)}>Realizar</button>}
                </div>
              ))}
              {ag.length===0 && <div className="mut" style={{padding:"16px 0"}}>Agenda concluída. Amanhã: 6 atendimentos, 2 aguardando confirmação.</div>}
            </div>
          </>
        )}

        {tab === "salas" && (
          <>
            <h1>Locações · 6 salas</h1>
            <div className="sub">Piso de receita do complexo — cobrança e reajuste sob controle do sistema</div>
            <div className="salas">
              {salas.map(s=>(
                <div className="card" key={s.n}>
                  <div className="hdr">
                    <div><div className="k">Sala {s.n}</div>
                    <div className="name" style={{marginTop:4}}>{s.inquilino ?? "Disponível"}</div></div>
                    <span className={"tag "+(s.status==="OCUPADA"?"t-grn":"t-org")}>{s.status==="OCUPADA"?"Ocupada":"Vaga"}</span>
                  </div>
                  {s.status==="OCUPADA" ? (
                    <>
                      <div className="mut" style={{margin:"6px 0"}}>{brl(s.aluguel)}/mês · venc. dia {s.venc?.split("/")[0]}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                        {s.parceiroB && <span className="tag t-org">Parceiro ₿</span>}
                        {s.pago
                          ? <span className="tag t-grn">Julho pago</span>
                          : <><span className="tag t-red">Em aberto</span><button className="btn mini" onClick={()=>baixaAluguel(s.n)}>Dar baixa</button></>}
                      </div>
                    </>
                  ) : (
                    <div className="mut" style={{marginTop:6}}>Pretendido: {brl(s.aluguel)}/mês · funil: 2 interessados<br/>Argumento: fluxo Car/Beauty + programa ₿</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "cli" && (
          <>
            <h1>Clientes · base única do grupo</h1>
            <div className="sub">Um cadastro, um saldo ₿, duas operações — o coração da tese do complexo</div>
            <div className="card">
              {clientes.map(c=>(
                <div className="row" key={c.id}>
                  <div style={{flex:1}}>
                    <div className="name">{c.nome}</div>
                    <div className="mut">{c.tel} · origem: {c.origem}</div>
                  </div>
                  <span className={"tag "+(c.car?"t-blu":"t-mut")}>Car</span>
                  <span className={"tag "+(c.beauty?"t-blu":"t-mut")}>Beauty</span>
                  <span className="bal"><span className="bcoin">₿</span>{c.saldo}</span>
                  {!(c.car&&c.beauty) && <span className="tag t-org">Elegível cross</span>}
                  {c.car&&c.beauty && <span className="tag t-grn">Cliente cross ✓</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
