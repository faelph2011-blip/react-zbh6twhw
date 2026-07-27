import { useState } from "react";
import { Card, Tag, Btn } from "../erp/ui";
import { brl, pct } from "../erp/format";

export default function Produtos({ erp, go }) {
  const { db, custoProduto, margemProduto, precoVenda } = erp;
  const [q, setQ] = useState("");
  const list = db.produtos.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="topbar">
        <div><h1>Cadastro de Produtos</h1>
          <div className="sub">Catálogo com custo, margem, SKU, validade e ficha técnica</div></div>
        <input placeholder="Buscar produto…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 240 }} />
      </div>

      <div className="grid g4">
        {list.map((p) => {
          const custo = custoProduto(p);
          const m = margemProduto(p);
          const low = p.estoque <= 3;
          return (
            <Card key={p.id} style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 96, background: p.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, position: "relative" }}>
                {p.emoji}
                {p.promo && <span className="tag t-red" style={{ position: "absolute", top: 10, left: 10 }}>PROMO</span>}
                <span className="tag t-mut" style={{ position: "absolute", top: 10, right: 10 }}>{p.cat}</span>
              </div>
              <div style={{ padding: 15 }}>
                <div className="name" style={{ fontSize: 14 }}>{p.nome}</div>
                <div className="mut" style={{ fontSize: 11.5, marginBottom: 10 }}>{p.sku} · {p.rendimento} fatias · val. {p.validade}d</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    {p.promo && <span className="mut" style={{ textDecoration: "line-through", fontSize: 12, marginRight: 6 }}>{brl(p.preco)}</span>}
                    <span className="num" style={{ fontSize: 18, fontWeight: 700, color: "var(--brand)" }}>{brl(precoVenda(p))}</span>
                  </div>
                  <Tag cls={m > 0.55 ? "t-grn" : m > 0.35 ? "t-org" : "t-red"}>{pct(m)}</Tag>
                </div>
                <div className="mut" style={{ fontSize: 11.5, marginTop: 6 }}>Custo {brl(custo)} · lucro {brl(precoVenda(p) - custo)}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                  <Tag cls={low ? "t-red" : "t-grn"}>{p.estoque} em estoque</Tag>
                  <Btn variant="soft mini" onClick={() => go("engenharia")} className="">Ficha técnica</Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
