import QRCode from "qrcode";

export interface QROptions {
  margin?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Generates an SVG string representation of the QR code for a canonical short URL.
 */
export async function generateQrSvg(
  canonicalUrl: string,
  options: QROptions = {}
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToStringOptions = {
    type: "svg",
    margin: options.margin ?? 2,
    width: options.width ?? 320,
    color: {
      dark: options.color?.dark ?? "#0B1430", // LW Navy
      light: options.color?.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
  };

  return QRCode.toString(canonicalUrl, defaultOptions);
}

/**
 * Generates a Data URL (base64 PNG) representation of the QR code for a canonical short URL.
 */
export async function generateQrPngDataUrl(
  canonicalUrl: string,
  options: QROptions = {}
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    margin: options.margin ?? 2,
    width: options.width ?? 512,
    color: {
      dark: options.color?.dark ?? "#0B1430",
      light: options.color?.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
  };

  return QRCode.toDataURL(canonicalUrl, defaultOptions);
}
