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
import { Brand } from "./erp/Emblem";

import Loja from "./modules/Loja";
import VendaRapida from "./modules/VendaRapida";
import Dashboard from "./modules/Dashboard";
import Produtos from "./modules/Produtos";
import Engenharia from "./modules/Engenharia";
import Producao from "./modules/Producao";
import Estoque from "./modules/Estoque";
import Compras from "./modules/Compras";
import Importar from "./modules/Importar";
import Financeiro from "./modules/Financeiro";
import CRM from "./modules/CRM";
import Pedidos from "./modules/Pedidos";
import Delivery from "./modules/Delivery";
import IA from "./modules/IA";

const PIN_DEMO = "1234"; // protótipo: em produção seria login real (JWT + 2FA)

const NAV = [
  ["Operação", [
    ["venda", "Venda Rápida", "⚡"],
    ["crm", "CRM & Fidelidade", "👥"],
    ["pedidos", "Pedidos", "🧾"],
    ["producao", "Produção · PCP", "🏭"],
  ]],
  ["Gestão", [
    ["dash", "Dashboard", "📊"],
    ["estoque", "Estoque", "📦"],
    ["compras", "Compras", "🛒"],
    ["importar", "Importar histórico", "🗂️"],
  ]],
  ["Catálogo", [
    ["produtos", "Produtos", "🍮"],
    ["engenharia", "Engenharia", "⚗️"],
  ]],
  ["Comercial", [
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
  const cloudOn = erp.cloud.enabled;
  const [view, setView] = useState("loja"); // "loja" | "admin"
  const [pinAuthed, setPinAuthed] = useState(() => localStorage.getItem("pudimerp_auth") === "1");
  const [showLogin, setShowLogin] = useState(false);
  const [tab, setTab] = useState("venda");

  // Com a nuvem ligada, o acesso vem do login real (sessão Supabase);
  // sem nuvem, mantém o PIN local de protótipo.
  const authed = cloudOn ? !!erp.cloud.user : pinAuthed;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", erp.theme);
  }, [erp.theme]);

  // Acesso do dono por URL secreta (#dono ou #admin) — sem botão visível ao cliente.
  useEffect(() => {
    const abrir = () => {
      const h = window.location.hash.toLowerCase();
      if (h === "#dono" || h === "#admin") {
        if (cloudOn ? !!erp.cloud.user : pinAuthed) setView("admin");
        else setShowLogin(true);
      }
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => window.removeEventListener("hashchange", abrir);
  }, [cloudOn, erp.cloud.user, pinAuthed]);

  const login = () => {
    if (!cloudOn) {
      setPinAuthed(true);
      localStorage.setItem("pudimerp_auth", "1");
    }
    setShowLogin(false);
    setTab("venda");
    setView("admin");
  };
  const logout = async () => {
    if (cloudOn) {
      await erp.cloud.sair();
    } else {
      setPinAuthed(false);
      localStorage.removeItem("pudimerp_auth");
    }
    setView("loja");
  };

  // ---------- LOJA PÚBLICA (tela principal) ----------
  if (view !== "admin" || !authed) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent" }}>
        <style>{css}</style>
        <Loja erp={erp} full />
        {showLogin && <LoginModal cloud={erp.cloud} onClose={() => setShowLogin(false)} onSuccess={login} />}
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
    importar: <Importar {...props} />,
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
          <Brand size={38} />
          <span className="txt"><span className="script" style={{ fontSize: 19 }}>Pudins da Lauren</span><small>painel do dono · admin</small></span>
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
          {cloudOn && <CloudStatus cloud={erp.cloud} />}
          <button className="nav" onClick={() => setView("loja")}>
            <span className="ic">🌐</span><span className="lbl">Ver loja</span>
          </button>
          <button className="nav" onClick={erp.toggleTheme}>
            <span className="ic">{erp.theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="lbl">{erp.theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
          </button>
          <button className="nav" onClick={() => { if (window.confirm("Limpar os pedidos e clientes de EXEMPLO para começar a jornada real? (mantém produtos, custos e estoque)")) erp.limparExemplos(); }}>
            <span className="ic">🧹</span><span className="lbl">Limpar exemplos</span>
          </button>
          <button className="nav" onClick={() => { if (window.confirm("Restaurar TODOS os dados de demonstração (produtos, clientes, pedidos)?")) erp.resetar(); }}>
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

// ---------- Login do administrador ----------
// Com a nuvem ligada → login real (e-mail + senha, Supabase).
// Sem nuvem → PIN de protótipo (comportamento antigo preservado).
function LoginModal({ cloud, onClose, onSuccess }) {
  if (cloud && cloud.enabled) return <CloudLogin cloud={cloud} onClose={onClose} onSuccess={onSuccess} />;
  return <PinLogin onClose={onClose} onSuccess={onSuccess} />;
}

function PinLogin({ onClose, onSuccess }) {
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
        PIN de demonstração: <b>{PIN_DEMO}</b> · nuvem desligada (dados só neste aparelho).
      </div>
    </Modal>
  );
}

function CloudLogin({ cloud, onClose, onSuccess }) {
  const [modo, setModo] = useState("entrar"); // "entrar" | "criar"
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);

  const submeter = async () => {
    if (carregando) return;
    setErro(""); setMsg("");
    if (!email.trim() || !senha) { setErro("Preencha e-mail e senha."); return; }
    setCarregando(true);
    const fn = modo === "entrar" ? cloud.entrar : cloud.criarConta;
    const r = await fn(email, senha);
    setCarregando(false);
    if (!r.ok) { setErro(r.erro); return; }
    if (modo === "criar" && r.precisaConfirmar) {
      setMsg("Conta criada! Confirme pelo link enviado ao seu e-mail e depois faça login.");
      setModo("entrar");
      return;
    }
    onSuccess();
  };

  return (
    <Modal title="🔒 Área do dono" onClose={onClose}>
      <p className="mut" style={{ marginBottom: 14, fontSize: 13 }}>
        {modo === "entrar"
          ? "Entre com seu e-mail e senha. Seus dados ficam salvos na nuvem — acesse de qualquer aparelho. ☁️"
          : "Crie sua conta de dono. Depois é só entrar de qualquer celular ou PC com os mesmos dados. ☁️"}
      </p>
      <div className="field">
        <label>E-mail</label>
        <input type="email" autoFocus value={email} placeholder="voce@email.com"
          onChange={(e) => { setEmail(e.target.value); setErro(""); }}
          onKeyDown={(e) => e.key === "Enter" && submeter()} />
      </div>
      <div className="field">
        <label>Senha</label>
        <input type="password" value={senha} placeholder="••••••"
          onChange={(e) => { setSenha(e.target.value); setErro(""); }}
          onKeyDown={(e) => e.key === "Enter" && submeter()} />
      </div>
      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">{erro}</span></div>}
      {msg && <div style={{ marginBottom: 12 }}><span className="tag t-green">{msg}</span></div>}
      <Btn onClick={submeter} className="">
        {carregando ? "Aguarde…" : modo === "entrar" ? "Entrar no painel" : "Criar conta"}
      </Btn>
      <div className="mut" style={{ fontSize: 12, marginTop: 12 }}>
        {modo === "entrar" ? (
          <>Ainda não tem conta?{" "}
            <button className="linklike" onClick={() => { setModo("criar"); setErro(""); setMsg(""); }}>Criar conta</button>
          </>
        ) : (
          <>Já tem conta?{" "}
            <button className="linklike" onClick={() => { setModo("entrar"); setErro(""); setMsg(""); }}>Fazer login</button>
          </>
        )}
      </div>
    </Modal>
  );
}

// Indicador de sincronização na barra lateral (só com nuvem ligada).
function CloudStatus({ cloud }) {
  let ic = "☁️", txt = "Nuvem conectada";
  if (cloud.syncing) { ic = "🔄"; txt = "Sincronizando…"; }
  else if (cloud.error) { ic = "⚠️"; txt = "Erro ao sincronizar"; }
  else if (cloud.lastSync) { ic = "✅"; txt = "Salvo na nuvem"; }
  return (
    <div className="mut" style={{ fontSize: 11.5, padding: "6px 12px", lineHeight: 1.5 }}>
      <div>{ic} {txt}</div>
      {cloud.email && <div style={{ opacity: 0.7 }}>{cloud.email}</div>}
    </div>
  );
}
