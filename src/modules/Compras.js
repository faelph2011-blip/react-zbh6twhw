import { useState } from "react";
import { Card, Tag, Btn, Modal, Empty } from "../erp/ui";
import { brl } from "../erp/format";

const hojeISO = () => new Date().toISOString().slice(0, 10);

export default function Compras({ erp }) {
  const { db } = erp;
  const [modal, setModal] = useState(false); // false | true | insumoId

  const compras = db.financeiro.filter((l) => l.origem === "Compras");
  const totalInvestido = compras.reduce((t, l) => t + l.valor, 0);
  const abaixoMin = db.insumos.filter((i) => i.estoque < i.min);

  return (
    <>
      <div className="topbar">
        <div><h1>Compras & Investimentos</h1>
          <div className="sub">Registre cada compra que gera custo, com data — controle total do que foi investido</div></div>
        <Btn onClick={() => setModal(true)}>+ Registrar compra</Btn>
      </div>

      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card><div className="k">Total investido</div><div className="v" style={{ fontSize: 22 }}>{brl(totalInvestido)}</div></Card>
        <Card><div className="k">Compras registradas</div><div className="v" style={{ fontSize: 22 }}>{compras.length}</div></Card>
        <Card><div className="k">Insumos p/ repor</div><div className="v" style={{ fontSize: 22 }}>{abaixoMin.length}</div></Card>
        <Card><div className="k">Itens no catálogo</div><div className="v" style={{ fontSize: 22 }}>{db.insumos.length}</div></Card>
      </div>

      <div className="grid g2">
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Histórico de compras</h2><Tag cls="t-mut">{compras.length}</Tag></div>
          {compras.length === 0 && <Empty>Nenhuma compra registrada. Clique em “+ Registrar compra”. 🛒</Empty>}
          {compras.map((l) => (
            <div className="row" key={l.id}>
              <div className="thumb" style={{ background: "var(--elev)", width: 34, height: 34, fontSize: 16 }}>🛒</div>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 13 }}>{l.desc.replace("Compra: ", "")}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>📅 {l.venc === "hoje" ? "hoje" : (l.data || l.venc)}</div>
              </div>
              <span className="num" style={{ fontWeight: 700, color: "var(--red)" }}>{brl(l.valor)}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h2>Sugestão de reposição</h2>
          <div className="mut" style={{ fontSize: 12, marginBottom: 8 }}>Insumos com estoque abaixo do mínimo.</div>
          {abaixoMin.length === 0 && <div className="mut">Estoque saudável — nada a comprar. 🎉</div>}
          {abaixoMin.map((i) => (
            <div className="row" key={i.id}>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 13.5 }}>{i.nome}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>tem {i.estoque} {i.un} · mín {i.min} {i.un}</div>
              </div>
              <Btn variant="mini soft" onClick={() => setModal(i.id)}>Comprar</Btn>
            </div>
          ))}
        </Card>
      </div>

      {modal && <CompraModal erp={erp} preId={typeof modal === "string" ? modal : null} onClose={() => setModal(false)} />}
    </>
  );
}

function CompraModal({ erp, preId, onClose }) {
  const { db, registrarCompra } = erp;
  const [tipo, setTipo] = useState("insumo"); // insumo | outros
  const [insumoId, setInsumoId] = useState(preId || db.insumos[0]?.id || "");
  const [nomeManual, setNomeManual] = useState("");
  const [qtd, setQtd] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hojeISO());
  const [erro, setErro] = useState("");

  const item = db.insumos.find((i) => i.id === insumoId);

  const salvar = () => {
    if (tipo === "outros" && !nomeManual.trim()) { setErro("Descreva o que foi comprado."); return; }
    if (!valor || Number(valor) <= 0) { setErro("Informe o valor total pago."); return; }
    registrarCompra({
      insumoId: tipo === "insumo" ? insumoId : null,
      nomeManual: tipo === "outros" ? nomeManual : null,
      qtd: qtd ? Number(qtd) : 0,
      custoTotal: Number(valor),
      data,
    });
    onClose();
  };

  return (
    <Modal title="🛒 Registrar compra" onClose={onClose}>
      <div className="field">
        <label>O que você comprou?</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className={"qs-chip " + (tipo === "insumo" ? "on" : "")} onClick={() => setTipo("insumo")}>Insumo do catálogo</button>
          <button className={"qs-chip " + (tipo === "outros" ? "on" : "")} onClick={() => setTipo("outros")}>Outros (manual)</button>
        </div>
      </div>

      {tipo === "insumo" ? (
        <>
          <div className="field"><label>Insumo</label>
            <select value={insumoId} onChange={(e) => setInsumoId(e.target.value)}>
              {db.insumos.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
            </select></div>
          <div className="field"><label>Quantidade {item ? `(${item.un})` : ""} — entra no estoque</label>
            <input type="number" min="0" step="any" value={qtd} placeholder="ex: 10"
              onChange={(e) => setQtd(e.target.value)} /></div>
        </>
      ) : (
        <div className="field"><label>Descrição</label>
          <input value={nomeManual} autoFocus placeholder="ex: Gás, gasolina, aluguel, utensílio..."
            onChange={(e) => { setNomeManual(e.target.value); setErro(""); }} /></div>
      )}

      <div className="field"><label>Valor total pago (R$)</label>
        <input type="number" min="0" step="any" value={valor} placeholder="ex: 69.90"
          onChange={(e) => { setValor(e.target.value); setErro(""); }} /></div>
      <div className="field"><label>Data da compra</label>
        <input type="date" value={data} max={hojeISO()} onChange={(e) => setData(e.target.value || hojeISO())} /></div>

      {erro && <div style={{ marginBottom: 12 }}><span className="tag t-red">{erro}</span></div>}
      <Btn onClick={salvar}>Registrar compra</Btn>
    </Modal>
  );
}
