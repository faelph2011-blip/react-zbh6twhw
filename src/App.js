// ============================================================
// PudimERP — ERP SaaS para produção e venda de pudins
// Protótipo funcional integrado (frontend / camada de apresentação)
// Todos os módulos operam sobre um único núcleo de domínio (store.js),
// então uma ação em um módulo repercute em todos os outros.
// ============================================================
import { useEffect, useState } from "react";
import { css } from "./erp/theme";
import { useERP, useKPIs } from "./erp/store";

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
import Loja from "./modules/Loja";

const NAV = [
  ["Gestão", [
    ["dash", "Dashboard", "📊"],
    ["pedidos", "Pedidos", "🧾"],
    ["producao", "Produção · PCP", "🏭"],
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
    ["loja", "Loja Virtual", "🌐"],
  ]],
  ["Inteligência", [
    ["financeiro", "Financeiro", "💰"],
    ["ia", "IA & BI", "🤖"],
  ]],
];

export default function App() {
  const erp = useERP();
  const k = useKPIs(erp);
  const [tab, setTab] = useState("dash");
  const go = (t) => setTab(t);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", erp.theme);
  }, [erp.theme]);

  const pendencias = k.novos + erp.db.ordens.filter((o) => o.status !== "Pronto").length;

  const props = { erp, k, go };
  const MOD = {
    dash: <Dashboard {...props} />,
    pedidos: <Pedidos {...props} />,
    producao: <Producao {...props} />,
    estoque: <Estoque {...props} />,
    compras: <Compras {...props} />,
    produtos: <Produtos {...props} />,
    engenharia: <Engenharia {...props} />,
    crm: <CRM {...props} />,
    delivery: <Delivery {...props} />,
    loja: <Loja {...props} />,
    financeiro: <Financeiro {...props} />,
    ia: <IA {...props} />,
  };

  return (
    <div className="app">
      <style>{css}</style>
      <aside className="side">
        <div className="brand">
          <span className="logo-dot">🍮</span>
          <span className="txt">PudimERP<small>gestão · produção · vendas</small></span>
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
          <button className="nav" onClick={erp.toggleTheme}>
            <span className="ic">{erp.theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="lbl">{erp.theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
          </button>
          <button className="nav" onClick={() => { if (window.confirm("Restaurar dados de demonstração?")) erp.resetar(); }}>
            <span className="ic">↺</span><span className="lbl">Resetar dados</span>
          </button>
        </div>
      </aside>

      <main className="main">{MOD[tab]}</main>
    </div>
  );
}
