import { describe, it, expect } from "vitest";
import { buildUtmUrl, extractUtmParams } from "@/lib/utm";

describe("Advanced UTM Builder", () => {
  it("appends standard UTM parameters to a clean URL", () => {
    const base = "https://example.com/landing";
    const built = buildUtmUrl(base, {
      source: "newsletter",
      medium: "email",
      campaign: "winter_promo",
      term: "shoes",
      content: "hero_banner",
    });

    const parsed = new URL(built);
    expect(parsed.searchParams.get("utm_source")).toBe("newsletter");
    expect(parsed.searchParams.get("utm_medium")).toBe("email");
    expect(parsed.searchParams.get("utm_campaign")).toBe("winter_promo");
    expect(parsed.searchParams.get("utm_term")).toBe("shoes");
    expect(parsed.searchParams.get("utm_content")).toBe("hero_banner");
  });

  it("preserves existing query parameters and hash fragments", () => {
    const base = "https://example.com/shop?category=electronics&discount=true#reviews";
    const built = buildUtmUrl(base, {
      source: "twitter",
      medium: "social",
    });

    const parsed = new URL(built);
    expect(parsed.searchParams.get("category")).toBe("electronics");
    expect(parsed.searchParams.get("discount")).toBe("true");
    expect(parsed.searchParams.get("utm_source")).toBe("twitter");
    expect(parsed.searchParams.get("utm_medium")).toBe("social");
    expect(parsed.hash).toBe("#reviews");
  });

  it("supports extensible custom query parameters", () => {
    const base = "https://example.com/demo";
    const built = buildUtmUrl(base, {
      source: "linkedin",
      customParams: {
        ref_id: "aff_9981",
        tier: "enterprise",
      },
    });

    const parsed = new URL(built);
    expect(parsed.searchParams.get("utm_source")).toBe("linkedin");
    expect(parsed.searchParams.get("ref_id")).toBe("aff_9981");
    expect(parsed.searchParams.get("tier")).toBe("enterprise");
  });

  it("correctly extracts existing UTM parameters", () => {
    const testUrl = "https://example.com?utm_source=youtube&utm_campaign=creator_drop";
    const extracted = extractUtmParams(testUrl);
    expect(extracted.source).toBe("youtube");
    expect(extracted.campaign).toBe("creator_drop");
    expect(extracted.medium).toBeUndefined();
  });
});
