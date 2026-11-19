import { describe, it, expect } from "vitest";
import { generateQrSvg, generateQrPngDataUrl } from "@/lib/qr";

describe("QR Identity Generator", () => {
  const canonicalUrl = "https://linkway.io/r/demo2026";

  it("generates a valid SVG string containing <svg tag", async () => {
    const svg = await generateQrSvg(canonicalUrl);
    expect(svg).toBeDefined();
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("</svg>");
  });

  it("generates a valid Base64 PNG data URL", async () => {
    const png = await generateQrPngDataUrl(canonicalUrl);
    expect(png).toBeDefined();
    expect(png.startsWith("data:image/png;base64,")).toBe(true);
  });
});
