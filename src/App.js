import React, { useState } from "react";
 
// ─── PALETA BIT CAR ──────────────────────────────────────────────────────────
import { useState } from "react";
 
const C = {
  bg:       "#0a0a0a",
  surface:  "#111111",
  card:     "#161616",
  elevated: "#1e1e1e",
  orange:   "#f7931a",
  orangeHi: "#ffaa3d",
  orangeDim:"#c4720d",
  text:     "#f0f0f0",
  muted:    "#888888",
  subtle:   "#444444",
  border:   "#272727",
  borderHi: "#3a3a3a",
  green:    "#22c55e",
  red:      "#ef4444",
  yellow:   "#eab308",
  blue:     "#3b82f6",
};
 
const hexBg = `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://w3.org d='M28 66L0 50V18L28 2l28 16v32L28 66zm0-18L8 36V22l20-12 20 12v14L28 48z' fill='%23f7931a' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
function SH({ n, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 900, color: "#000",
          background: `linear-gradient(135deg, ${C.orange}, ${C.orangeHi})`,
          boxShadow: `0 0 20px ${C.orange}55`,
        }}>{String(n).padStart(2,"0")}</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>{title}</div>
          {sub && <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <div style={{ height: 2, background: `linear-gradient(to right, ${C.orange}, transparent)`, marginTop: 18, borderRadius: 1 }} />
    </div>
  );
}
 
function Card({ title, color, children, style = {} }) {
  const cc = color || C.orange;
  return (
    <div style={{
      background: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
      borderTop: `2px solid ${cc}`, padding: 20, marginBottom: 18,
      boxShadow: `0 4px 24px rgba(0,0,0,0.5)`,
      ...style,
    }}>
      {title && <div style={{
        fontSize: 11, fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.1em", color: cc, marginBottom: 14,
      }}>{title}</div>}
      {children}
    </div>
  );
}
 
function MRow({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 12, marginBottom: 18 }}>
      {items.map((it, i) => (
        <div key={i} style={{
          background: C.card, borderRadius: 10, border: `1px solid ${C.border}`,
          padding: 14, textAlign: "center",
          borderBottom: `2px solid ${it.color || C.orange}`,
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{it.label}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: it.color || C.orange, letterSpacing: "-0.02em" }}>{it.value}</div>
          {it.sub && <div style={{ fontSize: 10, color: C.subtle, marginTop: 3 }}>{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}
 
function T({ headers, rows, total }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>{headers.map((h,i) => (
            <th key={i} style={{
              background: "#0d0d0d", color: C.orange, padding: "9px 12px",
              textAlign: i===0?"left":"right", fontWeight: 800, fontSize: 10,
              textTransform: "uppercase", letterSpacing: "0.08em",
              borderBottom: `1px solid ${C.border}`,
            }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((row,i) => (
            <tr key={i} style={{ background: i%2===0 ? C.card : "#121212" }}>
              {row.map((cell,j) => (
                <td key={j} style={{
                  padding: "8px 12px", textAlign: j===0?"left":"right",
                  color: C.text, borderBottom: `1px solid ${C.border}`, fontSize: 12,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
          {total && (
            <tr style={{ background: "#0d0d0d" }}>
              {total.map((cell,j) => (
                <td key={j} style={{
                  padding: "10px 12px", textAlign: j===0?"left":"right",
                  color: C.orange, fontWeight: 900, fontSize: 12,
                  borderTop: `1px solid ${C.border}`,
                }}>{cell}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
 
function Alert({ type="info", children }) {
  const cfg = {
    info:    { bg:"#1a1f2e", border:C.blue,   icon:"ℹ️" },
    success: { bg:"#0f1f14", border:C.green,  icon:"✅" },
    warning: { bg:"#1f1800", border:C.orange, icon:"⚡" },
    danger:  { bg:"#1f0f0f", border:C.red,    icon:"🔴" },
  }[type];
  return (
    <div style={{
      background: cfg.bg, borderLeft: `3px solid ${cfg.border}`,
      borderRadius: "0 8px 8px 0", padding: "12px 14px",
      marginBottom: 14, fontSize: 12, color: C.text, lineHeight: 1.7,
    }}>
      <span style={{ marginRight: 8 }}>{cfg.icon}</span>{children}
    </div>
  );
}
 
function Badge({ text, color }) {
  const cc = color || C.orange;
  return (
    <span style={{
      display: "inline-block", background: cc+"22", color: cc,
      padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      border: `1px solid ${cc}44`,
    }}>{text}</span>
  );
}

// ─── COMPONENTE PRINCIPAL EXPORTADO ──────────────────────────────────────────
export default function App() {
  return (
    <div style={{
      backgroundColor: C.bg,
      backgroundImage: hexBg,
      minHeight: "100vh",
      color: C.text,
      padding: "40px 20px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Cabeçalho do Plano */}
        <SH 
          n={1} 
          title="Plano de Negócios: Lava Jato Bit Car" 
          sub="Análise estratégica, projeção de receitas e capacidade operacional." 
        />

        <Alert type="success">
          Estrutura carregada com sucesso. Defina os valores operacionais abaixo para calcular a viabilidade.
        </Alert>

        {/* Resumo Financeiro Rápido */}
        <MRow items={[
          { label: "Faturamento Estimado", value: "R$ 24.500", color: C.green, sub: "Mensal" },
          { label: "Custos Fixos + Var.", value: "R$ 11.200", color: C.red, sub: "Mensal" },
          { label: "Margem de Lucro", value: "54,2%", color: C.blue, sub: "Excelente" }
        ]} />

        {/* Tabela de Serviços */}
        <Card title="Serviços & Projeção de Demanda" color={C.orangeHi}>
          <div style={{ marginBottom: 12 }}>
            <Badge text="Principais Fontes de Receita" color={C.orange} />
          </div>
          <T 
            headers={["Serviço", "Preço Unitário", "Qtd / Mês", "Subtotal"]}
            rows={[
              ["Lavagem Simples", "R$ 50,00", "200", "R$ 10.000,00"],
              ["Lavagem Completa + Cera", "R$ 80,00", "150", "R$ 12.000,00"],
              ["Higienização Interna", "R$ 250,00", "10", "R$ 2.500,00"]
            ]}
            total={["Total Projetado", "", "", "R$ 24.500,00"]}
          />
        </Card>

      </div>
    </div>
  );
}
// ─── S1 ───────────────────────────────────────────────────────────────────────
function S1() {
  return (
    <div>
      <SH n={1} title="Planejamento Financeiro" sub="Investimento, custos fixos, projeções e ponto de equilíbrio" />
      <MRow items={[
        { label:"Investimento Mínimo", value:"R$ 30.000", sub:"Operação básica", color:C.orange },
        { label:"Investimento Ideal", value:"R$ 63.500", sub:"Estrutura completa", color:C.orange },
        { label:"Ponto de Equilíbrio", value:"16 carros/dia", sub:"≈ R$ 16.500/mês", color:C.yellow },
        { label:"Meta de Lucro", value:"R$ 12.700/mês", sub:"Cenário moderado", color:C.green },
      ]} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
        <Card title="Investimento Mínimo — R$ 30.000" color={C.orange}>
          <T headers={["Item","Valor"]} rows={[
            ["Reforma e adequação básica","R$ 8.000"],
            ["Equipamentos essenciais","R$ 7.000"],
            ["Capital de giro (3 meses)","R$ 10.000"],
            ["Marketing inicial","R$ 1.000"],
            ["Registros, licenças, alvará","R$ 2.000"],
            ["Imprevistos (5%)","R$ 2.000"],
          ]} total={["TOTAL MÍNIMO","R$ 30.000"]} />
        </Card>
        <Card title="Investimento Ideal — R$ 63.500" color={C.green}>
          <T headers={["Item","Valor"]} rows={[
            ["Reforma e adequação completa","R$ 18.000"],
            ["Equipamentos profissionais","R$ 15.000"],
            ["Capital de giro (6 meses)","R$ 20.000"],
            ["Marketing inicial + 3 meses","R$ 3.500"],
            ["Registros, licenças, alvará","R$ 2.500"],
            ["Reserva de emergência","R$ 4.500"],
          ]} total={["TOTAL IDEAL","R$ 63.500"]} />
        </Card>
      </div>
 
      <Card title="Custos Fixos Mensais" color={C.yellow}>
        <T headers={["Categoria","Custo/Mês","Observação"]} rows={[
          ["Aluguel","R$ 2.000","Conforme contrato"],
          ["Água (consumo lavagem)","R$ 1.200","~500 m³/mês"],
          ["Energia elétrica","R$ 700","Compressor, aspirador, iluminação"],
          ["2 Funcionários (salário + encargos CLT)","R$ 4.320","R$ 1.600 + ~35% encargos cada"],
          ["Pró-labore do proprietário","R$ 3.000","Ajustável conforme resultado"],
          ["Produtos e insumos","R$ 1.000","Shampoo, cera, microfibras"],
          ["Marketing digital","R$ 500","Google Ads + Instagram Ads"],
          ["Contabilidade","R$ 400","Escritório especializado em ME"],
          ["Internet + linha comercial","R$ 150","Fibra + WhatsApp Business"],
          ["Manutenção de equipamentos","R$ 250","Preventiva mensal"],
          ["EPI + materiais diversos","R$ 200","Uniformes, luvas, botas"],
        ]} total={["TOTAL CUSTOS FIXOS","R$ 13.720","+ 6% impostos s/ faturamento"]} />
        <Alert type="warning">
          <strong>Impostos:</strong> Registre como ME no Simples Nacional. Alíquota ~6% do faturamento bruto. Consulte seu contador sobre ISS municipal de Uberlândia e ISSQN.
        </Alert>
      </Card>
 
      <Card title="Tabela de Serviços e Preços — BIT CAR Uberlândia" color={C.orange}>
        <T headers={["Serviço","Preço Mínimo","Preço Médio UBL","Tempo","Custo Direto","Margem"]} rows={[
          ["Lavagem simples (externa)","R$ 20","R$ 25","20 min","R$ 4","84%"],
          ["Lavagem completa (int + ext)","R$ 50","R$ 60","45 min","R$ 10","83%"],
          ["Lavagem + aspiração + tapetes","R$ 35","R$ 45","35 min","R$ 8","82%"],
          ["Lavagem + cera spray","R$ 55","R$ 70","50 min","R$ 12","83%"],
          ["Lavagem de motor","R$ 70","R$ 90","60 min","R$ 15","83%"],
          ["Higienização interna","R$ 130","R$ 160","90 min","R$ 20","88%"],
          ["Lavagem de moto","R$ 15","R$ 20","15 min","R$ 3","85%"],
        ]} />
      </Card>
 
      <Card title="Cenários de Faturamento e Lucro — 25 dias úteis/mês" color={C.green}>
        <T headers={["Cenário","Carros/Dia","Ticket Médio","Faturamento","Impostos (6%)","Custos Fixos","Lucro Líquido"]} rows={[
          ["🔴 Conservador","15","R$ 40","R$ 15.000","R$ 900","R$ 13.720","R$ 380"],
          ["🟡 Moderado","25","R$ 45","R$ 28.125","R$ 1.688","R$ 13.720","R$ 12.717"],
          ["🟢 Otimista","35","R$ 50","R$ 43.750","R$ 2.625","R$ 13.720","R$ 27.405"],
        ]} total={["META ANO 1 — Moderado","25","R$ 45","R$ 28.125","—","—","R$ 12.717"]} />
      </Card>
 
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Projeção de Rampa — 6 Meses" color={C.orange}>
          <T headers={["Mês","Carros/Dia","Faturamento","Resultado"]} rows={[
            ["Mês 1","10","R$ 10.000","🔴 -R$ 4.620"],
            ["Mês 2","14","R$ 15.750","🟡 +R$ 1.130"],
            ["Mês 3","18","R$ 20.250","🟢 +R$ 5.330"],
            ["Mês 4","22","R$ 24.750","🟢 +R$ 9.555"],
            ["Mês 5","25","R$ 28.125","🟢 +R$ 12.717"],
            ["Mês 6","28","R$ 31.500","🟢 +R$ 15.890"],
          ]} />
        </Card>
        <Card title="Reservas e Capital de Giro" color={C.yellow}>
          <T headers={["Tipo","Valor","Finalidade"]} rows={[
            ["Capital de giro 6 meses","R$ 20.000","Cobrir período de rampa"],
            ["Capital de giro 12 meses","R$ 30.000","Segurança ampliada"],
            ["Reserva de emergência","R$ 5.000","Quebra de equipamento"],
            ["Fundo marketing sazonal","R$ 3.000","Campanhas especiais"],
          ]} />
          <Alert type="success">Com o investimento ideal de R$ 63.500, o capital de giro de 6 meses já está coberto. PE projetado no Mês 2.</Alert>
        </Card>
      </div>
    </div>
  );
}
 
// ─── S2 ───────────────────────────────────────────────────────────────────────
function S2() {
  return (
    <div>
      <SH n={2} title="Estrutura Inicial" sub="Layout 300 m², fluxo operacional e equipe ideal" />
      <MRow items={[
        { label:"Área Total", value:"300 m²", color:C.orange },
        { label:"Boxas de Lavagem", value:"2 boxas", color:C.orange },
        { label:"Capacidade/Dia", value:"35 carros", color:C.yellow, sub:"Meta crescimento" },
        { label:"Equipe Inicial", value:"3 pessoas", color:C.green },
      ]} />
 
      <Card title="Planta Baixa — BIT CAR 300 m²" color={C.orange}>
        <div style={{ fontFamily:"monospace", background:"#050505", color:C.orange,
          padding:20, borderRadius:8, fontSize:12, lineHeight:1.6, overflowX:"auto",
          border:`1px solid ${C.border}`, boxShadow:`inset 0 0 40px rgba(247,147,26,0.05)` }}>
          <pre>{`
