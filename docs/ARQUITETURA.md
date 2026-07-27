# PudimERP — Arquitetura & Planejamento

ERP SaaS especializado em **produção e venda de pudins**, projetado para escalar de 1 a
milhares de confeitarias (multiempresa / multiunidade / franquias). Este documento reúne
os artefatos de planejamento pedidos no briefing. O que já está **implementado** neste
repositório é um **protótipo funcional e integrado** da camada de apresentação (React), com
um núcleo de domínio real onde todos os módulos conversam entre si.

---

## 1. Escopo entregue vs. visão completa

| Camada | Visão de produto (SaaS final) | Entregue neste repositório |
|---|---|---|
| Frontend | Next.js + TS + Tailwind + Framer Motion + Three.js | **React (CRA), Design System próprio, 12 módulos integrados, storefront animado, dark/light** ✅ |
| Backend | NestJS + REST/GraphQL, DDD, filas, cache | Regras de negócio simuladas no `store.js` (Service Layer) ✅ contrato pronto p/ portar |
| Banco | PostgreSQL + Prisma, views, triggers | **MER/DER documentados abaixo**; seed em memória + `localStorage` |
| Infra | Docker, AWS, Vercel, Cloudflare, Redis | Roadmap (seção 9) |
| Mobile | Apps Android/iOS | Roadmap — camada de domínio reutilizável por React Native |
| IA | Modelos de previsão/churn | **Heurísticas sobre dados reais** (média móvel, RFM, ABC) — plugável a ML ✅ |

> Decisão de engenharia: em vez de simular telas estáticas, o protótipo implementa um
> **domínio vivo**. Criar um pedido gera recebível → enviar para produção cria ordens →
> concluir a produção **baixa insumos e gera estoque** → entregar **liquida o caixa e credita
> cashback**. É esse encadeamento que valida a modelagem antes de investir no backend.

---

## 2. Arquitetura de software

Clean Architecture + DDD, com fronteiras claras (as pastas espelham as camadas):

```
src/
├─ erp/
│  ├─ seed.js      → Dados iniciais (substituídos pelo Postgres em produção)
│  ├─ store.js     → NÚCLEO DE DOMÍNIO + Service Layer (regras de negócio integradas)
│  ├─ format.js    → Utilidades puras (formatação, RFM)
│  ├─ theme.js     → Design System (tokens, dark/light)
│  └─ ui.js        → UI Kit reutilizável (Card, KPI, Modal, gráficos SVG…)
├─ modules/        → Bounded contexts (1 arquivo por módulo de negócio)
└─ App.js          → Shell / roteamento / composição
```

**Padrões aplicados:** Service Layer (`useERP`), Repository-ready (coleções isoláveis),
seletores/BI derivados (`useKPIs` — CQRS leve de leitura), componentes desacoplados,
SOLID (cada módulo depende de abstrações via props `erp`/`k`/`go`).

Em produção os *bounded contexts* viram módulos NestJS; o `store.js` é o contrato de casos
de uso que será portado para *use cases* + repositórios Prisma sem reescrever a UI.

---

## 3. Módulos (bounded contexts)

