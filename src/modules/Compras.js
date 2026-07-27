import { useState } from "react";
import { Card, Tag, Btn, Modal } from "../erp/ui";
import { brl } from "../erp/format";

export default function Compras({ erp }) {
  const { db, receberCompra } = erp;
  const [modal, setModal] = useState(false);

  return (
    <>
      <div className="topbar">
        <div><h1>Compras & Fornecedores</h1>
          <div className="sub">Pedidos de compra, recebimento, prazo médio e ranking de fornecedores</div></div>
        <Btn onClick={() => setModal(true)}>+ Registrar recebimento</Btn>
      </div>

      <div className="grid g2">
        <Card>
          <h2>Fornecedores · ranking</h2>
          {[...db.fornecedores].sort((a, b) => b.nota - a.nota).map((f) => (
            <div className="row" key={f.id}>
              <div className="avatar">{f.nome[0]}</div>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13.5 }}>{f.nome}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>{f.cat} · prazo médio {f.prazo} dias</div></div>
              <Tag cls={f.nota >= 4.7 ? "t-grn" : "t-org"}>⭐ {f.nota}</Tag>
            </div>
          ))}
        </Card>

        <Card>
          <h2>Sugestão de compra (insumos abaixo do mínimo)</h2>
          {db.insumos.filter((i) => i.estoque < i.min).length === 0 && <div className="mut">Estoque saudável — nada a comprar.</div>}
          {db.insumos.filter((i) => i.estoque < i.min).map((i) => {
            const qtd = Math.ceil(i.max - i.estoque);
            const forn = db.fornecedores.find((f) => f.cat === i.cat);
            return (
              <div className="row" key={i.id}>
                <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13.5 }}>{i.nome}</div>
                  <div className="mut" style={{ fontSize: 11.5 }}>{qtd} {i.un} · ~{brl(qtd * i.custo)} · {forn?.nome || "—"}</div></div>
                <Btn variant="mini" onClick={() => receberCompra(i.id, qtd, +(qtd * i.custo).toFixed(2), forn?.nome || "Fornecedor")}>Receber</Btn>
              </div>
            );
          })}
        </Card>
      </div>

      {modal && <ReceberModal erp={erp} onClose={() => setModal(false)} />}
    </>
  );
}

function ReceberModal({ erp, onClose }) {
  const { db, receberCompra } = erp;
  const [ins, setIns] = useState(db.insumos[0].id);
  const [qtd, setQtd] = useState(10);
  const item = db.insumos.find((i) => i.id === ins);
  const forn = db.fornecedores.find((f) => f.cat === item.cat);
  const total = +(qtd * item.custo).toFixed(2);

  return (
    <Modal title="Registrar recebimento de compra" onClose={onClose}>
      <div className="field"><label>Insumo</label>
        <select value={ins} onChange={(e) => setIns(e.target.value)}>
          {db.insumos.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
        </select></div>
      <div className="field"><label>Quantidade ({item.un})</label>
        <input type="number" value={qtd} min={1} onChange={(e) => setQtd(+e.target.value)} /></div>
      <div className="pill" style={{ marginBottom: 14 }}>Custo estimado: <b>{brl(total)}</b> · {forn?.nome}</div>
      <Btn onClick={() => { receberCompra(ins, qtd, total, forn?.nome || "Fornecedor"); onClose(); }}>
        Confirmar recebimento
      </Btn>
    </Modal>
  );
}
