import { z } from "zod";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // Cloud metadata service
  "metadata.google.internal",
  "instance-data",
]);

function isPrivateIpOrHost(hostname: string): boolean {
  const lower = hostname.toLowerCase().trim();
  if (BLOCKED_HOSTNAMES.has(lower)) return true;

  // Check IPv4 private and link-local ranges
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const [, a, b] = match.map(Number);
    if (a === 127) return true; // Loopback
    if (a === 10) return true; // Class A private
    if (a === 172 && b >= 16 && b <= 31) return true; // Class B private
    if (a === 192 && b === 168) return true; // Class C private
    if (a === 169 && b === 254) return true; // Link-local
    if (a === 0) return true; // Current network
  }

  // Block local domains
  if (lower.endsWith(".local") || lower.endsWith(".internal") || lower.endsWith(".localhost")) {
    return true;
  }

  return false;
}

export const destinationUrlSchema = z
  .string()
  .trim()
  .min(1, "Destination URL is required.")
  .max(2048, "Destination URL cannot exceed 2048 characters.")
  .superRefine((val, ctx) => {
    let parsed: URL;
    try {
      parsed = new URL(val);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid destination URL format.",
      });
      return;
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only standard HTTP and HTTPS destinations are permitted.",
      });
    }

    if (parsed.username || parsed.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URLs with embedded credentials (user:pass) are prohibited.",
      });
    }

    if (isPrivateIpOrHost(parsed.hostname)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Restricted destination: Localhost and internal private network addresses are blocked.",
      });
    }
  });

export function validateDestination(input: string): string {
  return destinationUrlSchema.parse(input);
}

export function safeNormalizeUrl(input: string): string {
  try {
    const url = new URL(input.trim());
    return url.toString();
  } catch {
    return input.trim();
  }
}
