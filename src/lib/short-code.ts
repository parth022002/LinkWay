import { randomBytes } from "node:crypto";
import { RESERVED_SLUGS } from "@/lib/constants";

// Safe Base58/Base62 alphanumeric character set excluding easily confused characters (0, O, I, l)
const ALPHABET = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Generates an unguessable high-entropy random short code.
 * @param length Defaults to 7 characters (58^7 = ~2.2 trillion combinations)
 */
export function generateShortCode(length = 7): string {
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * Validates a custom alias against length, character regex, and system reserved keywords.
 */
export function validateCustomCode(code: string): { valid: boolean; error?: string } {
  const trimmed = code.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "Custom short code must be at least 3 characters." };
  }
  if (trimmed.length > 32) {
    return { valid: false, error: "Custom short code cannot exceed 32 characters." };
  }
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: "Custom short code can only contain letters, numbers, hyphens, and underscores." };
  }
  if (RESERVED_SLUGS.has(trimmed.toLowerCase())) {
    return { valid: false, error: `The slug '${trimmed}' is a reserved system keyword.` };
  }
  return { valid: true };
}
