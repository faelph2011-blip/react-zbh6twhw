// ============================================================
// PudimERP — ERP SaaS para produção e venda de pudins
// Duas camadas:
//  · LOJA pública (tela principal) — qualquer visitante
//  · ÁREA DO DONO (ERP completo) — protegida por login de administrador
// Todos os módulos operam sobre um único núcleo de domínio (store.js).
// ============================================================
import { useEffect, useState } from "react";
import { css } from "./erp/theme";
import { useERP, useKPIs } from "./erp/store";
import { Modal, Btn } from "./erp/ui";

import Loja from "./modules/Loja";
import VendaRapida from "./modules/VendaRapida";
import Dashboard from "./modules/Dashboard";
import Produtos from "./modules/Produtos";
import Engenharia from "./modules/Engenharia";
import Producao from "./modules/Producao";
import Estoque from "./modules/Estoque";
import Compras from "./modules/Compras";
import Financeiro from "./modules/Financeiro";
import CRM from "./modules/CRM";
import Pedidos from "./modules/Pedidos";
import Delivery from "./modules/Delivery";
import IA from "./modules/IA";

const PIN_DEMO = "1234"; // protótipo: em produção seria login real (JWT + 2FA)

const NAV = [
  ["Operação", [
    ["venda", "Venda Rápida", "⚡"],
    ["pedidos", "Pedidos", "🧾"],
    ["producao", "Produção · PCP", "🏭"],
  ]],
  ["Gestão", [
    ["dash", "Dashboard", "📊"],
    ["estoque", "Estoque", "📦"],
    ["compras", "Compras", "🛒"],
  ]],
  ["Catálogo", [
    ["produtos", "Produtos", "🍮"],
    ["engenharia", "Engenharia", "⚗️"],
  ]],
  ["Comercial", [
    ["crm", "CRM & Fidelidade", "👥"],
    ["delivery", "Delivery", "🛵"],
  ]],
  ["Inteligência", [
    ["financeiro", "Financeiro", "💰"],
    ["ia", "IA & BI", "🤖"],
  ]],
];

export default function App() {
  const erp = useERP();
  const k = useKPIs(erp);
  const [view, setView] = useState("loja"); // "loja" | "admin"
  const [authed, setAuthed] = useState(() => localStorage.getItem("pudimerp_auth") === "1");
  const [showLogin, setShowLogin] = useState(false);
  const [tab, setTab] = useState("venda");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", erp.theme);
  }, [erp.theme]);

  const irParaAdmin = () => (authed ? setView("admin") : setShowLogin(true));
  const login = () => {
    setAuthed(true);
    localStorage.setItem("pudimerp_auth", "1");
    setShowLogin(false);
    setTab("venda");
    setView("admin");
  };
  const logout = () => {
    setAuthed(false);
    localStorage.removeItem("pudimerp_auth");
    setView("loja");
  };

  // ---------- LOJA PÚBLICA (tela principal) ----------
  if (view !== "admin" || !authed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <style>{css}</style>
        <Loja erp={erp} onAdmin={irParaAdmin} full />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={login} />}
      </div>
    );
  }

  // ---------- ÁREA DO DONO (ERP) ----------
  const pendencias = k.novos + erp.db.ordens.filter((o) => o.status !== "Pronto").length;
  const props = { erp, k, go: setTab };
  const MOD = {
    venda: <VendaRapida {...props} />,
    pedidos: <Pedidos {...props} />,
    producao: <Producao {...props} />,
    dash: <Dashboard {...props} />,
    estoque: <Estoque {...props} />,
    compras: <Compras {...props} />,
    produtos: <Produtos {...props} />,
    engenharia: <Engenharia {...props} />,
    crm: <CRM {...props} />,
    delivery: <Delivery {...props} />,
    financeiro: <Financeiro {...props} />,
    ia: <IA {...props} />,
  };

  return (
    <div className="app">
      <style>{css}</style>
      <aside className="side">
        <div className="brand">
          <span className="logo-dot">🍮</span>
          <span className="txt">PudimERP<small>área do dono · admin</small></span>
        </div>
        {NAV.map(([grupo, items]) => (
          <div key={grupo}>
            <div className="navgroup">{grupo}</div>
            {items.map(([key, label, ic]) => (
              <button key={key} className={"nav " + (tab === key ? "on" : "")} onClick={() => setTab(key)}>
                <span className="ic">{ic}</span>
                <span className="lbl">{label}</span>
                {key === "pedidos" && pendencias > 0 && <span className="badge">{pendencias}</span>}
              </button>
            ))}
          </div>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <button className="nav" onClick={() => setView("loja")}>
            <span className="ic">🌐</span><span className="lbl">Ver loja</span>
          </button>
          <button className="nav" onClick={erp.toggleTheme}>
            <span className="ic">{erp.theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="lbl">{erp.theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
          </button>
          <button className="nav" onClick={() => { if (window.confirm("Restaurar dados de demonstração?")) erp.resetar(); }}>
            <span className="ic">↺</span><span className="lbl">Resetar dados</span>
          </button>
          <button className="nav" onClick={logout}>
            <span className="ic">⎋</span><span className="lbl">Sair</span>
          </button>
        </div>
      </aside>

      <main className="main">{MOD[tab]}</main>
    </div>
  );
}

// ---------- Login do administrador (protótipo) ----------
function LoginModal({ onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState(false);
  const entrar = () => (pin === PIN_DEMO ? onSuccess() : setErro(true));
  return (
    <Modal title="🔒 Área do dono" onClose={onClose}>
      <p className="mut" style={{ marginBottom: 14, fontSize: 13 }}>
        Acesso restrito ao administrador do negócio. O dashboard e todo o fluxo de gestão ficam aqui.
      </p>
      <div className="field">
        <label>PIN de administrador</label>
        <input type="password" autoFocus value={pin} placeholder="••••"
          onChange={(e) => { setPin(e.target.value); setErro(false); }}
          onKeyDown={(e) => e.key === "Enter" && entrar()} />
      </div>
      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">PIN incorreto — tente novamente</span></div>}
      <Btn onClick={entrar} className="">Entrar no painel</Btn>
      <div className="mut" style={{ fontSize: 11.5, marginTop: 12 }}>
        PIN de demonstração: <b>{PIN_DEMO}</b> · em produção: login com e-mail, senha e 2FA (LGPD).
      </div>
    </Modal>
  );
}
