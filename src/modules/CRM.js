import { Card, Tag } from "../erp/ui";
import { brl, classificar } from "../erp/format";

export default function CRM({ erp }) {
  const { db } = erp;
  const clientes = [...db.clientes].sort((a, b) => b.gasto - a.gasto);
  const totalCashback = db.clientes.reduce((t, c) => t + c.cashback, 0);
  const recorrentes = db.clientes.filter((c) => c.pedidos >= 2).length;

  return (
    <>
      <div className="topbar">
        <div><h1>CRM & Fidelidade</h1>
          <div className="sub">Base única de clientes · RFM, cashback, pontos e programa de fidelidade</div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="pill">👥 {db.clientes.length} clientes</div>
          <div className="pill">🎁 {brl(totalCashback)} em cashback</div>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card><div className="k">Recorrentes</div><div className="v">{recorrentes}</div><Tag cls="t-grn">{Math.round(recorrentes / db.clientes.length * 100)}% da base</Tag></Card>
        <Card><div className="k">Ticket médio base</div><div className="v" style={{ fontSize: 22 }}>{brl(db.clientes.reduce((t, c) => t + c.gasto, 0) / Math.max(1, db.clientes.filter(c => c.pedidos).length))}</div></Card>
        <Card><div className="k">Aniversariantes 30d</div><div className="v">2</div><Tag cls="t-org">campanha ativa</Tag></Card>
        <Card><div className="k">Pontos emitidos</div><div className="v" style={{ fontSize: 22 }}>{db.clientes.reduce((t, c) => t + c.pontos, 0)}</div><Tag cls="t-pur">fidelidade</Tag></Card>
      </div>

      <Card>
        <div className="scroll-x">
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
        </div>
      </Card>
    </>
  );
}