1. **Dashboard Executivo** — KPIs, fluxo de caixa, ranking, composição, alertas, trilha de eventos.
2. **Pedidos** — Balcão/WhatsApp/Site/Delivery, status, integra produção + estoque + financeiro.
3. **Produção (PCP)** — Ordens por lote (Kanban), consumo de insumos, eficiência/perdas.
4. **Estoque** — Insumos, embalagens, acabados, mínimos, **Curva ABC**, reposição.
5. **Compras** — Fornecedores, ranking, recebimento → gera pagável.
6. **Produtos** — Catálogo, SKU, preço/promo/custo/margem, validade.
7. **Engenharia do Produto** — Ficha técnica com custo por receita/unidade/**fatia** e margem.
8. **CRM & Fidelidade** — Base única, **RFM**, cashback, pontos, aniversariantes.
9. **Delivery** — Entregadores, rotas, taxa, tempo estimado.
10. **Loja Virtual** — Vitrine premium (hero 3D, caramelo escorrendo, tilt, glassmorphism); pedidos caem no ERP.
11. **Financeiro** — Contas a pagar/receber, **DRE**, mix de pagamento, margem líquida.
12. **IA & BI** — Previsão de vendas, quanto produzir, quando comprar, churn, produtos rentáveis, CAC/LTV/ROAS.

---

## 4. Requisitos

**Funcionais (amostra):** RF01 cadastrar produto com ficha técnica · RF02 calcular custo/margem
automaticamente · RF03 pedido multicanal · RF04 gerar OP a partir do pedido · RF05 baixar insumos
na produção · RF06 controlar estoque com mínimos e ABC · RF07 lançar recebíveis/pagáveis · RF08 DRE ·
RF09 cashback/fidelidade · RF10 recomendações de IA.

**Não funcionais:** desempenho (render < 100 ms/módulo) · escalabilidade multiempresa ·
segurança (JWT, 2FA, RBAC, LGPD) · disponibilidade · acessibilidade · responsividade · observabilidade.

---

## 5. Casos de uso / Jornada (fluxo integrado real)

```
Cliente compra na Loja  ──▶  Pedido (canal Site, recebível "aberto")
      │
      ▼  enviar para produção
Ordem de Produção (Fila ▶ Produzindo ▶ Pronto)
      │  ao concluir: baixa insumos (ficha × qtd) + entra no estoque de acabados
      ▼  entregar
Estoque de acabados −qtd  ·  Caixa +total  ·  Cliente +cashback +pontos +histórico
      │
      ▼
Dashboard / DRE / IA recalculados em tempo real
```

---

## 6. Modelagem de dados (MER / DER)

**Entidades principais e relacionamentos:**

```
CLIENTE 1───N PEDIDO N───N PRODUTO        (via ITEM_PEDIDO)
PRODUTO 1───N FICHA_TECNICA N───1 INSUMO  (engenharia do produto)
PEDIDO  1───N ORDEM_PRODUCAO 1───1 PRODUTO
INSUMO  N───1 FORNECEDOR                  (categoria)
PEDIDO  1───N LANCAMENTO_FINANCEIRO       (receita)
COMPRA  1───N LANCAMENTO_FINANCEIRO       (despesa)
PEDIDO  N───1 ENTREGADOR                  (delivery)
EMPRESA 1───N (todas as entidades)        (multi-tenant)
```

**Chaves/índices sugeridos (Postgres):** `pedido(empresa_id, status)`,
`insumo(empresa_id, estoque)`, `lancamento(empresa_id, tipo, status, venc)`,
`item_pedido(pedido_id)`. **Views:** `vw_dre`, `vw_curva_abc`, `vw_ranking_produtos`.
**Triggers:** baixa de estoque ao concluir OP; geração de recebível ao criar pedido.

---

## 7. Design System

Tokens CSS (`--brand`, `--surface`, `--line`…), tema **dark/light** persistido, tipografia
`Space Grotesk` + `Inter`, componentes reutilizáveis (Card, KPI, Tag, Btn, Bar, Modal,
Sparkbars, Donut), responsivo (sidebar colapsa < 720px), microinterações e animações premium.

---

## 8. Plano de sprints (backlog priorizado)

- **S0 (feito)** — Design System, domínio integrado, 12 módulos, storefront, dark/light.
- **S1** — Backend NestJS + Prisma + Postgres; portar `store.js` para use cases; auth JWT + RBAC.
- **S2** — Multi-tenant, LGPD, backups, logs/auditoria.
- **S3** — Gateway de pagamento (PIX/cartão) real, WhatsApp API, e-mail/SMS marketing.
- **S4** — App mobile (React Native) reaproveitando o domínio.
- **S5** — IA real (previsão de demanda, churn) + 100+ relatórios (PDF/Excel).

---

## 9. Testes & Deploy

**Testes:** unitários das regras do domínio (custo, margem, DRE, ABC), integração dos fluxos
(pedido→produção→estoque→caixa), e2e (Playwright — já usado no smoke test), acessibilidade.
**Deploy:** Vercel (front) + AWS ECS/RDS (back) + Redis (cache/filas) + Cloudflare (CDN/WAF),
CI/CD com build + lint + testes por PR. Build de produção validado: `npm run build` ✅.

---

## 10. Como rodar

```bash
npm install
npm start            # desenvolvimento (http://localhost:3000)
npm run build        # build de produção
```

Os dados vivem em memória + `localStorage`. Use **“Resetar dados”** na barra lateral para
restaurar a demonstração.