┌──────────────────────────────────────────────────────────────┐
│              ⬆  ENTRADA PRINCIPAL (RAMPA)  ⬆                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │   ₿ BOIA 1       │  │   ₿ BOIA 2       │  CIRCULAÇÃO      │
│  │   LAVAGEM        │  │   LAVAGEM        │  VEÍCULOS        │
│  │   (30 m²)        │  │   (30 m²)        │  (80 m²)         │
│  │  piso industrial │  │  piso industrial │                  │
│  └──────────────────┘  └──────────────────┘                  │
│                                                              │
│  ┌─────────────────────────────────────────────┐             │
│  │     ÁREA DE SECAGEM COBERTA (40 m²)         │             │
│  │     Cobertura metálica + LED laranja        │             │
│  └─────────────────────────────────────────────┘             │
│                                                              │
│  ┌───────────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  RECEPÇÃO     │  │  SALA    │  │  ÁREA VIP de ESPERA  │  │
│  │  + CAIXA      │  │  ADMIN   │  │  (20 m²)             │  │
│  │  (18 m²)      │  │  (12 m²) │  │  Cadeiras + TV + Wi-Fi│  │
│  └───────────────┘  └──────────┘  └──────────────────────┘  │
│                                                              │
│  ┌──────────────────┐   ┌──────────────────────────────┐     │
│  │  DEPÓSITO        │   │  SANITÁRIO (6 m²)            │     │
│  │  PRODUTOS (12m²) │   │  Clientes + Funcionários     │     │
│  └──────────────────┘   └──────────────────────────────┘     │
│        ÁREA TÉCNICA / CANALETAS / FUTURO EXPANSÃO (42 m²)   │
└──────────────────────────────────────────────────────────────┘`}</pre>
        </div>
      </Card>
 
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
        <Card title="Distribuição dos 300 m²" color={C.orange}>
          <T headers={["Setor","Área","%"]} rows={[
            ["2 boxas de lavagem","60 m²","20%"],
            ["Área de secagem (coberta)","40 m²","13%"],
            ["Circulação e manobra","80 m²","27%"],
            ["Recepção e caixa","18 m²","6%"],
            ["Sala administrativa","12 m²","4%"],
            ["Área de espera VIP","20 m²","7%"],
            ["Depósito de produtos","12 m²","4%"],
            ["Sanitários","6 m²","2%"],
            ["Área técnica + futuro","52 m²","17%"],
          ]} total={["TOTAL","300 m²","100%"]} />
        </Card>
        <Card title="Capacidade Operacional" color={C.yellow}>
          <T headers={["Parâmetro","Por Boia","Total"]} rows={[
            ["Carros/hora (ritmo normal)","2–3","4–6"],
            ["Operando 10h/dia","20–30","40–60"],
            ["Meta realista inicial","12–15","25–30"],
            ["Tempo médio por carro","35 min","—"],
            ["Serviços/hora na secagem","2","4"],
          ]} />
          <Alert type="warning">
            <strong>Início:</strong> 1 lavador por boia + proprietário na recepção. Com crescimento, adicione 1 recepcionista BIT CAR.
          </Alert>
        </Card>
      </div>
 
      <Card title="Fluxo Operacional BIT CAR — 6 Etapas" color={C.orange}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
          {[
            { n:"1", t:"Chegada", d:"Cliente chega ou agenda via WhatsApp / App", c:C.orange },
            { n:"2", t:"Check-in", d:"Recepção emite OS e registra no sistema", c:C.orange },
            { n:"3", t:"Fila", d:"Gestão digital via WhatsApp Business", c:C.yellow },
            { n:"4", t:"Lavagem", d:"Equipe executa conforme OS e padrão BIT CAR", c:C.yellow },
            { n:"5", t:"Secagem", d:"Finalização, inspeção e foto para Instagram", c:C.green },
            { n:"6", t:"Entrega", d:"Pagamento + convite para Clube BIT CAR ₿", c:C.green },
          ].map((s,i) => (
            <div key={i} style={{
              background:`${s.c}15`, border:`1px solid ${s.c}44`,
              borderRadius:10, padding:"12px 8px", textAlign:"center",
            }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.n}</div>
              <div style={{ fontWeight:800, fontSize:12, color:C.text, margin:"4px 0" }}>{s.t}</div>
              <div style={{ fontSize:10, color:C.muted }}>{s.d}</div>
            </div>
          ))}
        </div>
      </Card>
 
      <Card title="Equipe — Fases de Crescimento" color={C.green}>
        <T headers={["Fase","Período","Equipe","Folha/Mês","Capacidade"]} rows={[
          ["Abertura","Mês 1–3","2 lavadores + proprietário na recepção","R$ 4.320","15–20 carros/dia"],
          ["Crescimento","Mês 4–8","3 lavadores + proprietário/recepcionista","R$ 6.480","25–30 carros/dia"],
          ["Consolidado","Mês 9+","4 lavadores + 1 recepcionista","R$ 8.640","35–40 carros/dia"],
        ]} />
      </Card>
 
      <Card title="Obras Necessárias — Prioridade e Custo" color={C.yellow}>
        <T headers={["Item","Prioridade","Custo","Obs."]} rows={[
          ["Piso antiderrapante industrial nas boxas","ESSENCIAL","R$ 3.500","Porcelanato 20×20 cm"],
          ["Canaletas + separador areia e óleo","ESSENCIAL","R$ 2.500","Exigência legal SEMEA-UBL"],
          ["Cobertura metálica da área de secagem","ESSENCIAL","R$ 4.000","Telha galvalume + estrutura"],
          ["Pontos de água reforçados (2 por boia)","ESSENCIAL","R$ 1.500","Tubulação 3/4\" mínimo"],
          ["Pontos elétricos industriais 220V","ESSENCIAL","R$ 1.200","Para equipamentos"],
          ["Recepção + área de espera VIP","IMPORTANTE","R$ 2.500","Balcão, cadeiras, TV, Wi-Fi, LED laranja"],
          ["Fachada + identidade visual BIT CAR","IMPORTANTE","R$ 1.800","Placa luminosa laranja + preto"],
          ["Câmeras de segurança CFTV (mín. 4)","IMPORTANTE","R$ 1.000","IP com gravação"],
        ]} total={["TOTAL OBRAS (cenário ideal)","","R$ 18.000",""]} />
      </Card>
    </div>
  );
}
 
// ─── S3 ───────────────────────────────────────────────────────────────────────
function S3() {
  return (
    <div>
      <SH n={3} title="Equipamentos" sub="Lista completa com marcas, valores e vida útil" />
      <Alert type="warning">
        <strong>Estratégia BIT CAR:</strong> Invista em qualidade intermediária-alta. Equipamentos baratos geram manutenção frequente, prejudicam a qualidade e destroem o padrão premium da marca.
      </Alert>
      <Card title="Equipamentos Essenciais — Abertura" color={C.orange}>
        <T headers={["Equipamento","Marca Recomendada","Modelo","Valor Médio","Qtde","Vida Útil"]} rows={[
          ["Lavadora alta pressão profissional","Wap / Karcher","Wap Titan 2500 / K5.700","R$ 2.200–3.800","2 un.","4–6 anos"],
          ["Aspirador pó e água 80L","WAP / Electrolux","WAP GT MAX / FLEX N","R$ 900–1.400","2 un.","3–5 anos"],
          ["Compressor de ar 40L 2HP","Schulz / Pressure","MSV 6/40 / Storm 40L","R$ 700–1.100","1 un.","5–8 anos"],
          ["Pistola de espuma ativa (foam gun)","Bozza / Vonixx","Snow Lance Pro","R$ 250–450","2 un.","2–3 anos"],
          ["Mangueiras reforçadas 20m","Tramontina / Kanaflex","Mangueira jardim reforçada","R$ 120–200","4 un.","2–4 anos"],
          ["Baldes plásticos 20L (duplos)","Tramontina","Balde 2 compartimentos lavagem","R$ 40–80","4 un.","2–3 anos"],
          ["Kit escovas profissionais","Vonixx / 3M","Cabo longo + cerdas macias","R$ 80–150","2 kits","1–2 anos"],
          ["Kit microfibras 400 g/m²","Vonixx / Meguiar's","Pack 10 unidades profissional","R$ 120–200","3 kits","1–2 anos"],
          ["Extensão elétrica industrial 20m","Tramontina","2P+T 20A emborrachada","R$ 80–150","3 un.","3–5 anos"],
          ["Suporte carretel para mangueira","Diversas","Carretel parede ou carrinho inox","R$ 120–180","2 un.","4–6 anos"],
          ["Pincéis detailing (kit 5 tamanhos)","Vonixx / Koch Chemie","Pincéis plásticos/silicone","R$ 60–100","2 kits","1–2 anos"],
          ["Luvas de nitrila (caixa 100 un.)","Descarpack","Nitrila G ou M","R$ 60–90/cx","5 cx/mês","Consumível"],
        ]} total={["TOTAL EQUIPAMENTOS ESSENCIAIS","","","R$ 9.000–15.000","",""]} />
      </Card>
 
      <Card title="Insumos Mensais — Consumo BIT CAR" color={C.yellow}>
        <T headers={["Produto","Marca","Apresentação","Custo/Mês","Rendimento"]} rows={[
          ["Shampoo automotivo concentrado","Vonixx / Diquirosa","Galão 5L","R$ 120","~500 lavagens/galão"],
          ["Espuma ativa (pré-lavagem)","Vonixx V-Foam / Sonax","Galão 5L","R$ 180","~300 aplicações/galão"],
          ["Cera spray / lustro instantâneo","Vonixx / Würth","Galão 5L","R$ 150","~200 aplicações/galão"],
          ["Produto multiuso interior","Vonixx V-Interior / Meguiar's","Galão 5L","R$ 130","~200 aplicações/galão"],
          ["Limpa vidros automotivo","Vonixx / 3M","Galão 5L","R$ 90","~300 aplicações/galão"],
          ["Desengordurante de motor","Tirreno / 3M","Galão 5L","R$ 100","~100 aplicações/galão"],
          ["Odorizador / perfume automotivo","Diquirosa / diversas","Caixa 12 unidades","R$ 60","Unitário por serviço"],
        ]} total={["TOTAL INSUMOS/MÊS","","","R$ 830–1.100",""]} />
      </Card>
 
      <Card title="Equipamentos Fase 2 — Estética BIT CAR (Somente após Etapa 9)" color={C.red}>
        <Alert type="danger">
          Adquira SOMENTE após atingir TODOS os indicadores de gatilho da Etapa 9. Expansão prematura é a principal causa de fechamento de lava jatos.
        </Alert>
        <T headers={["Equipamento","Marca Recomendada","Valor Médio","Ordem de Compra"]} rows={[
          ["Politriz orbital profissional","Flex 3401 / Rupes LHR15","R$ 800–2.500","1ª prioridade"],
          ["Extratora de higienização","Thermatec / Vonder EX1500","R$ 2.500–5.000","2ª prioridade"],
          ["Ozonizador","OzoneTech / diversas","R$ 600–1.200","3ª prioridade"],
          ["Kit vitrificação vidros + pintura","Rennol / Vonixx Vitrifica","R$ 500–1.200 (kit)","4ª prioridade"],
          ["Vaporizador profissional a vapor","Kärcher SV8 / Lavor Pro","R$ 1.500–3.500","5ª prioridade"],
        ]} />
      </Card>
    </div>
  );
}
 
// ─── S4 ───────────────────────────────────────────────────────────────────────
function S4() {
  const [tab, setTab] = useState("google");
  return (
    <div>
      <SH n={4} title="Marketing BIT CAR" sub="Google, Instagram e WhatsApp Business" />
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["google","🔍 Google"],["instagram","📸 Instagram"],["whatsapp","💬 WhatsApp"]].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:"8px 20px", borderRadius:8, border:`1px solid ${tab===k?C.orange:C.border}`,
            cursor:"pointer", background: tab===k ? C.orange : C.card,
            color: tab===k ? "#000" : C.muted, fontWeight:800, fontSize:12,
            letterSpacing:"0.05em", transition:"all 0.2s",
          }}>{l}</button>
        ))}
      </div>
 
      {tab==="google" && (
        <div>
          <Alert type="warning">
            <strong>ROI #1 do Marketing:</strong> Google Meu Negócio é a ferramenta de maior retorno para lava jatos. 70% das buscas por "lava jato perto de mim" resultam em visita no mesmo dia.
          </Alert>
          <Card title="Google Meu Negócio — Setup BIT CAR" color={C.orange}>
            <T headers={["Ação","Como Fazer","Prazo"]} rows={[
              ["Criar perfil no Google Meu Negócio","business.google.com → categoria 'Lava-rápido'","Dia 1"],
              ["Verificar endereço","Google envia código pelos Correios em 5–7 dias","Semana 1"],
              ["Adicionar 20+ fotos profissionais","Fachada, equipe, antes/depois, equipamentos, preços","Semana 1"],
              ["Configurar horários corretos","Seg–Sáb 8h–18h conforme operação BIT CAR","Dia 1"],
              ["Descrever serviços com palavras-chave","'lava jato Uberlândia', 'lavagem completa', 'BIT CAR'","Semana 1"],
              ["Ativar mensagens diretas","Responder perguntas em menos de 1 hora","Contínuo"],
              ["Postar 1 update por semana","Promoção, foto de trabalho, novidade","Contínuo"],
              ["Solicitar avaliações sistematicamente","Link via WhatsApp após cada serviço","Contínuo"],
            ]} />
          </Card>
          <Card title="Estratégia de Reviews — Meta: 4.8 ⭐ com 100+ avaliações" color={C.yellow}>
            <T headers={["Ação","Ferramenta","Meta"]} rows={[
              ["Criar link curto para avaliação","Google → 'Pedir avaliação' → encurtar no bit.ly","Dia 1"],
              ["Configurar no WhatsApp Business","Mensagem automática pós-serviço com o link","Semana 1"],
              ["QR Code na recepção","Plaquinha na identidade BIT CAR na saída","Semana 2"],
              ["Treinar equipe para pedir avaliação","'Ficou satisfeito? Nos avalie no Google!'","Semana 1"],
              ["Responder TODAS as avaliações","Positivas e negativas em até 24h","Contínuo"],
              ["Meta de 10 reviews por semana","Acompanhar pelo painel do Google","Meta mensal"],
            ]} />
            <div style={{ background:C.surface, padding:14, borderRadius:8, fontSize:12, color:C.text, marginTop:12, lineHeight:1.8, border:`1px solid ${C.border}` }}>
              <span style={{ color:C.orange, fontWeight:800 }}>📲 Template pós-serviço:</span><br />
              "Olá [Nome]! 😊 Ficamos felizes em atender você hoje na BIT CAR! Se ficou satisfeito, adoraríamos ter sua avaliação no Google — leva só 30 segundos: <span style={{ color:C.orange }}>[LINK]</span>. Obrigado e até a próxima! ₿"
            </div>
          </Card>
          <Card title="SEO Local — Palavras-chave para Uberlândia" color={C.green}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {["lava jato uberlândia","lavagem automotiva uberlândia","bit car uberlândia",
                "lavagem completa uberlândia","higienização automotiva uberlândia",
                "lava jato perto de mim","lava rápido uberlândia mg",
                "lava jato tibery","lava jato santa mônica","lavagem executive uberlândia"].map((kw,i) => (
                <Badge key={i} text={kw} color={C.orange} />
              ))}
            </div>
          </Card>
        </div>
      )}
 
      {tab==="instagram" && (
        <div>
          <Alert type="warning">
            <strong>Regra BIT CAR:</strong> Antes/depois é o conteúdo de maior engajamento. O visual premium da marca laranja + preto é naturalmente fotogênico. Meta: 1 Reels/semana + 3–5 Stories/dia.
          </Alert>
          {[
            { mes:"MÊS 1 — LANÇAMENTO BIT CAR", color:C.orange, semanas:[
              { sem:"Sem 1", reels:"Apresentação: tour pelo espaço BIT CAR — 'Chegamos em Uberlândia!'", stories:"3×/dia: obras, contagem regressiva, equipe uniformizada", post:"Tabela de preços em card preto + laranja (Canva)" },
              { sem:"Sem 2", reels:"Primeiro antes/depois impactante — carro sujo → impecável", stories:"Depoimento do primeiro cliente satisfeito", post:"'Por que lavar profissionalmente é diferente?' (educativo)" },
              { sem:"Sem 3", reels:"Time-lapse da lavagem completa em 35 min (5× velocidade)", stories:"Enquete: 'Você prefere simples ou completa?'", post:"Apresentação do Clube BIT CAR — planos mensais" },
              { sem:"Sem 4", reels:"Promoção de inauguração — 20% OFF na semana", stories:"Cliente repostando o carro limpo com a logo BIT CAR", post:"Dicas para manter o carro limpo entre as lavagens" },
            ]},
            { mes:"MÊS 2 — CRESCIMENTO", color:C.yellow, semanas:[
              { sem:"Sem 5", reels:"Close da lavagem de motor — processo detalhado", stories:"Bastidores: produtos que usamos e por quê", post:"Vantagens de ser mensalista — calculadora de economia" },
              { sem:"Sem 6", reels:"Transformação de SUV: 5 minutos de puro antes/depois", stories:"Pesquisa: 'qual serviço você mais precisa?'", post:"Parceria com empresa local (foto + agradecimento)" },
              { sem:"Sem 7", reels:"Top 5 erros ao lavar carro em casa (viral educativo)", stories:"Bastidores dos uniformes BIT CAR — branding forte", post:"Depoimento de cliente mensalista (print do WhatsApp)" },
              { sem:"Sem 8", reels:"ASMR lavagem — sons satisfatórios da alta pressão", stories:"Sorteio: 1 lavagem grátis — marque 2 amigos", post:"Promo segunda-feira (menor movimento = oportunidade)" },
            ]},
            { mes:"MÊS 3 — CONSOLIDAÇÃO", color:C.green, semanas:[
              { sem:"Sem 9", reels:"Motorista de app: 'seu carro é seu escritório'", stories:"50+ avaliações no Google — comemoração ₿", post:"Clube BIT CAR: 'lave e acumule pontos'" },
              { sem:"Sem 10", reels:"Antes/depois de carro valorizado (BMW, Golf, etc.)", stories:"Oferta: novos mensalistas 1ª semana grátis", post:"Checklist completo do que a lavagem BIT CAR inclui" },
              { sem:"Sem 11", reels:"Compilado de transformações do mês (montagem dinâmica)", stories:"Calculadora: 'quanto você economiza sendo mensalista?'", post:"3 meses de BIT CAR — resultados e agradecimentos" },
              { sem:"Sem 12", reels:"Aniversário de 3 meses — surpresa + promoção especial", stories:"Enquete: 'qual novo serviço você gostaria de ver?'", post:"Teaser dos novos serviços — o que vem por aí ₿" },
            ]},
          ].map((m,mi) => (
            <Card key={mi} title={m.mes} color={m.color}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {m.semanas.map((s,si) => (
                  <div key={si} style={{ background:C.surface, borderRadius:8, padding:10, fontSize:11, border:`1px solid ${C.border}` }}>
                    <div style={{ fontWeight:800, color:m.color, marginBottom:6 }}>{s.sem}</div>
                    <div style={{ marginBottom:5 }}><span style={{ fontWeight:700, color:C.orange }}>🎬 Reels:</span><br />{s.reels}</div>
                    <div style={{ marginBottom:5 }}><span style={{ fontWeight:700, color:"#e91e63" }}>📱 Stories:</span><br />{s.stories}</div>
                    <div><span style={{ fontWeight:700, color:C.muted }}>📌 Post:</span><br />{s.post}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
 
      {tab==="whatsapp" && (
        <div>
          <Alert type="success">
            <strong>Canal principal:</strong> 95% dos brasileiros usam WhatsApp diariamente. Configure o WhatsApp Business com rigor — será seu maior canal de retorno de clientes BIT CAR.
          </Alert>
          <Card title="Configurações do WhatsApp Business BIT CAR" color={C.green}>
            <T headers={["Campo","Conteúdo Recomendado"]} rows={[
              ["Nome","BIT CAR — Lava Jato Uberlândia"],
              ["Categoria","Automotivo"],
              ["Descrição","⚡ Lavagem profissional em Uberlândia | Clube BIT CAR — planos mensais | Atendemos empresas e frotas | Seg–Sáb 8h–18h"],
              ["Endereço","Endereço completo + link Google Maps"],
              ["Website","Link do site ou Instagram BIT CAR"],
              ["Catálogo","Todos os serviços com foto, descrição e preço"],
            ]} />
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { title:"📩 SAUDAÇÃO (ao abrir conversa)", bg:C.card, msg:`Olá! ⚡ Bem-vindo à BIT CAR!\n\n₿ Lava Jato & Estética Automotiva em Uberlândia.\n\nComo posso ajudar?\n\n1️⃣ Agendar uma lavagem\n2️⃣ Ver preços e serviços\n3️⃣ Clube BIT CAR (planos mensais)\n4️⃣ Falar com atendente\n\n⏰ Seg–Sáb 8h às 18h` },
              { title:"🌙 AUSÊNCIA (fora do horário)", bg:C.card, msg:`Olá! ⚡ Recebemos sua mensagem, mas estamos fora do horário.\n\n⏰ Atendemos Seg–Sáb das 8h às 18h.\n\nEm breve te respondemos! 😊\n\nPara agendar agora: [link]` },
              { title:"✅ CONFIRMAÇÃO DE AGENDAMENTO", bg:C.card, msg:`Agendamento confirmado na BIT CAR! ⚡\n\n📅 Data: [DATA]\n⏰ Horário: [HORA]\n🚗 Serviço: [SERVIÇO]\n💰 Valor: R$ [VALOR]\n\n📍 Endereço: [ENDEREÇO]\n\nTe esperamos! ₿` },
              { title:"🔄 RETORNO (30 dias inativo)", bg:C.card, msg:`Oi [NOME]! ⚡ Faz um tempinho que não te vemos na BIT CAR...\n\n🚗 Seu carro está pedindo uma lavagem! 😄\n\n✨ Oferta exclusiva para você:\n10% OFF na próxima lavagem completa\n📅 Válido até [DATA]\n\nAgende: [LINK] ₿` },
            ].map((m,i) => (
              <div key={i}>
                <div style={{ fontWeight:800, color:C.orange, marginBottom:6, fontSize:11 }}>{m.title}</div>
                <div style={{ background:m.bg, padding:12, borderRadius:8, fontSize:12, color:C.text,
                  lineHeight:1.8, whiteSpace:"pre-line", border:`1px solid ${C.border}` }}>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>
          <Card title="Catálogo de Serviços no WhatsApp" color={C.orange} style={{ marginTop:16 }}>
            <Alert type="warning">Configure o catálogo no WhatsApp Business. Isso elimina 60% das dúvidas de preço no atendimento.</Alert>
            <T headers={["Serviço","Descrição","Preço","Foto ideal"]} rows={[
              ["🚿 Lavagem Simples","Externo completo + rodas + pneus","R$ 25","Antes/depois externo"],
              ["✨ Lavagem Completa","Externo + interior + aspiração","R$ 60","Antes/depois interior"],
              ["💎 Lavagem Executiva","Completa + cera spray + perfume","R$ 85","Carro brilhando"],
              ["🔧 Lavagem de Motor","Desengraxante + lavagem segura","R$ 90","Motor limpo"],
              ["🏠 Higienização Interna","Extração + bactericida","R$ 160","Interior renovado"],
              ["₿ Clube Básico Mensal","4 lavagens simples/mês","R$ 89/mês","Arte BIT CAR"],
              ["₿ Clube Plus Mensal","8 lavagens simples/mês","R$ 159/mês","Arte BIT CAR"],
            ]} />
          </Card>
        </div>
      )}
    </div>
  );
}
 
// ─── S5 ───────────────────────────────────────────────────────────────────────
function S5() {
  return (
    <div>
      <SH n={5} title="Site & Presença Digital" sub="Plataforma ideal, custo e estrutura completa" />
      <MRow items={[
        { label:"Setup inicial", value:"R$ 0–300", color:C.orange, sub:"Com template pronto" },
        { label:"Custo mensal", value:"R$ 50–120", color:C.yellow, sub:"Hospedagem + domínio" },
        { label:"Tempo de criação", value:"1–3 dias", color:C.green, sub:"Wix com template" },
        { label:"Domínio sugerido", value:"bitcar.com.br", color:C.orange, sub:"R$ 40–60/ano" },
      ]} />
      <Card title="Comparativo de Plataformas" color={C.orange}>
        <T headers={["Plataforma","Custo/Mês","Dificuldade","Agendamento","SEO","Recomendação"]} rows={[
          ["Wix Business","R$ 60–120","Fácil","✅ Nativo (Wix Bookings)","⭐⭐⭐⭐","🥇 1ª opção"],
          ["WordPress + Elementor","R$ 40–80","Médio","✅ Plugin grátis","⭐⭐⭐⭐⭐","🥈 2ª opção"],
          ["Canva Sites","R$ 50","Muito fácil","❌","⭐⭐","🥉 Provisório"],
          ["Google Sites","Grátis","Fácil","❌","⭐⭐","💡 Só no início"],
        ]} total={["RECOMENDADO: Wix Business","R$ 65–80/mês","Fácil","✅","⭐⭐⭐⭐","Melhor custo-benefício"]} />
        <Alert type="warning">
          <strong>Recomendação BIT CAR:</strong> Wix Business com template dark. Personalizar com cores preto + laranja Bitcoin. Domínio bitcar.com.br disponível por ~R$ 40/ano.
        </Alert>
      </Card>
 
      <Card title="Estrutura Completa do Site BIT CAR — 6 Páginas" color={C.yellow}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[
            { pg:"🏠 HOME", items:["Header: Logo BIT CAR + botão 'Agendar agora' (WhatsApp)","Hero: foto impactante antes/depois em dark mode + headline forte","Grid de serviços em cards preto + laranja","Seção Clube BIT CAR com os 3 planos","Google Reviews embed (nota + depoimentos)","Google Maps + horários de funcionamento","Footer completo com redes e contatos"] },
            { pg:"🚗 SERVIÇOS", items:["Lista completa com fotos premium em dark","Tabela de preços clara por categoria","Botão 'Agendar' em laranja em cada serviço","FAQ: dúvidas mais comuns sobre lavagem","CTA: 'Economize com o Clube BIT CAR'"] },
            { pg:"₿ CLUBE BIT CAR", items:["Tabela comparativa dos 3 planos (Básico / Plus / Premium)","Benefícios exclusivos de cada nível VIP","Calculadora: 'Quanto você economiza por mês?'","Botão 'Assinar' → WhatsApp pré-selecionado","Frase: 'Lave, Acumule e Ganhe Recompensas!'"] },
            { pg:"📅 AGENDAMENTO", items:["Formulário: nome, serviço, data e horário","Calendário com horários disponíveis (Wix Bookings)","Confirmação automática por WhatsApp","Alternativa: botão direto WhatsApp"] },
            { pg:"🏢 EMPRESAS E FROTAS", items:["Proposta de convênio corporativo","Benefícios: faturamento mensal, NF, agenda exclusiva","Tabela de preços por volume de veículos","Formulário de contato comercial"] },
            { pg:"📞 CONTATO", items:["Telefone, WhatsApp e e-mail visíveis","Google Maps incorporado","Horário de funcionamento","Link direto para avaliação no Google"] },
          ].map((p,i) => (
            <div key={i} style={{ background:C.surface, borderRadius:8, padding:14, border:`1px solid ${C.border}` }}>
              <div style={{ fontWeight:800, color:C.orange, marginBottom:8, fontSize:12 }}>{p.pg}</div>
              {p.items.map((item,j) => (
                <div key={j} style={{ fontSize:12, color:C.text, padding:"3px 0",
                  borderBottom: j<p.items.length-1 ? `1px solid ${C.border}` : "none" }}>
                  • {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
 
      <Card title="Integrações Essenciais" color={C.green}>
        <T headers={["Integração","Ferramenta","Custo","Benefício"]} rows={[
          ["WhatsApp click-to-chat","wa.me/55XX + botão flutuante laranja","Grátis","Converte visitante em cliente na hora"],
          ["Google Analytics 4","analytics.google.com","Grátis","Ver de onde vêm os visitantes"],
          ["Google Search Console","search.google.com/console","Grátis","Melhorar posição no Google"],
          ["Pixel Meta (Facebook/Instagram)","Meta Business Suite","Grátis","Remarketing para visitantes do site"],
          ["Chat ao vivo","Tidio ou JivoChat (free tier)","Grátis","Converter visitantes em tempo real"],
          ["Agendamento","Wix Bookings (incluso) ou Calendly","R$ 0–30/mês","Reduzir trabalho manual de agenda"],
        ]} />
      </Card>
    </div>
  );
}
 
// ─── S6 ───────────────────────────────────────────────────────────────────────
function S6() {
  return (
    <div>
      <SH n={6} title="Clube BIT CAR — Fidelização" sub="Planos de assinatura, receita recorrente e benefícios VIP" />
      <Alert type="warning">
        <strong>₿ Conceito BIT CAR:</strong> Transforme cada lavagem em pontos — como satoshis. O Clube BIT CAR posiciona a assinatura como um investimento no carro, não um gasto. Alinha com a identidade da marca.
      </Alert>
 
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:20 }}>
        {[
          { name:"CLUBE BÁSICO", price:"R$ 89", color:C.orange, tag:null,
            desc:"4 lavagens simples por mês",
            benefits:["1 lavagem/semana","Sem fidelidade mínima","Agendamento prioritário","Acúmulo de pontos BIT CAR"],
            saving:"R$ 11 de economia vs avulso (R$ 25 × 4 = R$ 100)",
            margin:"82%", target:"Clientes casuais, 1×/semana" },
          { name:"CLUBE PLUS", price:"R$ 159", color:C.orange, tag:"₿ MAIS POPULAR",
            desc:"8 lavagens simples por mês",
            benefits:["2 lavagens/semana","10% OFF em serviços avulsos","Agendamento prioritário","1 lavagem completa grátis/trimestre"],
            saving:"R$ 41 de economia vs avulso (R$ 25 × 8 = R$ 200)",
            margin:"78%", target:"Motoristas de app, profissionais, famílias" },
          { name:"CLUBE PREMIUM", price:"R$ 249", color:C.yellow, tag:null,
            desc:"Lavagens simples ilimitadas",
            benefits:["Máx. 2×/dia ou 3×/semana","20% OFF em serviços extras","1 lavagem completa/mês grátis","Atendimento expresso — sem fila"],
            saving:"Quanto mais usa, mais economiza",
            margin:"65–75%", target:"Heavy users, frotas, executivos" },
        ].map((p,i) => (
          <div key={i} style={{
            background:C.card, borderRadius:14, border:`1px solid ${C.border}`,
            borderTop:`2px solid ${p.color}`, padding:22, position:"relative",
            boxShadow:`0 8px 32px rgba(247,147,26,0.12)`,
          }}>
            {p.tag && (
              <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                background:C.orange, color:"#000", padding:"3px 14px", borderRadius:100,
                fontSize:10, fontWeight:900, whiteSpace:"nowrap", letterSpacing:"0.05em" }}>{p.tag}</div>
            )}
            <div style={{ textAlign:"center", marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:900, color:p.color, textTransform:"uppercase",
                letterSpacing:"0.1em", marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:32, fontWeight:900, color:p.color, letterSpacing:"-0.03em" }}>
                {p.price}<span style={{ fontSize:12, fontWeight:400, color:C.muted }}>/mês</span>
              </div>
              <div style={{ fontSize:12, color:C.text, fontWeight:600, marginTop:3 }}>{p.desc}</div>
            </div>
            <div style={{ height:1, background:C.border, margin:"10px 0" }} />
            {p.benefits.map((b,j) => (
              <div key={j} style={{ display:"flex", gap:7, marginBottom:6, fontSize:12 }}>
                <span style={{ color:C.orange, flexShrink:0 }}>₿</span>
                <span style={{ color:C.text }}>{b}</span>
              </div>
            ))}
            <div style={{ height:1, background:C.border, margin:"10px 0" }} />
            <div style={{ fontSize:11, color:C.muted, lineHeight:1.7 }}>
              <strong style={{ color:C.green }}>Economia:</strong> {p.saving}<br />
              <strong>Margem:</strong> {p.margin} · <strong>Público:</strong> {p.target}
            </div>
          </div>
        ))}
      </div>
 
      <Card title="Análise de Receita Recorrente — Cenários de Mensalistas" color={C.orange}>
        <T headers={["Cenário","Básico","Plus","Premium","Receita Recorrente/Mês"]} rows={[
          ["20 assinantes (mix)","7 × R$89 = R$623","8 × R$159 = R$1.272","5 × R$249 = R$1.245","R$ 3.140"],
          ["50 assinantes (mix)","17 × R$89 = R$1.513","20 × R$159 = R$3.180","13 × R$249 = R$3.237","R$ 7.930"],
          ["60 assinantes — mix realista","20 × R$89 = R$1.780","25 × R$159 = R$3.975","15 × R$249 = R$3.735","R$ 9.490"],
        ]} total={["META ANO 1 (60 mensalistas)","","","","R$ 9.490/mês"]} />
        <Alert type="success">R$ 9.490 de recorrência = 69% dos custos fixos cobertos independente do volume diário. Isso torna a BIT CAR resiliente à sazonalidade.</Alert>
      </Card>
 
      <Card title="Estratégia de Conversão para o Clube BIT CAR" color={C.yellow}>
        <T headers={["Ação","Como executar","Quando"]} rows={[
          ["Oferta na primeira visita","'No seu 2º serviço te explico o Clube — você economiza até R$41/mês'","Na entrega"],
          ["QR Code na área de espera","Cartaz BIT CAR com benefícios + QR para assinar","Semana 1"],
          ["Promo de lançamento","Primeiros 20 membros: 1ª semana do plano GRÁTIS","Abertura"],
          ["Campanha Instagram/Stories","Calculadora de economia em card preto + laranja","Semana 3"],
          ["Indicação premiada","Indique um amigo → 1 lavagem grátis para ambos","Mês 2"],
          ["Desconto frota corporativa","Clube Plus para 5+ carros → 15% adicional","Mês 2–3"],
        ]} />
      </Card>
    </div>
  );
}
 
// ─── S7 ───────────────────────────────────────────────────────────────────────
function S7() {
  return (
    <div>
      <SH n={7} title="Clientes Corporativos" sub="Convênios, frotas e parcerias empresariais em Uberlândia" />
      <Alert type="warning">
        <strong>Potencial em Uberlândia:</strong> Forte polo de agronegócio, saúde, varejo e logística. Uma empresa com 10 carros = R$ 1.590/mês (Clube Plus). Meta: 5 contratos = R$ 8.000+/mês garantido.
      </Alert>
      <Card title="Segmentos-Alvo em Uberlândia — BIT CAR" color={C.orange}>
        <T headers={["Segmento","Perfil","Potencial/Mês","Abordagem"]} rows={[
          ["Motoristas Uber/99/iFood","1 carro, 2–4×/semana","R$ 159 (Plus)/cliente","Pontos de espera, grupos WhatsApp"],
          ["Clínicas, consultórios, labs","2–8 carros dos sócios","R$ 500–2.000/contrato","Visita presencial com proposta"],
          ["Imobiliárias e corretores","5–20 carros ativos","R$ 1.000–4.000/contrato","Prospecção direta ao gerente"],
          ["Empresas de logística","Vans e veículos leves","R$ 800–3.000/contrato","Proposta agenda fixa semanal"],
          ["Condomínios residenciais","Convênio para moradores","Ticket coletivo + desconto","Parceria com administradora"],
          ["Concessionárias de veículos","Terceirização de prep","R$ 2.000–5.000/mês","Proposta de exclusividade + SLA"],
          ["Frotas de vendedores externos","5–20 carros","R$ 1.000–4.000/contrato","Visita ao gestor comercial"],
          ["Escolas e universidades","Professores + colaboradores","Convênio com desconto","Parceria com diretoria/RH"],
        ]} />
      </Card>
 
      <Card title="Modelo de Proposta Comercial — BIT CAR Convênio Empresarial" color={C.yellow}>
        <div style={{ background:C.surface, borderRadius:8, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:900, color:C.orange, letterSpacing:"0.05em" }}>₿ BIT CAR — PROPOSTA COMERCIAL</div>
            <div style={{ fontSize:11, color:C.muted }}>Lava Jato & Estética Automotiva · Uberlândia/MG</div>
          </div>
          <div style={{ fontSize:12, color:C.text, lineHeight:1.9, marginBottom:14 }}>
            <strong style={{ color:C.orange }}>Apresentação:</strong> Oferecemos lavagem automotiva profissional para empresas com 3 ou mais veículos, com faturamento mensal, nota fiscal, preços diferenciados e agenda exclusiva.
          </div>
          <T headers={["Plano Corporativo","Veículos","Lavagens/Mês","Preço Unit.","Total/Mês","Desconto"]} rows={[
            ["Frota Pequena","3–5","4 por veículo","R$ 20","R$ 240–400","20%"],
            ["Frota Média","6–15","8 por veículo","R$ 18","R$ 864–2.160","28%"],
            ["Frota Grande","16+","Negociável","R$ 15–17","Consultar","Até 40%"],
          ]} />
          <div style={{ fontSize:12, color:C.text, marginTop:12, lineHeight:1.9 }}>
            <strong style={{ color:C.orange }}>Condições:</strong> Pagamento mensal por PIX ou boleto · Nota fiscal PJ · Agendamento dedicado via WhatsApp · Relatório mensal de serviços · Contrato mínimo 3 meses
          </div>
        </div>
      </Card>
 
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card title="Script — Motoristas de App" color={C.green}>
          <div style={{ background:C.surface, padding:14, borderRadius:8, fontSize:12, lineHeight:1.8, color:C.text, border:`1px solid ${C.border}` }}>
            <strong style={{ color:C.orange }}>Abordagem em ponto de app:</strong><br /><br />
            "Oi, tudo bem? Sou da BIT CAR, aqui pertinho. Sei que vocês usam o carro todo dia, então criamos o Clube BIT CAR exclusivo pra motoristas de app:<br /><br />
            ⚡ <strong>8 lavagens por R$ 159/mês</strong> — menos de R$ 20 por lavagem!<br /><br />
            Carro limpo = mais 5 estrelas e mais corridas. Posso te mandar os detalhes no WhatsApp? ₿"
          </div>
        </Card>
        <Card title="Script — Empresas" color={C.orange}>
          <div style={{ background:C.surface, padding:14, borderRadius:8, fontSize:12, lineHeight:1.8, color:C.text, border:`1px solid ${C.border}` }}>
            <strong style={{ color:C.orange }}>Abordagem por telefone ou visita:</strong><br /><br />
            "Bom dia! Gostaria de falar com o responsável pela frota ou o RH. Somos a BIT CAR, lava jato profissional em Uberlândia — trabalhamos com convênio para empresas: faturamento mensal, nota fiscal, preços diferenciados e agendamento dedicado.<br /><br />
            Posso enviar uma proposta ou fazer uma visita de 15 minutos?"
          </div>
        </Card>
      </div>
 
      <Card title="Plano de Prospecção — 90 Dias BIT CAR" color={C.green}>
        <T headers={["Período","Ação","Meta","Ferramenta"]} rows={[
          ["Sem 1–2","Mapear 30 empresas-alvo no raio de 3 km","30 contatos levantados","Google Maps + LinkedIn"],
          ["Sem 3–4","Abordar motoristas de app presencialmente","3 mensalistas fechados","Pontos Uber + grupos WA"],
          ["Sem 5–6","Enviar proposta para 15 empresas","5 reuniões agendadas","Proposta PDF BIT CAR + WA"],
          ["Sem 7–8","Fechar 1º contrato corporativo","1 empresa parceira","Contrato + NF"],
          ["Sem 9–10","Abordar condomínios com carta-proposta","2 condomínios visitados","Carta + visita presencial"],
          ["Sem 11–12","Fechar 2º contrato + revisar estratégia","2 empresas + 10 drivers","Análise KPIs"],
        ]} />
      </Card>
    </div>
  );
}
 
// ─── S8 ───────────────────────────────────────────────────────────────────────
function S8() {
  return (
    <div>
      <SH n={8} title="Indicadores e Painel BIT CAR" sub="KPIs essenciais, metas mensais e controle de gestão" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18 }}>
        {[
          { l:"Ticket Médio", t:"R$ 45–55", min:"Mín.: R$ 35", c:C.orange },
          { l:"Carros/Dia", t:"25–30", min:"Mín.: 16 (PE)", c:C.yellow },
          { l:"Faturamento/Mês", t:"R$ 28.000+", min:"Mín.: R$ 16.500", c:C.orange },
          { l:"Membros Clube BIT CAR", t:"50+ membros", min:"Mín.: 20", c:C.green },
          { l:"Google Reviews", t:"4,8 ⭐ / 100+", min:"Mín.: 4,5 / 30+", c:C.yellow },
          { l:"Taxa de Retorno 30d", t:"55%+", min:"Mín.: 35%", c:C.green },
        ].map((k,i) => (
          <div key={i} style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`,
            borderLeft:`3px solid ${k.c}`, padding:14 }}>
            <div style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{k.l}</div>
            <div style={{ fontSize:18, fontWeight:900, color:k.c }}>{k.t}</div>
            <div style={{ fontSize:10, color:C.subtle, marginTop:3 }}>{k.min}</div>
          </div>
        ))}
      </div>
 
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Controle Diário BIT CAR" color={C.orange}>
          <T headers={["Métrica","Como Medir"]} rows={[
            ["Qtd. carros no dia","Contar OSs emitidas"],
            ["Faturamento do dia","Soma do caixa ao fechar"],
            ["Ticket médio do dia","Faturamento ÷ carros"],
            ["Mix de serviços","Marcação na OS (qual serviço)"],
            ["Novos clientes","Perguntar: 'É a primeira vez?'"],
            ["Tempo médio por carro","Cronometrar 3× por semana"],
          ]} />
        </Card>
        <Card title="Metas Semanais" color={C.yellow}>
          <T headers={["Métrica","Meta"]} rows={[
            ["Total de carros lavados","125–175 carros/semana"],
            ["Faturamento semanal","R$ 5.600–7.000"],
            ["Novos membros Clube","2–3 por semana"],
            ["Reviews no Google","5–10 por semana"],
            ["Propostas corporativas","3–5 enviadas/semana"],
            ["Taxa retorno semanal",">30% clientes voltam"],
          ]} />
        </Card>
      </div>
 
      <Card title="Metas Mensais por Fase — BIT CAR" color={C.green}>
        <T headers={["Período","Carros/Dia","Fat. Mensal","Membros Clube","Lucro Líquido","Status"]} rows={[
          ["Mês 1","10","R$ 10.000","5","Prejuízo","🔴 Rampa — normal"],
          ["Mês 2","14","R$ 15.750","12","Equilíbrio","🟡 Atingindo PE"],
          ["Mês 3","18","R$ 20.250","20","+R$ 5.330","🟢 Lucrativo"],
          ["Mês 4","22","R$ 24.750","30","+R$ 9.555","🟢 Crescendo"],
          ["Mês 5","25","R$ 28.125","40","+R$ 12.717","🟢 Ótimo"],
          ["Mês 6","28","R$ 31.500","50","+R$ 15.890","🟢 Excelente"],
          ["Mês 12","35","R$ 43.750","80+","+R$ 25.000+","⚡ Meta anual"],
        ]} />
      </Card>
 
      <Card title="Ferramentas de Gestão Recomendadas" color={C.yellow}>
        <T headers={["Ferramenta","Uso Principal","Custo","Alternativa"]} rows={[
          ["Google Planilhas","Controle diário de caixa e OSs","Grátis","—"],
          ["Kyte / GestãoDS / InfraWash","PDV, OSs, cadastro clientes, relatórios","R$ 50–180/mês","Planilha manual"],
          ["WhatsApp Business","Comunicação, agendamento, fidelização","Grátis","—"],
          ["Canva Pro","Artes BIT CAR para Instagram (dark template)","R$ 55/mês","Canva Free"],
          ["Google Analytics + Search Console","Monitorar site e posição no Google","Grátis","—"],
          ["Conta PJ digital (Nubank/Inter)","Controle financeiro separado do pessoal","Grátis","—"],
        ]} />
      </Card>
    </div>
  );
}
 
