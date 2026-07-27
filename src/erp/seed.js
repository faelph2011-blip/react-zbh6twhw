// ============================================================
// SEED — dados iniciais (em memória).
// Em produção este estado vive no PostgreSQL via Prisma;
// aqui ele simula o domínio para o protótipo funcional.
// Todos os módulos leem/escrevem sobre estas coleções.
// ============================================================

// ---- Insumos: matéria-prima + embalagens ----
// custo é sempre pela unidade base (L, kg, un...)
export const insumos = [
  { id: "leite", nome: "Leite integral", cat: "Laticínio", un: "L", custo: 4.5, estoque: 48, min: 20, max: 120 },
  { id: "condensado", nome: "Leite condensado", cat: "Laticínio", un: "lata", custo: 7.9, estoque: 36, min: 24, max: 100 },
  { id: "creme", nome: "Creme de leite", cat: "Laticínio", un: "cx", custo: 3.4, estoque: 22, min: 15, max: 80 },
  { id: "ovos", nome: "Ovos", cat: "Ovos", un: "un", custo: 0.72, estoque: 210, min: 120, max: 600 },
  { id: "acucar", nome: "Açúcar refinado", cat: "Secos", un: "kg", custo: 4.2, estoque: 40, min: 15, max: 90 },
  { id: "chocolate", nome: "Chocolate 50%", cat: "Secos", un: "kg", custo: 38.0, estoque: 6, min: 8, max: 30 },
  { id: "coco", nome: "Coco ralado", cat: "Secos", un: "kg", custo: 22.0, estoque: 9, min: 5, max: 25 },
  { id: "baunilha", nome: "Essência de baunilha", cat: "Aromas", un: "ml", custo: 0.18, estoque: 900, min: 300, max: 2000 },
  { id: "pote500", nome: "Pote 500ml + tampa", cat: "Embalagem", un: "un", custo: 1.35, estoque: 320, min: 200, max: 1000 },
  { id: "pote_ind", nome: "Pote individual 120ml", cat: "Embalagem", un: "un", custo: 0.65, estoque: 140, min: 250, max: 1200 },
  { id: "rotulo", nome: "Rótulo adesivo", cat: "Embalagem", un: "un", custo: 0.22, estoque: 800, min: 400, max: 3000 },
];

