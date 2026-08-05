import { useState } from "react";
import { Card, Tag, Btn, Modal, Empty } from "../erp/ui";
import { brl, classificar } from "../erp/format";

export default function CRM({ erp }) {
  const { db } = erp;
  const [novo, setNovo] = useState(false);
  const clientes = [...db.clientes].sort((a, b) => b.gasto - a.gasto);
  const totalCashback = db.clientes.reduce((t, c) => t + c.cashback, 0);
  const recorrentes = db.clientes.filter((c) => c.pedidos >= 2).length;
  const nBase = db.clientes.length;

  return (
    <>
      <div className="topbar">
        <div><h1>CRM & Fidelidade</h1>
          <div className="sub">Base única de clientes · RFM, cashback, pontos e programa de fidelidade</div></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="pill">👥 {nBase} clientes</div>
          <div className="pill">🎁 {brl(totalCashback)} em cashback</div>
          <Btn onClick={() => setNovo(true)}>+ Novo cliente</Btn>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card><div className="k">Recorrentes</div><div className="v">{recorrentes}</div><Tag cls="t-grn">{nBase ? Math.round(recorrentes / nBase * 100) : 0}% da base</Tag></Card>
        <Card><div className="k">Ticket médio base</div><div className="v" style={{ fontSize: 22 }}>{brl(db.clientes.reduce((t, c) => t + c.gasto, 0) / Math.max(1, db.clientes.filter(c => c.pedidos).length))}</div></Card>
        <Card><div className="k">Aniversariantes 30d</div><div className="v">2</div><Tag cls="t-org">campanha ativa</Tag></Card>
        <Card><div className="k">Pontos emitidos</div><div className="v" style={{ fontSize: 22 }}>{db.clientes.reduce((t, c) => t + c.pontos, 0)}</div><Tag cls="t-pur">fidelidade</Tag></Card>
      </div>

      <Card>
        {nBase === 0 && <Empty>Nenhum cliente cadastrado ainda. Clique em “+ Novo cliente” para começar. 👥</Empty>}
        {nBase > 0 && <div className="scroll-x">
          <table>
            <thead><tr><th>Cliente</th><th>Contato</th><th>Origem</th><th>Pedidos</th><th>Gasto</th><th>Cashback</th><th>Classe</th></tr></thead>
            <tbody>
              {clientes.map((c) => {
                const cl = classificar(c.pedidos, c.gasto);
                return (
                  <tr key={c.id}>
                    <td><div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>{c.nome[0]}</div>
                      <div><div className="name" style={{ fontSize: 13 }}>{c.nome}</div>
                        <div className="mut" style={{ fontSize: 11 }}>🎂 {c.aniv} · últ. {c.ultimo}</div></div>
                    </div></td>
                    <td className="mut" style={{ fontSize: 12 }}>{c.tel}{c.wpp && <Tag cls="t-grn" >wpp</Tag>}</td>
                    <td><Tag cls="t-mut">{c.origem}</Tag></td>
                    <td className="num">{c.pedidos}</td>
                    <td className="num">{brl(c.gasto)}</td>
                    <td className="num" style={{ color: "var(--brand)" }}>{brl(c.cashback)}</td>
                    <td><Tag cls={cl.cls}>{cl.label}</Tag></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}
      </Card>

      {novo && <NovoCliente erp={erp} onClose={() => setNovo(false)} />}
    </>
  );
}

function NovoCliente({ erp, onClose }) {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [wpp, setWpp] = useState(true);
  const [aniv, setAniv] = useState("");
  const [origem, setOrigem] = useState("WhatsApp");
  const [erro, setErro] = useState("");

  const salvar = () => {
    if (!nome.trim()) { setErro("Informe o nome do cliente."); return; }
    erp.criarCliente({ nome, tel, wpp, aniv, origem });
    onClose();
  };

  return (
    <Modal title="👥 Novo cliente" onClose={onClose}>
      <div className="field"><label>Nome *</label>
        <input autoFocus value={nome} placeholder="Ex: Maria Silva"
          onChange={(e) => { setNome(e.target.value); setErro(""); }} /></div>
      <div className="field"><label>Telefone / WhatsApp</label>
        <input value={tel} placeholder="(34) 9 9999-9999" onChange={(e) => setTel(e.target.value)} /></div>
      <div className="field">
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={wpp} onChange={(e) => setWpp(e.target.checked)} style={{ width: "auto" }} />
          Tem WhatsApp
        </label>
      </div>
      <div className="field"><label>Aniversário (dia/mês)</label>
        <input value={aniv} placeholder="Ex: 12/08" onChange={(e) => setAniv(e.target.value)} /></div>
      <div className="field"><label>Como conheceu (origem)</label>
        <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
          {["WhatsApp", "Instagram", "Indicação", "Google", "Fachada", "iFood", "Cadastro"].map((o) => <option key={o}>{o}</option>)}
        </select></div>
      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">{erro}</span></div>}
      <Btn onClick={salvar}>Cadastrar cliente</Btn>
    </Modal>
  );
}
