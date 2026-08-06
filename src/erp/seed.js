// ============================================================
// SEED — Pudins da Lauren
// Um único sabor: Pudim Tradicional de Leite Condensado (Leite Moça)
// em 3 tamanhos. Dados em memória (simulam o Postgres em produção).
// ============================================================

// ---- Insumos: matéria-prima + embalagens (custos reais Pudins da Lauren) ----
export const insumos = [
  { id: "condensado", nome: "Leite condensado", cat: "Laticínio", un: "lata", custo: 6.99, estoque: 40, min: 24, max: 120 },
  { id: "leite", nome: "Leite integral", cat: "Laticínio", un: "L", custo: 5.00, estoque: 48, min: 20, max: 120 },
  { id: "ovos", nome: "Ovos (R$10 a dúzia)", cat: "Ovos", un: "un", custo: 0.83, estoque: 210, min: 120, max: 600 },
  { id: "acucar", nome: "Açúcar (massa + calda)", cat: "Secos", un: "kg", custo: 4.2, estoque: 30, min: 12, max: 80 },
  { id: "agua", nome: "Água (calda)", cat: "Outros", un: "L", custo: 0.01, estoque: 500, min: 0, max: 1000 },
  // Gás modelado como kg de botijão (13kg = R$100 → R$7,69/kg). Consumo por
  // pudim vem da fornada: 1h10 ≈ 0,29kg p/ 16 individuais → 0,0182 kg/individual.
  { id: "gas", nome: "Gás de cozinha (botijão 13kg)", cat: "Produção", un: "kg", custo: 7.69, estoque: 13, min: 3, max: 26 },
  { id: "pote_ind", nome: "Pote pudim individual", cat: "Embalagem", un: "un", custo: 1.33, estoque: 260, min: 200, max: 1200 },
  { id: "pote_med", nome: "Pote pudim médio", cat: "Embalagem", un: "un", custo: 3.90, estoque: 120, min: 80, max: 500 },
  { id: "pote_gra", nome: "Pote pudim grande", cat: "Embalagem", un: "un", custo: 7.80, estoque: 40, min: 30, max: 200 },
  { id: "rotulo", nome: "Adesivo de divulgação", cat: "Embalagem", un: "un", custo: 0.90, estoque: 800, min: 400, max: 3000 },
  // Embalagens de entrega — usadas SÓ no delivery (não entram no custo do pudim).
  { id: "emb_peq", nome: "Embalagem de entrega P (delivery)", cat: "Delivery", un: "un", custo: 1.49, estoque: 50, min: 20, max: 200 },
  { id: "emb_med", nome: "Embalagem de entrega M (delivery)", cat: "Delivery", un: "un", custo: 1.89, estoque: 40, min: 15, max: 150 },
  { id: "emb_gra", nome: "Embalagem de entrega G + laço (delivery)", cat: "Delivery", un: "un", custo: 2.83, estoque: 30, min: 10, max: 100 },
];