// ─── S9 ───────────────────────────────────────────────────────────────────────
function S9() {
  return (
    <div>
      <SH n={9} title="Expansão para Estética BIT CAR" sub="Gatilhos obrigatórios antes de investir na fase 2" />
      <Alert type="danger">
        <strong>Regra fundamental:</strong> NÃO invista em estética enquanto não atingir TODOS os indicadores abaixo. Expansão prematura é a principal causa de fechamento de lava jatos.
      </Alert>
      <Card title="Indicadores de Gatilho — TODOS precisam ser verdes" color={C.orange}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {[
            { icon:"💰", label:"Faturamento", gate:"> R$ 35.000/mês", period:"Por 3 meses consecutivos", c:C.orange },
            { icon:"🏦", label:"Caixa disponível", gate:"> R$ 20.000", period:"Sem comprometer capital de giro", c:C.green },
            { icon:"🚗", label:"Clientes/Dia", gate:"> 30 carros/dia", period:"Consistente por 60 dias", c:C.yellow },
            { icon:"₿", label:"Membros Clube", gate:"> 50 membros ativos", period:"Pagando e ativos", c:C.orange },
            { icon:"📈", label:"Lucro líquido", gate:"> R$ 12.000/mês", period:"Por 2 meses consecutivos", c:C.green },
            { icon:"👥", label:"Equipe formada", gate:"4+ funcionários", period:"Treinados e autônomos", c:C.yellow },
          ].map((g,i) => (
            <div key={i} style={{ background:C.surface, borderRadius:8, padding:14,
              borderLeft:`3px solid ${g.c}`, display:"flex", alignItems:"center", gap:12, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:28 }}>{g.icon}</div>
              <div>
                <div style={{ fontWeight:800, color:C.text, fontSize:12 }}>{g.label}</div>
                <div style={{ fontWeight:900, color:g.c, fontSize:15 }}>{g.gate}</div>
                <div style={{ fontSize:10, color:C.muted }}>{g.period}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
 
      <Card title="Sequência de Expansão BIT CAR — Ordem Correta" color={C.yellow}>
        <T headers={["Ordem","Equipamento","Serviço Habilitado","Investimento","Receita Adicional"]} rows={[
          ["1ª compra","Politriz orbital profissional","Polimento simples, lustro","R$ 1.500","+R$ 2.000–4.000/mês"],
          ["2ª compra","Extratora de higienização","Higienização profunda interior","R$ 4.000","+R$ 3.000–6.000/mês"],
          ["3ª compra","Ozonizador","Eliminação de odores + ozônio","R$ 800","+R$ 1.500–2.500/mês"],
          ["4ª compra","Kit vitrificação","Vitrificação vidros + pintura","R$ 2.000","+R$ 3.000–6.000/mês"],
          ["5ª compra","Vaporizador profissional","Higienização a vapor","R$ 2.500","+R$ 2.000–4.000/mês"],
          ["Longo prazo","Cabine polimento + PPF + Wrap","Serviços premium BIT CAR","R$ 30.000+","+R$ 15.000+/mês"],
        ]} total={["TOTAL FASE ESTÉTICA (1–5)","","","R$ 10.800","+R$ 11.500–22.500/mês"]} />
      </Card>
 
      <Card title="Tabela de Preços Futuros — BIT CAR Estética" color={C.green}>
        <T headers={["Serviço","Tempo","Preço Mínimo UBL","Custo Direto","Margem"]} rows={[
          ["Polimento simples (lustro 1 etapa)","1–2h","R$ 150","R$ 20","87%"],
          ["Polimento corretivo (1 etapa)","2–3h","R$ 250","R$ 30","88%"],
          ["Polimento completo (2 etapas)","4–6h","R$ 450–600","R$ 50","89–92%"],
          ["Higienização interna completa","3–4h","R$ 200–350","R$ 40","80–89%"],
          ["Higienização + ozônio","4–5h","R$ 280–400","R$ 50","82–88%"],
          ["Vitrificação de vidros","2–3h","R$ 150–250","R$ 40","73–84%"],
          ["Vitrificação de pintura","1–2 dias","R$ 800–2.000","R$ 100","88–95%"],
          ["PPF (Proteção de Pintura)","2–5 dias","R$ 3.000–8.000","Material","60–70%"],
        ]} />
      </Card>
    </div>
  );
}
 
// ─── S10 ──────────────────────────────────────────────────────────────────────
function S10() {
  const phases = [
    { title:"FASE 1 — PRÉ-ABERTURA BIT CAR (Semanas 1–8)", color:C.orange, weeks:[
      { label:"Sem 1–2", title:"Documentação e Licenças", tasks:[
        "Registrar empresa (CNPJ) no Simples Nacional como ME no portal gov.br",
        "Requerer Alvará de Funcionamento na Prefeitura de Uberlândia (SESUC)",
        "Solicitar Licença Ambiental na SEMEA-UBL (separador de areia obrigatório)",
        "Abrir conta bancária PJ (Nubank Business, Banco Inter ou BTG Pactual)",
        "Contratar contador local especializado em pequenas empresas",
        "Assinar contrato de locação com cláusulas de proteção (reajuste IGPM, prazo mínimo)",
        "Consultar Corpo de Bombeiros sobre certificado de vistoria",
      ]},
      { label:"Sem 3–4", title:"Obras e Adequações BIT CAR", tasks:[
        "Contratar 2 pedreiros locais para reforma das boxas e sistema de drenagem",
        "Instalar canaletas + separador de areia e graxa (exigência legal SEMEA)",
        "Revestir piso das boxas com porcelanato industrial antiderrapante",
        "Instalar pontos de água reforçados (2 por boia) e elétricos 220V",
        "Construir cobertura metálica da área de secagem (telha galvalume)",
        "Pintar fachada em preto e aplicar identidade visual BIT CAR (laranja + preto)",
        "Instalar iluminação LED laranja na área de secagem e recepção",
      ]},
      { label:"Sem 5–6", title:"Equipamentos, Equipe e Digital", tasks:[
        "Pesquisar e comprar equipamentos essenciais (Mercado Livre, lojas, distribuidoras)",
        "Comprar estoque inicial de produtos para 1 mês",
        "Contratar e assinar CLT com 2 lavadores (anunciar no Indeed, Facebook, grupos)",
        "Criar WhatsApp Business BIT CAR com perfil + mensagens automáticas configuradas",
        "Criar e otimizar conta no Google Meu Negócio (BIT CAR Uberlândia)",
        "Criar perfil no Instagram + TikTok (começar bastidores da preparação)",
        "Produzir logo e identidade visual BIT CAR (designer local ou Canva)",
      ]},
      { label:"Sem 7–8", title:"Treinamento e Pré-Lançamento", tasks:[
        "Treinar equipe: protocolo de lavagem padrão BIT CAR, atendimento, emissão de OSs",
        "Realizar 20 lavagens-teste com veículos de amigos e familiares",
        "Ajustar fluxo operacional com base nos testes reais",
        "Criar site Wix BIT CAR (dark theme laranja + preto) com domínio bitcar.com.br",
        "Fotografar equipe uniformizada, espaço, equipamentos e antes/depois",
        "Publicar contagem regressiva no Instagram: '₿ Chegando em X dias'",
        "Criar campanha pré-cadastro: '50 primeiros membros do Clube BIT CAR com 20% OFF'",
      ]},
    ]},
    { title:"FASE 2 — ABERTURA E RAMPA (Semanas 9–12)", color:C.yellow, weeks:[
      { label:"Sem 9–10", title:"Abertura Soft — Boca a Boca", tasks:[
        "Abrir para amigos, família e contatos — comunicar abertura por WhatsApp pessoal",
        "Oferecer 20% OFF na primeira semana para os primeiros 50 clientes",
        "Solicitar avaliação no Google para CADA cliente satisfeito na saída",
        "Publicar 1 Reels/dia no Instagram (antes/depois — conteúdo espontâneo BIT CAR)",
        "Panfletagem em raio de 1 km: residências, comércios, empresas vizinhas",
        "Abordar 10 motoristas de app presencialmente com proposta Clube BIT CAR",
        "Ajustar preços, processos e comunicação com base no feedback real",
      ]},
      {
        label: "Sem 11–12",
        title: "Abertura Oficial BIT CAR — Lançamento Completo",
        tasks: [
          "Evento de inauguração BIT CAR: promoção especial + música + café/água para clientes",
      
        "Ativar Google Ads local (R$ 20/dia, raio 5 km, 'lava jato uberlândia')",
        "Lançar Clube BIT CAR formalmente — meta: 10 membros na semana de abertura",
        "Postar anúncio nos grupos de Uberlândia no Facebook e WhatsApp",
        "Fechar primeiro contrato corporativo (empresa ou grupo de motoristas de app)",
        "Implementar controle de caixa diário no Google Planilhas",
        "Reunião com contador: primeiros lançamentos contábeis e ajuste tributário",
      ]},
    ]},
    { title:"FASE 3 — CRESCIMENTO BIT CAR (Semanas 13–18)", color:C.green, weeks:[
      { label:"Sem 13–15", title:"Análise, Ajuste e Aceleração", tasks:[
        "Analisar KPIs reais: ticket médio, carros/dia, faturamento vs projeção",
        "Identificar gargalos: qual horário entra mais carro? Qual serviço mais vende?",
        "Ajustar escala da equipe e horários de pico conforme demanda real",
        "Meta: atingir 30+ avaliações no Google com nota >= 4,7",
        "Lançar campanha de indicação BIT CAR: 'Indique um amigo — 1 lavagem grátis'",
        "Prospectar 5 empresas com visita presencial e proposta impressa BIT CAR",
        "Revisar mix de serviços: avaliar se precisa criar pacote especial",
      ]},
      { label:"Sem 16–18", title:"Meta: Consolidar Lucratividade BIT CAR", tasks:[
        "Meta: 18–20 carros/dia estáveis — ponto de equilíbrio consolidado",
        "Lançar 2ª rodada do Clube BIT CAR — meta: 25 membros ativos",
        "Fechar parceria com condomínio ou empresa (pelo menos 1 contrato ativo)",
        "Implementar lista de espera digital via WhatsApp para horários lotados",
        "Criar vídeo profissional BIT CAR (Reels 1 min, cortes dinâmicos, dark aesthetic)",
        "Atingir 50+ avaliações no Google com nota >= 4,7",
        "Reunião com contador: análise resultado + ajuste pró-labore + reservas",
      ]},
    ]},
  ];
 
  return (
    <div>
      <SH n={10} title="Cronograma 90 Dias — BIT CAR" sub="Plano semana a semana até a lucratividade" />
      <MRow items={[
        { label:"Fase 1", value:"Sem 1–8", color:C.orange, sub:"Pré-abertura BIT CAR" },
        { label:"Fase 2", value:"Sem 9–12", color:C.yellow, sub:"Abertura + rampa" },
        { label:"Fase 3", value:"Sem 13–18", color:C.green, sub:"Crescimento" },
        { label:"Lucrativo", value:"Mês 3", color:C.green, sub:"Meta de resultado" },
      ]} />
 
      {phases.map((ph,pi) => (
        <Card key={pi} title={ph.title} color={ph.color}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
            {ph.weeks.map((wk,wi) => (
              <div key={wi} style={{ background:C.surface, borderRadius:8, padding:14,
                borderTop:`2px solid ${ph.color}`, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <Badge text={wk.label} color={ph.color} />
                </div>
                <div style={{ fontWeight:800, color:C.text, fontSize:13, marginBottom:10 }}>{wk.title}</div>
                {wk.tasks.map((t,ti) => (
                  <div key={ti} style={{ display:"flex", alignItems:"flex-start", gap:7,
                    padding:"5px 0", borderBottom: ti<wk.tasks.length-1 ? `1px solid ${C.border}` : "none",
                    fontSize:12, color:C.text }}>
                    <span style={{ color:ph.color, flexShrink:0, marginTop:1 }}>₿</span>{t}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      ))}
 
      <Card title="Licenças e Obrigações Legais — Uberlândia/MG" color={C.yellow}>
        <T headers={["Documento","Órgão","Prazo","Obs."]} rows={[
          ["CNPJ (ME ou EI)","Receita Federal — portal gov.br","Dia 1","Gratuito online"],
          ["Alvará de Funcionamento","Prefeitura UBL — SESUC","Antes de abrir","R$ 200–500 + vistoria"],
          ["Licença Ambiental de Operação","SEMEA-UBL / SUPRAM-MG","Até 30 dias da abertura","Separador de areia obrigatório"],
          ["Inscrição Municipal (ISS)","Secretaria de Finanças UBL","Na abertura","Alíquota ISS ~2%"],
          ["eSocial (ao contratar CLT)","Receita Federal — digital","Ao assinar CLT","Obrigatório para folha"],
          ["CQBM — Vistoria Bombeiros","Corpo de Bombeiros MG","Antes de abrir","Extintor + sinalização"],
        ]} />
      </Card>
    </div>
  );
}
// ─── MAIN ─────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:1, label:"Planejamento Financeiro", icon:"📊", C:S1 },
  { id:2, label:"Estrutura Inicial",       icon:"🏗️", C:S2 },
  { id:3, label:"Equipamentos",            icon:"⚙️", C:S3 },
  { id:4, label:"Marketing",               icon:"📱", C:S4 },
  { id:5, label:"Site & Digital",          icon:"🌐", C:S5 },
  { id:6, label:"Clube BIT CAR",           icon:"₿",  C:S6 },
  { id:7, label:"Clientes Corporativos",   icon:"🏢", C:S7 },
  { id:8, label:"Indicadores",             icon:"📈", C:S8 },
  { id:9, label:"Expansão",                icon:"🚀", C:S9 },
  { id:10, label:"Cronograma 90 dias",     icon:"📅", C:S10 },
];
 
export default function App() {
  const [active, setActive] = useState(1);
  const Comp = SECTIONS.find(s=>s.id===active).C;
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg,
      fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
 
      <div style={{ width:230, background:"#050505", flexShrink:0, position:"sticky",
        top:0, height:"100vh", overflowY:"auto", display:"flex", flexDirection:"column",
        borderRight:`1px solid ${C.border}`, backgroundImage:hexBg }}>
 
        <div style={{ padding:"20px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:8,
              background:`linear-gradient(135deg,${C.orange},${C.orangeHi})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, fontWeight:900, color:"#000",
              boxShadow:`0 0 16px ${C.orange}66` }}>₿</div>
            <div>
              <div style={{ fontSize:16, fontWeight:900, letterSpacing:"0.05em" }}>
                <span style={{ color:C.orange }}>BIT</span>
                <span style={{ color:C.text }}> CAR</span>
              </div>
              <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Plano de Negócios</div>
            </div>
          </div>
          <div style={{ marginTop:8, fontSize:10, color:C.subtle }}>Uberlândia/MG · 300 m² · Aluguel R$ 2.000</div>
        </div>
 
        <nav style={{ padding:"8px 0", flex:1 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={()=>setActive(s.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"10px 16px",
              background: active===s.id ? C.orange+"18" : "transparent",
              border:"none", cursor:"pointer", textAlign:"left",
              color: active===s.id ? C.orange : C.muted,
              borderLeft: active===s.id ? `2px solid ${C.orange}` : "2px solid transparent",
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:14 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:9, fontWeight:700, opacity:0.6, textTransform:"uppercase", letterSpacing:"0.08em" }}>ETAPA {s.id}</div>
                <div style={{ fontSize:12, fontWeight: active===s.id ? 800 : 400, lineHeight:1.2 }}>{s.label}</div>
              </div>
            </button>
          ))}
        </nav>
 
        <div style={{ padding:14, borderTop:`1px solid ${C.border}`,
          fontSize:9, color:C.subtle, textAlign:"center", lineHeight:1.8, letterSpacing:"0.05em" }}>
          TECNOLOGIA · CONFIANÇA · PERFORMANCE<br />
          <span style={{ color:C.orange }}>BIT CAR</span> 2025–2026
        </div>
      </div>
 
      <div style={{ flex:1, padding:"28px 32px", overflowY:"auto", maxWidth:920 }}>
        <Comp />
      </div>
    </div>
  );
}