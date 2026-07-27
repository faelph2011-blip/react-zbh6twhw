# 🍮 PudimERP

ERP SaaS especializado em **produção, gestão e venda de pudins** — do insumo à entrega,
com todos os módulos integrados em tempo real.

Protótipo funcional em **React**, com um núcleo de domínio vivo onde as ações realmente
repercutem entre os módulos: um pedido gera recebível → vira ordem de produção → a produção
**baixa insumos e gera estoque** → a entrega **liquida o caixa e credita cashback** → o
Dashboard, o DRE e a IA se recalculam.

## Módulos

Dashboard Executivo · Pedidos (multicanal) · Produção/PCP (Kanban por lote) · Estoque (Curva ABC) ·
Compras · Produtos · Engenharia (ficha técnica com custo por fatia) · CRM & Fidelidade (RFM/cashback) ·
Delivery · **Loja Virtual premium** (hero 3D, caramelo escorrendo, glassmorphism) · Financeiro (DRE) ·
IA & BI (previsão, churn, CAC/LTV/ROAS).

## Recursos

- 🎨 Design System próprio com **tema claro/escuro** persistido
- 🔗 Módulos integrados sobre um único Service Layer (`src/erp/store.js`)
- 💾 Persistência em `localStorage` (botão *Resetar dados* restaura a demo)
- 📱 Responsivo · ♿ acessível · ⚡ build de produção validado

## Rodando

```bash
npm install
npm start        # http://localhost:3000
npm run build    # build de produção
```

## Estrutura

```
src/
├─ erp/        Design System, domínio (store), utilidades
├─ modules/    Um arquivo por módulo de negócio
└─ App.js      Shell + navegação
docs/ARQUITETURA.md   Arquitetura, requisitos, MER/DER, sprints, deploy
```

Veja **[docs/ARQUITETURA.md](docs/ARQUITETURA.md)** para a visão completa do produto e o roadmap
(backend NestJS, multi-tenant, pagamentos, mobile, IA).
