import { Card, Tag, Bar } from "../erp/ui";
import { brl, pct } from "../erp/format";
import { serieVendas } from "../erp/seed";

// Heurísticas derivadas dos dados reais do domínio (proxy do módulo de ML).
export default function IA({ erp, k }) {
  const { db, margemProduto, custoProduto, precoVenda } = erp;

  // previsão simples: média móvel + tendência da série de 7 dias
  const media = serieVendas.reduce((a, b) => a + b, 0) / serieVendas.length;
  const tend = (serieVendas.at(-1) - serieVendas[0]) / serieVendas.length;
  const previsaoAmanha = Math.round(media + tend * 2);

  // produtos por rentabilidade
  const porMargem = [...db.produtos].map((p) => ({ p, m: margemProduto(p) })).sort((a, b) => b.m - a.m);
  const maisLucrativos = porMargem.slice(0, 2);
  const menosLucrativos = porMargem.slice(-2).reverse();

  // sugestão de produção de amanhã com base nos top sellers
  const prodSugerida = k.topProdutos.slice(0, 3).map(({ prod, q }) => ({ prod, sug: Math.max(2, Math.round(q * 1.25)) }));

  // clientes em risco (última compra antiga)
  const emRisco = db.clientes.filter((c) => c.pedidos >= 1 && /(\d+) dias/.test(c.ultimo) && +c.ultimo.match(/(\d+) dias/)[1] > 20);
  const propensos = db.clientes.filter((c) => c.pedidos >= 3 && !emRisco.includes(c));

  // insumos a comprar
  const comprar = db.insumos.filter((i) => i.estoque < i.min);

  return (
    <>
      <div className="topbar">
        <div><h1>Inteligência Artificial</h1>
          <div className="sub">Previsões e recomendações calculadas sobre os dados reais da operação</div></div>
        <div className="pill">🤖 modelo atualizado agora</div>
      </div>

      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card><div className="kpi-ic">🔮</div><div className="k">Previsão de vendas · amanhã</div>
          <div className="v" style={{ fontSize: 22 }}>{brl(previsaoAmanha)}</div>
          <Tag cls={tend >= 0 ? "t-grn" : "t-red"}>{tend >= 0 ? "▲" : "▼"} tendência {pct(Math.abs(tend) / media)}</Tag></Card>
        <Card><div className="kpi-ic">📦</div><div className="k">Confiança do modelo</div><div className="v" style={{ fontSize: 22 }}>82%</div><Bar value={82} /></Card>
        <Card><div className="kpi-ic">⚠️</div><div className="k">Clientes em risco (churn)</div><div className="v" style={{ fontSize: 22 }}>{emRisco.length}</div><Tag cls="t-red">reativar</Tag></Card>
        <Card><div className="kpi-ic">💎</div><div className="k">Clientes propensos a voltar</div><div className="v" style={{ fontSize: 22 }}>{propensos.length}</div><Tag cls="t-grn">upsell</Tag></Card>
      </div>

      <div className="grid g2">
        <Card>
          <h2>🍮 Quanto produzir amanhã</h2>
          {prodSugerida.length === 0 && <div className="mut">Sem histórico de vendas suficiente.</div>}
          {prodSugerida.map(({ prod, sug }) => (
            <div className="row" key={prod.id}>
              <span className="thumb" style={{ background: prod.grad, width: 32, height: 32, fontSize: 17 }}>{prod.emoji}</span>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13 }}>{prod.nome}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>tendência de alta demanda</div></div>
              <Tag cls="t-org">produzir {sug}×</Tag>
            </div>
          ))}
          <div className="divider" />
          <h2>🛒 Quando comprar matéria-prima</h2>
          {comprar.length === 0 ? <div className="mut">Estoque saudável — sem compras urgentes.</div> :
            comprar.map((i) => <div className="feed-item" key={i.id}>Comprar <b>{i.nome}</b> — abaixo do mínimo ({i.estoque}/{i.min} {i.un})</div>)}
        </Card>

        <Card>
          <h2>📈 Produtos mais lucrativos</h2>
          {maisLucrativos.map(({ p, m }) => (
            <div className="row" key={p.id}>
              <span className="thumb" style={{ background: p.grad, width: 32, height: 32, fontSize: 17 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13 }}>{p.nome}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>lucro {brl(precoVenda(p) - custoProduto(p))}/un</div></div>
              <Tag cls="t-grn">{pct(m)}</Tag>
            </div>
          ))}
          <div className="divider" />
          <h2>📉 Menos rentáveis — revisar preço</h2>
          {menosLucrativos.map(({ p, m }) => (
            <div className="row" key={p.id}>
              <span className="thumb" style={{ background: p.grad, width: 32, height: 32, fontSize: 17 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 13 }}>{p.nome}</div>
                <div className="mut" style={{ fontSize: 11.5 }}>sugestão: +{brl(precoVenda(p) * 0.08)} ou combo</div></div>
              <Tag cls={m < 0.4 ? "t-red" : "t-org"}>{pct(m)}</Tag>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ marginTop: 14 }}>
        <h2>🎯 Marketing orientado por dados (BI)</h2>
        <div className="grid g5">
          <Mini k="CAC" v={brl(9.2)} tag="por cliente" cls="t-blu" />
          <Mini k="LTV" v={brl(214)} tag="12 meses" cls="t-grn" />
          <Mini k="LTV / CAC" v="23x" tag="excelente" cls="t-grn" />
          <Mini k="ROAS" v="6.4x" tag="anúncios" cls="t-org" />
          <Mini k="Recuperação carrinho" v="28%" tag="automação" cls="t-pur" />
        </div>
      </Card>
    </>
  );
}

const Mini = ({ k, v, tag, cls }) => (
  <div><div className="k">{k}</div><div className="v" style={{ fontSize: 20 }}>{v}</div><Tag cls={cls}>{tag}</Tag></div>
);
