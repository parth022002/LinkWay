export interface ParsedClientContext {
  deviceClass: "Desktop" | "Mobile" | "Tablet" | "Bot";
  browserFamily: string;
  osFamily: string;
  referrerHost: string;
  countryCode: string;
  isBot: boolean;
}

export function parseClientContext(
  userAgentHeader: string | null,
  refererHeader: string | null,
  countryHeader: string | null
): ParsedClientContext {
  const ua = (userAgentHeader || "").toLowerCase();

  // 1. Bot detection
  const botKeywords = [
    "bot",
    "spider",
    "crawl",
    "slurp",
    "facebookexternalhit",
    "whatsapp",
    "slackbot",
    "telegrambot",
    "twitterbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "pinterest",
  ];
  const isBot = botKeywords.some((k) => ua.includes(k));

  // 2. Device classification
  let deviceClass: "Desktop" | "Mobile" | "Tablet" | "Bot" = "Desktop";
  if (isBot) {
    deviceClass = "Bot";
  } else if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(ua)) {
    deviceClass = "Tablet";
  } else if (/mobi|iphone|ipod|phone|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceClass = "Mobile";
  }

  // 3. Browser detection
  let browserFamily = "Other";
  if (isBot) {
    browserFamily = "Crawler / Preview";
  } else if (ua.includes("edg/")) {
    browserFamily = "Edge";
  } else if (ua.includes("chrome/") && !ua.includes("edg/")) {
    browserFamily = "Chrome";
  } else if (ua.includes("safari/") && !ua.includes("chrome/")) {
    browserFamily = "Safari";
  } else if (ua.includes("firefox/")) {
    browserFamily = "Firefox";
  } else if (ua.includes("opr/") || ua.includes("opera/")) {
    browserFamily = "Opera";
  }

  // 4. OS detection
  let osFamily = "Other";
  if (ua.includes("windows")) {
    osFamily = "Windows";
  } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    osFamily = "iOS";
  } else if (ua.includes("mac os")) {
    osFamily = "macOS";
  } else if (ua.includes("android")) {
    osFamily = "Android";
  } else if (ua.includes("linux")) {
    osFamily = "Linux";
  }

  // 5. Referrer host
  let referrerHost = "Direct / None";
  if (refererHeader) {
    try {
      const parsed = new URL(refererHeader);
      referrerHost = parsed.hostname.replace(/^www\./, "");
    } catch {
      referrerHost = "Direct / None";
    }
  }

  // 6. Country code
  const countryCode = (countryHeader || "").toUpperCase().slice(0, 2) || "Unknown";

  return {
    deviceClass,
    browserFamily,
    osFamily,
    referrerHost,
    countryCode,
    isBot,
  };
}
