import { useState } from "react";
import { Card, Tag, Bar, Btn, Modal } from "../erp/ui";
import { brl } from "../erp/format";

export default function Estoque({ erp, go }) {
  const { db } = erp;
  const [prod, setProd] = useState(false); // false | true | produtoId

  // Curva ABC por valor imobilizado (estoque × custo)
  const comValor = db.insumos.map((i) => ({ ...i, valor: i.estoque * i.custo }))
    .sort((a, b) => b.valor - a.valor);
  const totalValor = comValor.reduce((t, i) => t + i.valor, 0) || 1;
  let acc = 0;
  const abc = comValor.map((i) => {
    acc += i.valor;
    const p = acc / totalValor;
    return { ...i, curva: p <= 0.7 ? "A" : p <= 0.9 ? "B" : "C" };
  });

  return (
    <>
      <div className="topbar">
        <div><h1>Controle de Estoque</h1>
          <div className="sub">Matéria-prima, embalagens e produtos acabados · mínimos, curva ABC e alertas</div></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="pill">💵 {brl(totalValor)} imobilizado</div>
          <Btn onClick={() => setProd(true)}>🍮 Registrar produção</Btn>
        </div>
      </div>

      <div className="grid g2">
        <Card>
          <div className="hdr"><h2 style={{ margin: 0 }}>Insumos & embalagens</h2><Tag cls="t-org">Curva ABC</Tag></div>
          <div className="scroll-x">
            <table>
              <thead><tr><th>Item</th><th>Estoque</th><th>Nível</th><th>ABC</th></tr></thead>
              <tbody>
                {abc.map((i) => {
                  const low = i.estoque < i.min;
                  return (
                    <tr key={i.id}>
                      <td><div className="name" style={{ fontSize: 13 }}>{i.nome}</div>
                        <div className="mut" style={{ fontSize: 11 }}>{i.cat} · {brl(i.custo)}/{i.un}</div></td>
                      <td className="num">{i.estoque} {i.un}<div className="mut" style={{ fontSize: 11 }}>mín {i.min}</div></td>
                      <td style={{ minWidth: 90 }}><Bar value={i.estoque} max={i.max} />
                        {low && <span className="tag t-red" style={{ marginTop: 6 }}>repor</span>}</td>
                      <td><Tag cls={i.curva === "A" ? "t-org" : i.curva === "B" ? "t-blu" : "t-mut"}>{i.curva}</Tag></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div className="hdr"><h2 style={{ margin: 0 }}>Pudins prontos</h2><Tag cls="t-mut">estoque acabado</Tag></div>
            {db.produtos.map((p) => (
              <div className="row" key={p.id}>
                <span className="thumb" style={{ background: p.grad, width: 34, height: 34, fontSize: 18 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13 }}>{p.nome}</div>
                  <div className="mut" style={{ fontSize: 11 }}>validade {p.validade} dias</div></div>
                <Tag cls={p.estoque <= 3 ? "t-red" : p.estoque <= 8 ? "t-org" : "t-grn"}>{p.estoque} prontos</Tag>
                <button className="btn soft mini" onClick={() => setProd(p.id)}>+ Produzir</button>
              </div>
            ))}
          </Card>
          <Card>
            <h2>Reposição sugerida</h2>
            {abc.filter((i) => i.estoque < i.min).length === 0 && <div className="mut">Nenhum insumo abaixo do mínimo. 🎉</div>}
            {abc.filter((i) => i.estoque < i.min).map((i) => (
              <div className="feed-item" key={i.id}>
                <b>{i.nome}</b> — comprar ~{Math.ceil(i.max - i.estoque)} {i.un}
              </div>
            ))}
            <button className="btn soft mini" style={{ marginTop: 12 }} onClick={() => go("compras")}>Gerar pedido de compra →</button>
          </Card>
        </div>
      </div>

      {prod && <ProducaoModal erp={erp} preId={typeof prod === "string" ? prod : null} onClose={() => setProd(false)} />}
    </>
  );
}

function ProducaoModal({ erp, preId, onClose }) {
  const { db, produzir, custoProduto } = erp;
  const [pid, setPid] = useState(preId || db.produtos[0]?.id || "");
  const [qtd, setQtd] = useState(9);
  const p = db.produtos.find((x) => x.id === pid);
  const n = Number(qtd) || 0;

  const salvar = () => { if (n > 0) { produzir(pid, n); onClose(); } };

  return (
    <Modal title="🍮 Registrar produção" onClose={onClose}>
      <p className="mut" style={{ marginBottom: 14, fontSize: 13 }}>
        Adiciona pudins prontos ao estoque e <b>baixa os insumos da receita</b> automaticamente.
      </p>
      <div className="field"><label>Produto</label>
        <select value={pid} onChange={(e) => setPid(e.target.value)}>
          {db.produtos.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select></div>
      <div className="field"><label>Quantidade produzida (un)</label>
        <input type="number" min="1" value={qtd} onChange={(e) => setQtd(e.target.value)} /></div>
      {p && <div className="pill" style={{ marginBottom: 14 }}>Custo desta produção: <b>{brl(custoProduto(p) * n)}</b> · {p.estoque} → {p.estoque + n} prontos</div>}
      <Btn onClick={salvar}>Adicionar ao estoque pronto</Btn>
    </Modal>
  );
}
