import { useState } from "react";
import { Card, Tag } from "../erp/ui";
import { brl, pct } from "../erp/format";

export default function Engenharia({ erp }) {
  const { db, custoProduto, margemProduto, precoVenda } = erp;
  const [sel, setSel] = useState(db.produtos[0].id);
  const p = db.produtos.find((x) => x.id === sel);
  const custo = custoProduto(p);
  const pv = precoVenda(p);

  return (
    <>
      <div className="topbar">
        <div><h1>Engenharia do Produto</h1>
          <div className="sub">Ficha técnica com custo calculado automaticamente por receita, unidade e fatia</div></div>
        <select value={sel} onChange={(e) => setSel(e.target.value)} style={{ maxWidth: 260 }}>
          {db.produtos.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
      </div>

      <div className="grid g3">
        <Card style={{ gridColumn: "span 2" }}>
          <div className="hdr">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="thumb" style={{ background: p.grad, width: 52, height: 52, fontSize: 28 }}>{p.emoji}</div>
              <div><h2 style={{ margin: 0 }}>{p.nome}</h2><div className="mut">{p.sku} · rende {p.rendimento} fatias · {p.tempo} min</div></div>
            </div>
          </div>
          <div className="scroll-x">
            <table>
              <thead><tr><th>Insumo</th><th>Qtd</th><th>Custo unit.</th><th style={{ textAlign: "right" }}>Custo</th></tr></thead>
              <tbody>
                {p.ficha.map((item) => {
                  const ins = db.insumos.find((i) => i.id === item.id);
                  if (!ins) return null;
                  const c = ins.custo * item.qtd;
                  return (
                    <tr key={item.id}>
                      <td>{ins.nome} <span className="mut">· {ins.cat}</span></td>
                      <td className="num">{item.qtd} {ins.un}</td>
                      <td className="num mut">{brl(ins.custo)}</td>
                      <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{brl(c)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr><td colSpan={3} style={{ fontWeight: 600 }}>Custo total da receita</td>
                  <td className="num" style={{ textAlign: "right", fontWeight: 700, color: "var(--brand)" }}>{brl(custo)}</td></tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div className="k">Preço de venda</div>
            <div className="v">{brl(pv)}</div>
            {p.promo && <Tag cls="t-red">promo · de {brl(p.preco)}</Tag>}
          </Card>
          <Card>
            <div className="k">Rentabilidade</div>
            <Metric label="Custo unitário (pote)" v={brl(custo)} />
            <Metric label="Custo por fatia" v={brl(custo / p.rendimento)} />
            <Metric label="Preço por fatia" v={brl(pv / p.rendimento)} />
            <Metric label="Lucro por unidade" v={brl(pv - custo)} cls="t-grn" />
            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mut">Margem</span>
              <Tag cls={margemProduto(p) > 0.5 ? "t-grn" : "t-org"} >{pct(margemProduto(p))}</Tag>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const Metric = ({ label, v, cls }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}>
    <span className="mut">{label}</span>
    <span className={"num " + (cls ? "tag " + cls : "")} style={cls ? { background: "transparent", padding: 0, fontWeight: 700 } : { fontWeight: 600 }}>{v}</span>
  </div>
);
