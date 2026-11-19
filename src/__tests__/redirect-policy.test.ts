import { describe, it, expect } from "vitest";
import { parseClientContext } from "@/lib/analytics";

describe("Client Context & Analytics Parser", () => {
  it("detects mobile devices from iPhone user agent", () => {
    const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
    const res = parseClientContext(ua, "https://twitter.com/t.co/xyz", "US");

    expect(res.deviceClass).toBe("Mobile");
    expect(res.browserFamily).toBe("Safari");
    expect(res.osFamily).toBe("iOS");
    expect(res.referrerHost).toBe("twitter.com");
    expect(res.countryCode).toBe("US");
    expect(res.isBot).toBe(false);
  });

  it("identifies search crawlers and previews as bots", () => {
    const ua = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    const res = parseClientContext(ua, null, null);

    expect(res.deviceClass).toBe("Bot");
    expect(res.isBot).toBe(true);
    expect(res.browserFamily).toBe("Crawler / Preview");
    expect(res.referrerHost).toBe("Direct / None");
  });

  it("handles desktop Chrome on Windows", () => {
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const res = parseClientContext(ua, "https://www.linkedin.com/feed/", "IN");

    expect(res.deviceClass).toBe("Desktop");
    expect(res.browserFamily).toBe("Chrome");
    expect(res.osFamily).toBe("Windows");
    expect(res.referrerHost).toBe("linkedin.com");
    expect(res.countryCode).toBe("IN");
  });
});