// ---- Produtos acabados com ficha técnica (engenharia do produto) ----
export const produtos = [
  {
    id: "trad2l", nome: "Pudim Tradicional 2L", cat: "Tradicional", sku: "PUD-TRAD-2L",
    emoji: "🍮", grad: "linear-gradient(135deg,#C77B3B,#F3B664)",
    preco: 68.0, promo: null, tempo: 90, rendimento: 16, validade: 5, estoque: 6,
    ficha: [
      { id: "leite", qtd: 2 }, { id: "condensado", qtd: 1 }, { id: "ovos", qtd: 8 },
      { id: "acucar", qtd: 0.6 }, { id: "baunilha", qtd: 8 }, { id: "pote500", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
  {
    id: "choc2l", nome: "Pudim de Chocolate 2L", cat: "Especial", sku: "PUD-CHOC-2L",
    emoji: "🍫", grad: "linear-gradient(135deg,#5A3A2E,#A9663B)",
    preco: 82.0, promo: 74.0, tempo: 100, rendimento: 16, validade: 5, estoque: 3,
    ficha: [
      { id: "leite", qtd: 2 }, { id: "condensado", qtd: 1 }, { id: "creme", qtd: 1 },
      { id: "ovos", qtd: 8 }, { id: "acucar", qtd: 0.5 }, { id: "chocolate", qtd: 0.3 },
      { id: "pote500", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
  {
    id: "coco2l", nome: "Pudim de Coco 2L", cat: "Especial", sku: "PUD-COCO-2L",
    emoji: "🥥", grad: "linear-gradient(135deg,#8A8A7A,#E8E2D0)",
    preco: 78.0, promo: null, tempo: 95, rendimento: 16, validade: 4, estoque: 4,
    ficha: [
      { id: "leite", qtd: 1.8 }, { id: "condensado", qtd: 1 }, { id: "creme", qtd: 1 },
      { id: "ovos", qtd: 7 }, { id: "acucar", qtd: 0.5 }, { id: "coco", qtd: 0.2 },
      { id: "pote500", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
  {
    id: "ind_trad", nome: "Pudim Individual Tradicional", cat: "Individual", sku: "PUD-TRAD-IND",
    emoji: "🍮", grad: "linear-gradient(135deg,#D98E4B,#FFD79A)",
    preco: 9.5, promo: null, tempo: 45, rendimento: 1, validade: 4, estoque: 28,
    ficha: [
      { id: "leite", qtd: 0.15 }, { id: "condensado", qtd: 0.1 }, { id: "ovos", qtd: 0.6 },
      { id: "acucar", qtd: 0.04 }, { id: "baunilha", qtd: 0.6 }, { id: "pote_ind", qtd: 1 }, { id: "rotulo", qtd: 1 },
    ],
  },
];

// ---- Clientes (CRM) ----
export const clientes = [
  { id: "c1", nome: "Camila Andrade", tel: "(34) 99911-2211", wpp: true, aniv: "12/08", origem: "Instagram", cashback: 12.4, pontos: 340, pedidos: 9, gasto: 612, ultimo: "há 3 dias" },
  { id: "c2", nome: "Ricardo Mota", tel: "(34) 99822-3344", wpp: true, aniv: "03/02", origem: "Indicação", cashback: 4.1, pontos: 120, pedidos: 4, gasto: 236, ultimo: "há 9 dias" },
  { id: "c3", nome: "Fernanda Lopes", tel: "(34) 99733-1122", wpp: false, aniv: "27/11", origem: "Google", cashback: 0.9, pontos: 40, pedidos: 1, gasto: 68, ultimo: "há 41 dias" },
  { id: "c4", nome: "João Pereira", tel: "(34) 99644-5566", wpp: true, aniv: "15/05", origem: "Fachada", cashback: 2.3, pontos: 90, pedidos: 3, gasto: 198, ultimo: "há 22 dias" },
  { id: "c5", nome: "Beatriz Nunes", tel: "(34) 99555-7788", wpp: true, aniv: "30/09", origem: "Site", cashback: 0, pontos: 0, pedidos: 0, gasto: 0, ultimo: "—" },
];

// ---- Fornecedores (Compras) ----
export const fornecedores = [
  { id: "f1", nome: "Laticínios Vale Verde", cat: "Laticínio", prazo: 14, nota: 4.7 },
  { id: "f2", nome: "Distribuidora Doce Real", cat: "Secos", prazo: 21, nota: 4.4 },
  { id: "f3", nome: "Embalagens PrintPack", cat: "Embalagem", prazo: 7, nota: 4.8 },
  { id: "f4", nome: "Granja Ovo Bom", cat: "Ovos", prazo: 3, nota: 4.9 },
];

// ---- Pedidos ----
export const pedidos = [
  { id: 1042, clienteId: "c1", canal: "WhatsApp", status: "Produção", pagamento: "PIX", itens: [{ id: "trad2l", qtd: 2 }], obs: "Festa família — retirar 18h", criado: "hoje 09:12" },
  { id: 1043, clienteId: "c2", canal: "Site", status: "Novo", pagamento: "Pendente", itens: [{ id: "choc2l", qtd: 1 }, { id: "ind_trad", qtd: 6 }], obs: "", criado: "hoje 10:05" },
  { id: 1041, clienteId: "c4", canal: "Delivery", status: "Pronto", pagamento: "Cartão", itens: [{ id: "coco2l", qtd: 1 }], obs: "Entregar até 12h", criado: "hoje 08:40" },
  { id: 1040, clienteId: "c1", canal: "Balcão", status: "Entregue", pagamento: "Dinheiro", itens: [{ id: "ind_trad", qtd: 4 }], obs: "", criado: "hoje 08:02" },
];

// ---- Ordens de produção (PCP) ----
export const ordens = [
  { id: 5012, produtoId: "trad2l", qtd: 2, status: "Produzindo", lote: "L-2607A", pedidoId: 1042 },
  { id: 5013, produtoId: "ind_trad", qtd: 12, status: "Fila", lote: "L-2607B", pedidoId: null },
  { id: 5011, produtoId: "coco2l", qtd: 1, status: "Pronto", lote: "L-2607C", pedidoId: 1041 },
];

// ---- Financeiro (contas a pagar/receber) ----
export const financeiro = [
  { id: "l1", tipo: "receita", cat: "Vendas", desc: "Pedido #1040 — Camila", valor: 38.0, status: "pago", venc: "hoje", origem: "Pedidos" },
  { id: "l2", tipo: "receita", cat: "Vendas", desc: "Pedido #1041 — João", valor: 78.0, status: "aberto", venc: "hoje", origem: "Pedidos" },
  { id: "l3", tipo: "despesa", cat: "Matéria-prima", desc: "NF Laticínios Vale Verde", valor: 420.0, status: "aberto", venc: "30/07", origem: "Compras" },
  { id: "l4", tipo: "despesa", cat: "Folha", desc: "Adiantamento produção", valor: 800.0, status: "pago", venc: "hoje", origem: "RH" },
  { id: "l5", tipo: "despesa", cat: "Fixas", desc: "Energia + gás", valor: 610.0, status: "aberto", venc: "05/08", origem: "Fixas" },
];

// ---- Entregadores (Delivery) ----
export const entregadores = [
  { id: "e1", nome: "Marcos Silva", veiculo: "Moto Honda CG", status: "Em rota", entregas: 3 },
  { id: "e2", nome: "Paula Reis", veiculo: "Moto Yamaha", status: "Disponível", entregas: 0 },
];

// vendas dos últimos 7 dias (para gráficos do dashboard)
export const serieVendas = [820, 640, 910, 1180, 760, 1420, 1290];