// ---- Produtos: 1 sabor (Leite Moça), 3 tamanhos ----
// Individual 120g R$12 (combo 2 por R$20) · Médio 300g R$28 · Grande 1kg R$79,90
export const produtos = [
  {
    id: "ind", nome: "Pudim Individual", cat: "Tradicional", sku: "PUD-IND-120",
    tamanho: "120g", emoji: "🍮", grad: "linear-gradient(135deg,#E0A45C,#F3C583)",
    preco: 12.0, promo: null, combo: "2 por R$ 20", tempo: 70, rendimento: 1, validade: 5, estoque: 30,
    // Base: 1 receita = 9 individuais (400ml leite · 1 lata condensado · 2 xíc. açúcar · 200ml água · 3 ovos)
    ficha: [
      { id: "condensado", qtd: 0.111 }, { id: "leite", qtd: 0.044 }, { id: "ovos", qtd: 0.333 },
      { id: "acucar", qtd: 0.04 }, { id: "agua", qtd: 0.022 }, { id: "gas", qtd: 0.0182 },
      { id: "pote_ind", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
  {
    id: "med", nome: "Pudim Médio", cat: "Tradicional", sku: "PUD-MED-300",
    tamanho: "300g", emoji: "🍮", grad: "linear-gradient(135deg,#C77B3B,#E0A45C)",
    preco: 28.0, promo: null, tempo: 80, rendimento: 3, validade: 5, estoque: 8,
    // 300g ≈ 2,5× a porção individual
    ficha: [
      { id: "condensado", qtd: 0.278 }, { id: "leite", qtd: 0.111 }, { id: "ovos", qtd: 0.833 },
      { id: "acucar", qtd: 0.10 }, { id: "agua", qtd: 0.056 }, { id: "gas", qtd: 0.0456 },
      { id: "pote_med", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
  {
    id: "gra", nome: "Pudim Grande", cat: "Tradicional", sku: "PUD-GRA-1000",
    tamanho: "1kg", emoji: "🍮", grad: "linear-gradient(135deg,#A85616,#C77B3B)",
    preco: 79.90, promo: null, tempo: 95, rendimento: 10, validade: 5, estoque: 4,
    // 1kg ≈ 8,3× a porção individual
    ficha: [
      { id: "condensado", qtd: 0.926 }, { id: "leite", qtd: 0.37 }, { id: "ovos", qtd: 2.78 },
      { id: "acucar", qtd: 0.333 }, { id: "agua", qtd: 0.185 }, { id: "gas", qtd: 0.1512 },
      { id: "pote_gra", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
];

// ---- Clientes (CRM) ----
export const clientes = [
  { id: "c1", nome: "Camila Andrade", tel: "(34) 99911-2211", wpp: true, aniv: "12/08", origem: "Instagram", cashback: 8.4, pontos: 240, pedidos: 7, gasto: 348, ultimo: "há 3 dias" },
  { id: "c2", nome: "Ricardo Mota", tel: "(34) 99822-3344", wpp: true, aniv: "03/02", origem: "Indicação", cashback: 3.1, pontos: 90, pedidos: 4, gasto: 172, ultimo: "há 9 dias" },
  { id: "c3", nome: "Fernanda Lopes", tel: "(34) 99733-1122", wpp: false, aniv: "27/11", origem: "Google", cashback: 0.6, pontos: 24, pedidos: 1, gasto: 25, ultimo: "há 41 dias" },
  { id: "c4", nome: "João Pereira", tel: "(34) 99644-5566", wpp: true, aniv: "15/05", origem: "Fachada", cashback: 1.8, pontos: 55, pedidos: 3, gasto: 108, ultimo: "há 22 dias" },
  { id: "c5", nome: "Beatriz Nunes", tel: "(34) 99555-7788", wpp: true, aniv: "30/09", origem: "Instagram", cashback: 0, pontos: 0, pedidos: 0, gasto: 0, ultimo: "—" },
];

// ---- Fornecedores (Compras) ----
export const fornecedores = [
  { id: "f1", nome: "Distribuidora Nestlé (Leite Moça)", cat: "Laticínio", prazo: 12, nota: 4.8 },
  { id: "f2", nome: "Laticínios Vale Verde", cat: "Laticínio", prazo: 7, nota: 4.6 },
  { id: "f3", nome: "Granja Ovo Bom", cat: "Ovos", prazo: 3, nota: 4.9 },
  { id: "f4", nome: "Embalagens PrintPack", cat: "Embalagem", prazo: 7, nota: 4.7 },
  { id: "f5", nome: "Distribuidora Doce Real", cat: "Secos", prazo: 15, nota: 4.4 },
];

// ---- Pedidos ----
export const pedidos = [
  { id: 1042, clienteId: "c1", canal: "WhatsApp", status: "Produção", pagamento: "PIX", itens: [{ id: "ind", qtd: 6 }], obs: "Retirar 18h", criado: "hoje 09:12" },
  { id: 1043, clienteId: "c2", canal: "Site", status: "Novo", pagamento: "Pendente", itens: [{ id: "med", qtd: 1 }, { id: "ind", qtd: 4 }], obs: "", criado: "hoje 10:05" },
  { id: 1041, clienteId: "c4", canal: "Delivery", status: "Pronto", pagamento: "Cartão", itens: [{ id: "gra", qtd: 1 }], obs: "Entregar até 12h", criado: "hoje 08:40" },
  { id: 1040, clienteId: "c1", canal: "Balcão", status: "Entregue", pagamento: "Dinheiro", itens: [{ id: "ind", qtd: 4 }], obs: "", criado: "hoje 08:02" },
];

// ---- Ordens de produção (PCP) ----
export const ordens = [
  { id: 5012, produtoId: "ind", qtd: 6, status: "Produzindo", lote: "L-2607A", pedidoId: 1042 },
  { id: 5013, produtoId: "med", qtd: 3, status: "Fila", lote: "L-2607B", pedidoId: null },
  { id: 5011, produtoId: "gra", qtd: 1, status: "Pronto", lote: "L-2607C", pedidoId: 1041 },
];

// ---- Financeiro (contas a pagar/receber) ----
export const financeiro = [
  { id: "l1", tipo: "receita", cat: "Vendas", desc: "Pedido #1040 — Camila", valor: 48.0, status: "pago", venc: "hoje", origem: "Pedidos" },
  { id: "l2", tipo: "receita", cat: "Vendas", desc: "Pedido #1041 — João", valor: 79.90, status: "aberto", venc: "hoje", origem: "Pedidos" },
  { id: "l3", tipo: "despesa", cat: "Matéria-prima", desc: "NF Leite Moça (Nestlé)", valor: 260.0, status: "aberto", venc: "30/07", origem: "Compras" },
  { id: "l4", tipo: "despesa", cat: "Folha", desc: "Adiantamento produção", valor: 600.0, status: "pago", venc: "hoje", origem: "RH" },
  { id: "l5", tipo: "despesa", cat: "Fixas", desc: "Energia + gás", valor: 480.0, status: "aberto", venc: "05/08", origem: "Fixas" },
];

// ---- Entregadores (Delivery) ----
export const entregadores = [
  { id: "e1", nome: "Marcos Silva", veiculo: "Moto Honda CG", status: "Em rota", entregas: 3 },
  { id: "e2", nome: "Paula Reis", veiculo: "Moto Yamaha", status: "Disponível", entregas: 0 },
];

// vendas dos últimos 7 dias (para gráficos do dashboard)
export const serieVendas = [420, 360, 510, 680, 540, 920, 780];
