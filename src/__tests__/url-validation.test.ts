import { describe, it, expect } from "vitest";
import { validateDestination } from "@/lib/url";

describe("URL Validation & SSRF Prevention", () => {
  it("accepts valid HTTPS URLs", () => {
    const valid = "https://example.com/products?ref=summer";
    expect(validateDestination(valid)).toBe(valid);
  });

  it("accepts valid HTTP URLs", () => {
    const valid = "http://myblog.org/articles/123";
    expect(validateDestination(valid)).toBe(valid);
  });

  it("rejects javascript: schemes", () => {
    expect(() => validateDestination("javascript:alert(1)")).toThrow(
      "Only standard HTTP and HTTPS destinations are permitted."
    );
  });

  it("rejects data: schemes", () => {
    expect(() => validateDestination("data:text/html;base64,PHNjcmlwdD4=")).toThrow();
  });

  it("rejects file: schemes", () => {
    expect(() => validateDestination("file:///etc/passwd")).toThrow();
  });

  it("rejects URLs with embedded credentials", () => {
    expect(() => validateDestination("https://admin:secret@example.com")).toThrow(
      "URLs with embedded credentials (user:pass) are prohibited."
    );
  });

  it("blocks SSRF attempts on localhost and 127.0.0.1", () => {
    expect(() => validateDestination("http://localhost:8080/admin")).toThrow(
      "Restricted destination"
    );
    expect(() => validateDestination("http://127.0.0.1:3000")).toThrow(
      "Restricted destination"
    );
  });

  it("blocks SSRF attempts on cloud metadata services (169.254.169.254)", () => {
    expect(() => validateDestination("http://169.254.169.254/latest/meta-data")).toThrow(
      "Restricted destination"
    );
  });

  it("blocks private IPv4 ranges (10.x.x.x, 192.168.x.x)", () => {
    expect(() => validateDestination("http://10.0.0.1/dashboard")).toThrow("Restricted destination");
    expect(() => validateDestination("http://192.168.1.1/setup")).toThrow("Restricted destination");
  });
});
