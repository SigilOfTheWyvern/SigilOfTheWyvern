import QRCode from "qrcode";

export async function ticketQr(code: string) {
  return QRCode.toDataURL(`SOTW:${code}`, {
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#e11d26", light: "#070707" },
    width: 220,
  });
}
