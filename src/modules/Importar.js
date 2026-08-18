import { useState } from "react";
import { Card, Btn, Tag } from "../erp/ui";
import { brl, num } from "../erp/format";
import { linhasDeCSV } from "../erp/importador";

export default function Importar({ erp }) {
  const { previewImportacao, importarHistorico } = erp;
  const [linhas, setLinhas] = useState(null);
  const [nomeArq, setNomeArq] = useState("");
  const [agrupar, setAgrupar] = useState(false);
  const [zerar, setZerar] = useState(true);
  const [erro, setErro] = useState("");
  const [feito, setFeito] = useState(null);

  const abrir = (file) => {
    setErro(""); setFeito(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const ls = linhasDeCSV(String(reader.result));
        if (!ls.length) { setErro("Não encontrei linhas de venda no arquivo. Confira se é o CSV certo."); setLinhas(null); return; }
        setLinhas(ls); setNomeArq(file.name);
      } catch (e) { setErro("Erro ao ler o arquivo: " + e.message); }
    };
    reader.readAsText(file, "utf-8");
  };

  const resumo = linhas ? previewImportacao(linhas, { agruparGenericos: agrupar }).resumo : null;
  const consumo = linhas ? previewImportacao(linhas, { agruparGenericos: agrupar }).consumo : [];

  const confirmar = () => {
    if (!linhas) return;
    const msg = zerar
      ? "Isto vai APAGAR pedidos, clientes e financeiro atuais (mantém o catálogo) e importar o histórico. Continuar?"
      : "Importar o histórico por cima dos dados atuais?";
    if (!window.confirm(msg)) return;
    const r = importarHistorico(linhas, { agruparGenericos: agrupar, zerar });
    setFeito(r); setLinhas(null); setNomeArq("");
  };

  return (
    <>
      <div className="topbar">
        <div><h1>Importar histórico</h1>
          <div className="sub">Suba a planilha de vendas/clientes — confira a prévia e importe tudo de uma vez</div></div>
      </div>

      {feito && (
        <Card style={{ marginBottom: 14, borderColor: "var(--green)" }}>
          <h2>✅ Importação concluída!</h2>
          <div className="mut" style={{ fontSize: 13 }}>
            {feito.nPedidos} pedidos · {feito.nItens} itens · {feito.nClientes} clientes ·
            faturamento <b>{brl(feito.faturamento)}</b> (recebido {brl(feito.recebido)}, a receber {brl(feito.aReceber)}).
            Veja em Pedidos, CRM e Financeiro.
          </div>
        </Card>
      )}

      <Card style={{ marginBottom: 14 }}>
        <h2>1. Escolha o arquivo (.csv)</h2>
        <p className="mut" style={{ fontSize: 12.5, marginBottom: 10 }}>
          Colunas esperadas: DATA VENDA · NOME · TELEFONE · DATA NSC · PAGAMENTO · MEIO DE VENDA · PRODUTO.
        </p>
        <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files[0] && abrir(e.target.files[0])} />
        {nomeArq && <div className="mut" style={{ fontSize: 12, marginTop: 8 }}>📄 {nomeArq} — {linhas ? linhas.length : 0} linhas</div>}
        {erro && <div style={{ marginTop: 10 }}><span className="tag t-red">{erro}</span></div>}
      </Card>

      {resumo && (
        <>
          <Card style={{ marginBottom: 14 }}>
            <h2>2. Opções</h2>
            <label className="chk">
              <input type="checkbox" checked={zerar} onChange={(e) => setZerar(e.target.checked)} />
              <span>Apagar dados de teste antes (pedidos, clientes e financeiro — mantém o catálogo e custos)</span>
            </label>
            <label className="chk">
              <input type="checkbox" checked={agrupar} onChange={(e) => setAgrupar(e.target.checked)} />
              <span>Aplicar desconto por quantidade também em nomes genéricos (Uber / cliente sem dados). Desmarcado, cada venda genérica conta separada (preço cheio).</span>
            </label>
          </Card>

          <div className="grid g4" style={{ marginBottom: 14 }}>
            <KPIm ic="🧾" label="Pedidos" v={resumo.nPedidos} sub={`${resumo.nItens} itens`} />
            <KPIm ic="👥" label="Clientes" v={resumo.nClientes} sub="serão cadastrados" />
            <KPIm ic="💰" label="Faturamento" v={brl(resumo.faturamento)} sub={`receb. ${brl(resumo.recebido)} · a receber ${brl(resumo.aReceber)}`} />
            <KPIm ic="🥄" label="Custo insumos" v={brl(resumo.custoInsumos)} sub={`lucro bruto ${brl(resumo.lucroBruto)}`} />
          </div>

          <div className="grid g2" style={{ marginBottom: 14 }}>
            <Card>
              <h2>Consumo de insumos (backflush)</h2>
              <p className="mut" style={{ fontSize: 12, marginBottom: 8 }}>
                O que essas vendas consumiram — vira uma “Compra p/ produção” de {brl(resumo.custoInsumos)} no financeiro.
              </p>
              {consumo.map((c) => (
                <div className="row" key={c.id}>
                  <div style={{ flex: 1 }}><div className="name" style={{ fontSize: 12.5 }}>{c.nome}</div></div>
                  <span className="mut" style={{ fontSize: 12 }}>{num(c.qtd)} {c.un}</span>
                  <span className="num" style={{ fontWeight: 600, marginLeft: 10 }}>{brl(c.custo)}</span>
                </div>
              ))}
            </Card>
            <Card>
              <h2>Conferência</h2>
              <div className="mut" style={{ fontSize: 13, lineHeight: 1.7 }}>
                📅 Período: <b>{resumo.periodo ? `${fmt(resumo.periodo[0])} a ${fmt(resumo.periodo[1])}` : "—"}</b><br />
                🧾 {resumo.nPedidos} pedidos, {resumo.nItens} pudins<br />
                💰 Faturamento: <b>{brl(resumo.faturamento)}</b><br />
                🟢 Recebido: {brl(resumo.recebido)} · 🔵 A receber: {brl(resumo.aReceber)}<br />
                🥄 Custo de produção: {brl(resumo.custoInsumos)}<br />
                📈 Lucro bruto: <b>{brl(resumo.lucroBruto)}</b>
              </div>
              {resumo.avisos.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {resumo.avisos.map((a, i) => <div key={i} style={{ marginBottom: 4 }}><Tag cls="t-org">{a}</Tag></div>)}
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <Btn onClick={confirmar}>✅ Importar {resumo.nPedidos} pedidos</Btn>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

function KPIm({ ic, label, v, sub }) {
  return (
    <Card>
      <div style={{ fontSize: 22 }}>{ic}</div>
      <div className="mut" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", marginTop: 4 }}>{label}</div>
      <div className="num" style={{ fontSize: 22, fontWeight: 800, margin: "2px 0" }}>{v}</div>
      <div className="mut" style={{ fontSize: 11 }}>{sub}</div>
    </Card>
  );
}

const fmt = (iso) => { const [a, m, d] = (iso || "").split("-"); return d ? `${d}/${m}/${a}` : iso; };
