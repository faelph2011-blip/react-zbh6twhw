import { Card, Tag, Btn, Empty } from "../erp/ui";
import { brl } from "../erp/format";

export default function Delivery({ erp }) {
  const { db, totalPedido, despacharEntrega, entregarPedido } = erp;
  const rotas = db.pedidos.filter((p) => p.canal === "Delivery" && p.status !== "Entregue" && p.status !== "Cancelado");

  return (
    <>
      <div className="topbar">
        <div><h1>Delivery & Logística</h1>
          <div className="sub">Entregadores, rotas, taxa e tempo estimado</div></div>
        <div className="pill">🛵 {db.entregadores.filter((e) => e.status === "Em rota").length} em rota</div>
      </div>

      <div className="grid g2">
        <Card>
          <h2>Entregadores</h2>
          {db.entregadores.map((e) => (
            <div className="row" key={e.id}>
              <div className="avatar">{e.nome[0]}</div>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13.5 }}>{e.nome}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>{e.veiculo} · {e.entregas} entregas hoje</div></div>
              <Tag cls={e.status === "Em rota" ? "t-org" : "t-grn"}>{e.status}</Tag>
            </div>
          ))}
          <div className="divider" />
          <div className="grid g3">
            <Mini k="Taxa média" v={brl(7.5)} />
            <Mini k="Tempo médio" v="34 min" />
            <Mini k="Raio" v="8 km" />
          </div>
        </Card>

        <Card>
          <h2>Rotas ativas</h2>
          {rotas.length === 0 && <Empty>Nenhuma entrega pendente.</Empty>}
          {rotas.map((p) => {
            const cli = db.clientes.find((c) => c.id === p.clienteId);
            const ent = db.entregadores.find((e) => e.id === p.entregadorId);
            return (
              <div className="chip" key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="name" style={{ fontSize: 13.5 }}>#{p.id} · {cli?.nome}</span>
                  <span className="num">{brl(totalPedido(p))}</span>
                </div>
                <div className="mut" style={{ fontSize: 11.5, margin: "4px 0 10px" }}>
                  {p.obs || "Entrega padrão"} · {ent ? `🛵 ${ent.nome}` : "sem entregador"}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!p.entregadorId && db.entregadores.filter((e) => e.status === "Disponível").map((e) => (
                    <Btn key={e.id} variant="mini soft" onClick={() => despacharEntrega(p.id, e.id)}>Despachar {e.nome.split(" ")[0]}</Btn>
                  ))}
                  {p.entregadorId && <Btn variant="mini" onClick={() => entregarPedido(p.id)}>Confirmar entrega</Btn>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}

const Mini = ({ k, v }) => (<div><div className="k">{k}</div><div className="v" style={{ fontSize: 18 }}>{v}</div></div>);
