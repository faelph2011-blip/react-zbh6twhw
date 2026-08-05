import { Card, Tag, Btn, Empty } from "../erp/ui";
import { brl, pct } from "../erp/format";

// Condições do iFood (Pudins da Lauren)
const IFOOD = { pedido: 0.12, online: 0.032, mensalidade: 150, faturaMin: 1800 };
const RAIOS = [
  { label: "até 3 km", taxa: 3.99 },
  { label: "3 a 5 km", taxa: 5.99 },
  { label: "5 a 7 km", taxa: 7.99 },
  { label: "acima 7 km", taxa: 9.99 },
];
// Embalagem de entrega por tamanho de produto (só no delivery)
const EMB = { ind: "emb_peq", med: "emb_med", gra: "emb_gra" };

export default function Delivery({ erp }) {
  const { db, totalPedido, custoProduto, precoVenda, despacharEntrega, entregarPedido } = erp;

  const embCusto = (p) => { const e = db.insumos.find((i) => i.id === EMB[p.id]); return e ? e.custo : 0; };
  // custo total no delivery = produto + embalagem de entrega
  const custoDelivery = (p) => custoProduto(p) + embCusto(p);

  // lucro líquido de 1 unidade no iFood, para um valor de taxa de entrega
  const liquido = (p, taxaEntrega) => {
    const preco = precoVenda(p);
    const taxasIfood = preco * (IFOOD.pedido + IFOOD.online);
    const lucro = preco - taxasIfood - taxaEntrega - custoDelivery(p);
    return { preco, lucro, margem: preco ? lucro / preco : 0 };
  };

  // faturamento delivery (para saber se paga a mensalidade)
  const fatDelivery = db.pedidos
    .filter((p) => p.canal === "Delivery" && p.status !== "Cancelado")
    .reduce((t, p) => t + totalPedido(p), 0);
  const pagaMensalidade = fatDelivery > IFOOD.faturaMin;

  const rotas = db.pedidos.filter((p) => p.canal === "Delivery" && p.status !== "Entregue" && p.status !== "Cancelado");

  return (
    <>
      <div className="topbar">
        <div><h1>Delivery & Margem (iFood)</h1>
          <div className="sub">Quanto sobra em cada venda pelo iFood, já descontadas as taxas e a embalagem de entrega</div></div>
        <div className="pill">🛵 Faturamento delivery: {brl(fatDelivery)}</div>
      </div>

      {/* Condições do iFood */}
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card><div className="k">Taxa por pedido</div><div className="v" style={{ fontSize: 22 }}>12%</div></Card>
        <Card><div className="k">Taxa pagamento online</div><div className="v" style={{ fontSize: 22 }}>3,2%</div></Card>
        <Card><div className="k">Taxa de entrega</div><div className="v" style={{ fontSize: 16 }}>R$3,99 a R$9,99</div><Tag cls="t-mut">por raio</Tag></Card>
        <Card>
          <div className="k">Mensalidade (&gt; {brl(IFOOD.faturaMin)})</div>
          <div className="v" style={{ fontSize: 22 }}>{brl(IFOOD.mensalidade)}</div>
          <Tag cls={pagaMensalidade ? "t-org" : "t-grn"}>{pagaMensalidade ? "cobrando este mês" : "isento por enquanto"}</Tag>
        </Card>
      </div>

      {/* Tabela de margem por produto x raio */}
      <Card style={{ marginBottom: 14 }}>
        <div className="hdr"><h2 style={{ margin: 0 }}>Lucro líquido por venda no iFood</h2>
          <Tag cls="t-mut">preço − 15,2% de taxas − entrega − custo</Tag></div>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th style={{ textAlign: "right" }}>Preço</th>
                <th style={{ textAlign: "right" }}>Custo*</th>
                {RAIOS.map((r) => <th key={r.label} style={{ textAlign: "right" }}>{r.label}<div className="mut" style={{ fontSize: 10, fontWeight: 400 }}>entrega {brl(r.taxa)}</div></th>)}
              </tr>
            </thead>
            <tbody>
              {db.produtos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="thumb" style={{ background: p.grad, width: 28, height: 28, fontSize: 15 }}>{p.emoji}</span>
                      <span className="name" style={{ fontSize: 13 }}>{p.nome.replace("Pudim ", "")}</span>
                    </div>
                  </td>
                  <td className="num" style={{ textAlign: "right" }}>{brl(precoVenda(p))}</td>
                  <td className="num mut" style={{ textAlign: "right" }}>{brl(custoDelivery(p))}</td>
                  {RAIOS.map((r) => {
                    const m = liquido(p, r.taxa);
                    const pos = m.lucro >= 0;
                    return (
                      <td key={r.label} className="num" style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: pos ? "var(--grn, #1a9d5a)" : "var(--red)" }}>{brl(m.lucro)}</div>
                        <div className="mut" style={{ fontSize: 10.5 }}>{pct(m.margem)}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mut" style={{ fontSize: 11.5, marginTop: 10 }}>
          *Custo = ingredientes + gás + pote + adesivo + <b>embalagem de entrega</b>. Valores em <span style={{ color: "var(--red)" }}>vermelho</span> = prejuízo (nesse raio, essa venda dá negativo — evite ou ajuste o preço/entrega). A mensalidade de {brl(IFOOD.mensalidade)} só é cobrada em meses com faturamento acima de {brl(IFOOD.faturaMin)}.
        </div>
      </Card>

      {/* Rotas reais de delivery */}
      <Card>
        <div className="hdr"><h2 style={{ margin: 0 }}>Entregas pendentes</h2>
          <Tag cls="t-mut">{rotas.length}</Tag></div>
        {rotas.length === 0 && <Empty>Nenhuma entrega pendente. Pedidos do canal Delivery aparecem aqui.</Empty>}
        {rotas.map((p) => {
          const cli = db.clientes.find((c) => c.id === p.clienteId);
          const ent = db.entregadores.find((e) => e.id === p.entregadorId);
          return (
            <div className="chip" key={p.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="name" style={{ fontSize: 13.5 }}>#{p.id} · {cli?.nome || "avulso"}</span>
                <span className="num">{brl(totalPedido(p))}</span>
              </div>
              <div className="mut" style={{ fontSize: 11.5, margin: "4px 0 10px" }}>
                {p.obs || "Entrega padrão"} · {ent ? `🛵 ${ent.nome}` : "sem entregador"}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!p.entregadorId && db.entregadores.filter((e) => e.status === "Disponível").map((e) => (
                  <Btn key={e.id} variant="mini soft" onClick={() => despacharEntrega(p.id, e.id)}>Despachar {e.nome.split(" ")[0]}</Btn>
                ))}
                <Btn variant="mini" onClick={() => entregarPedido(p.id)}>Confirmar entrega</Btn>
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}
