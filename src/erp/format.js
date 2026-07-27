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

export const hoje = () =>
  new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

// classificação RFM simplificada de clientes
export const classificar = (pedidos, gasto) => {
  if (pedidos >= 8 || gasto >= 500) return { label: "VIP", cls: "t-org" };
  if (pedidos >= 4 || gasto >= 200) return { label: "Fiel", cls: "t-grn" };
  if (pedidos >= 1) return { label: "Ativo", cls: "t-blu" };
  return { label: "Novo", cls: "t-mut" };
};
