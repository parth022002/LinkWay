import { describe, it, expect } from "vitest";
import { generateShortCode, validateCustomCode } from "@/lib/short-code";

describe("Short Code Generator & Validator", () => {
  it("generates a 7-character alphanumeric string by default", () => {
    const code = generateShortCode();
    expect(code).toHaveLength(7);
    expect(/^[23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ]+$/.test(code)).toBe(true);
  });

  it("generates unique codes with zero collisions across 500 iterations", () => {
    const set = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const code = generateShortCode();
      expect(set.has(code)).toBe(false);
      set.add(code);
    }
    expect(set.size).toBe(500);
  });

  it("approves valid custom slugs", () => {
    expect(validateCustomCode("summer26")).toEqual({ valid: true });
    expect(validateCustomCode("black-friday_sale")).toEqual({ valid: true });
  });

  it("rejects slugs that are too short or too long", () => {
    expect(validateCustomCode("ab").valid).toBe(false);
    expect(validateCustomCode("a".repeat(33)).valid).toBe(false);
  });

  it("rejects system reserved keywords", () => {
    expect(validateCustomCode("api").valid).toBe(false);
    expect(validateCustomCode("login").valid).toBe(false);
    expect(validateCustomCode("admin").valid).toBe(false);
    expect(validateCustomCode("dashboard").valid).toBe(false);
    expect(validateCustomCode("r").valid).toBe(false);
  });
});
