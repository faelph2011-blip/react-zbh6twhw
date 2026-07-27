import { Card, Tag, Btn, Empty } from "../erp/ui";

const COLS = ["Fila", "Produzindo", "Pronto"];

export default function Producao({ erp }) {
  const { db, avancarOrdem } = erp;
  const emProd = db.ordens.filter((o) => o.status === "Produzindo").length;
  const totalUn = db.ordens.reduce((t, o) => t + o.qtd, 0);

  return (
    <>
      <div className="topbar">
        <div><h1>Controle de Produção · PCP</h1>
          <div className="sub">Ordens de produção com rastreabilidade por lote — concluir baixa insumos e gera estoque</div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="pill">🏭 {emProd} em execução</div>
          <div className="pill">📦 {totalUn} un planejadas</div>
        </div>
      </div>

      <div className="kanban">
        {COLS.map((col) => {
          const items = db.ordens.filter((o) => o.status === col);
          return (
            <div className="col" key={col}>
              <h4>{col}<span className="tag t-mut">{items.length}</span></h4>
              {items.length === 0 && <Empty>Vazio</Empty>}
              {items.map((o) => {
                const p = db.produtos.find((x) => x.id === o.produtoId);
                return (
                  <div className="chip" key={o.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="lote">{o.lote}</span>
                      <Tag cls="t-blu">#{o.id}</Tag>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
                      <span className="thumb" style={{ background: p?.grad, width: 32, height: 32, fontSize: 18 }}>{p?.emoji}</span>
                      <div><div className="name" style={{ fontSize: 13 }}>{o.qtd}× {p?.nome}</div>
                        <div className="mut" style={{ fontSize: 11.5 }}>~{p?.tempo} min · {o.pedidoId ? `pedido #${o.pedidoId}` : "estoque"}</div></div>
                    </div>
                    {col !== "Pronto" ? (
                      <Btn variant="mini" onClick={() => avancarOrdem(o.id)}>
                        {col === "Fila" ? "Iniciar produção →" : "Concluir + estoque"}
                      </Btn>
                    ) : <Tag cls="t-grn">✓ finalizado · rastreável</Tag>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <Card style={{ marginTop: 16 }}>
        <h2>Eficiência & perdas (simulado)</h2>
        <div className="grid g4">
          <Mini k="Eficiência produtiva" v="94%" tag="meta 90%" cls="t-grn" />
          <Mini k="Perdas / desperdício" v="2.1%" tag="dentro do alvo" cls="t-org" />
          <Mini k="Tempo médio / lote" v="88 min" tag="-6 min vs. mês" cls="t-blu" />
          <Mini k="OEE" v="87%" tag="ótimo" cls="t-grn" />
        </div>
      </Card>
    </>
  );
}

const Mini = ({ k, v, tag, cls }) => (
  <div>
    <div className="k">{k}</div>
    <div className="v" style={{ fontSize: 22 }}>{v}</div>
    <Tag cls={cls}>{tag}</Tag>
  </div>
);
