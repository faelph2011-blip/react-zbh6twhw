// PIX "Copia e Cola" (payload EMV do Banco Central) + geração do QR Code.
// A chave PIX é pública por natureza — ela existe para receber pagamentos.
import qrcode from "qrcode-generator";

// Dados de recebimento da conta (Nubank / NU PAGAMENTOS).
export const PIX = {
  chave: "e3c2e1f3-c052-4a0a-b819-7e0042cbf98d", // chave aleatória (EVP)
  nome: "PUDINS DA LAUREN",                       // máx. 25 caracteres, sem acento
  cidade: "SAO PAULO",                            // máx. 15 caracteres, sem acento
  titular: "Raphael Marques do Carmo",
  banco: "Nubank (NU Pagamentos)",
};

// Remove acentos e limita o tamanho (o padrão EMV só aceita ASCII).
function ascii(str, max) {
  const s = (str || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7e]/g, "")
    .toUpperCase();
  return max ? s.slice(0, max) : s;
}

// Campo no formato EMV: ID + tamanho(2 dígitos) + valor.
function campo(id, valor) {
  const len = String(valor.length).padStart(2, "0");
  return `${id}${len}${valor}`;
}

// CRC16-CCITT (polinômio 0x1021) exigido no final do payload.
function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Monta o código "Copia e Cola" (BR Code estático) já com o valor do pedido.
export function pixCopiaCola({ valor, txid = "***" } = {}) {
  const mai = campo("00", "br.gov.bcb.pix") + campo("01", PIX.chave);
  const adicional = campo("05", ascii(txid, 25) || "***");
  let p =
    campo("00", "01") + // versão do payload
    campo("26", mai) + // conta PIX (GUI + chave)
    campo("52", "0000") + // categoria do estabelecimento
    campo("53", "986"); // moeda: BRL
  if (valor != null && Number(valor) > 0) p += campo("54", Number(valor).toFixed(2));
  p +=
    campo("58", "BR") + // país
    campo("59", ascii(PIX.nome, 25)) + // nome do recebedor
    campo("60", ascii(PIX.cidade, 15)) + // cidade
    campo("62", adicional); // dados adicionais (txid)
  p += "6304"; // marcador do CRC
  return p + crc16(p);
}

// Gera o QR Code do payload como data URL (imagem), sem depender da internet.
export function pixQrDataUrl(payload, cell = 5) {
  const qr = qrcode(0, "M"); // versão automática, correção média
  qr.addData(payload);
  qr.make();
  return qr.createDataURL(cell, 12);
}
