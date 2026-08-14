// Helpers de formatação e utilidades puras (camada compartilhada)

export const brl = (v) =>
  (v < 0 ? "-R$ " : "R$ ") +
  Math.abs(Number(v) || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const pct = (v, casas = 1) =>
  `${((Number(v) || 0) * 100).toFixed(casas)}%`;

export const num = (v) => (Number(v) || 0).toLocaleString("pt-BR");

export const uid = () => Math.random().toString(36).slice(2, 9);

// WhatsApp da loja (Pudins da Lauren) e gerador de link com mensagem pronta.
export const WPP_LOJA = "5534984432000"; // (34) 98443-2000
export const waLink = (texto, numero = WPP_LOJA) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

// Monta a mensagem de um pedido para o WhatsApp.
export const msgPedido = ({ produtos, itens, total, canal, cliente, extra, numero, precoLinha }) => {
  const linhas = itens.map((it) => {
    const p = produtos.find((x) => x.id === it.id);
    const sub = precoLinha ? precoLinha(p, it.qtd) : (p ? (p.promo || p.preco) * it.qtd : 0);
    return `• ${it.qtd}× ${p ? p.nome : "item"} — ${brl(sub)}`;
  });
  return [
    "🍮 *Pudins da Lauren — Pedido*",
    numero ? `🧾 Pedido *#${numero}*` : null,
    cliente ? `👤 ${cliente}` : null,
    canal ? `🛒 Canal: ${canal}` : null,
    "",
    ...linhas,
    "",
    `💰 *Total: ${brl(total)}*`,
    extra || null,
  ].filter((l) => l !== null).join("\n");
};

export const hoje = () =>
  new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

// classificação RFM simplificada de clientes
export const classificar = (pedidos, gasto) => {
  if (pedidos >= 8 || gasto >= 500) return { label: "VIP", cls: "t-org" };
  if (pedidos >= 4 || gasto >= 200) return { label: "Fiel", cls: "t-grn" };
  if (pedidos >= 1) return { label: "Ativo", cls: "t-blu" };
  return { label: "Novo", cls: "t-mut" };
};
