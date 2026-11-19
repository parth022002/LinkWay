import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  hasMinimumRole,
} from "@/lib/auth";
import { WORKSPACE_ROLES } from "@/lib/constants";

describe("Authentication & RBAC Security", () => {
  it("hashes password and verifies successfully", async () => {
    const raw = "SecurePass#2026";
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword("WrongPass", hash)).toBe(false);
  });

  it("issues and verifies signed JWT session tokens", async () => {
    const payload = {
      userId: "user_123",
      email: "test@linkway.app",
      workspaceId: "ws_456",
      role: WORKSPACE_ROLES.OWNER,
    };

    const token = await createSessionToken(payload);
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.workspaceId).toBe(payload.workspaceId);
    expect(decoded?.role).toBe(WORKSPACE_ROLES.OWNER);
  });

  it("rejects tampered session tokens", async () => {
    const valid = await createSessionToken({
      userId: "u1",
      email: "u1@linkway.app",
      workspaceId: "w1",
      role: WORKSPACE_ROLES.VIEWER,
    });

    const tampered = valid.slice(0, -6) + "abcdef";
    const verified = await verifySessionToken(tampered);
    expect(verified).toBeNull();
  });

  it("correctly enforces role hierarchy", () => {
    // OWNER has all permissions
    expect(hasMinimumRole(WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.VIEWER)).toBe(true);
    expect(hasMinimumRole(WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.EDITOR)).toBe(true);
    expect(hasMinimumRole(WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.ADMIN)).toBe(true);
    expect(hasMinimumRole(WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.OWNER)).toBe(true);

    // EDITOR can view and edit, but cannot admin or own
    expect(hasMinimumRole(WORKSPACE_ROLES.EDITOR, WORKSPACE_ROLES.VIEWER)).toBe(true);
    expect(hasMinimumRole(WORKSPACE_ROLES.EDITOR, WORKSPACE_ROLES.EDITOR)).toBe(true);
    expect(hasMinimumRole(WORKSPACE_ROLES.EDITOR, WORKSPACE_ROLES.ADMIN)).toBe(false);
    expect(hasMinimumRole(WORKSPACE_ROLES.EDITOR, WORKSPACE_ROLES.OWNER)).toBe(false);

    // VIEWER can only view
    expect(hasMinimumRole(WORKSPACE_ROLES.VIEWER, WORKSPACE_ROLES.VIEWER)).toBe(true);
    expect(hasMinimumRole(WORKSPACE_ROLES.VIEWER, WORKSPACE_ROLES.EDITOR)).toBe(false);
  });
});
