import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { WORKSPACE_ROLES, type WorkspaceRole } from "@/lib/constants";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "linkway_session";
const SESSION_DURATION_DAYS = 30;

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "dev-linkway-session-secret-key-at-least-32-chars-long";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionPayload {
  userId: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRole;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      workspaceId: payload.workspaceId as string,
      role: payload.role as WorkspaceRole,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Ensures request has an active authenticated session and returns it.
 * Throws an Error if unauthorized.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Role hierarchy checks
 */
const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  [WORKSPACE_ROLES.VIEWER]: 1,
  [WORKSPACE_ROLES.EDITOR]: 2,
  [WORKSPACE_ROLES.ADMIN]: 3,
  [WORKSPACE_ROLES.OWNER]: 4,
};

export function hasMinimumRole(userRole: WorkspaceRole, minimumRequiredRole: WorkspaceRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRequiredRole];
}

export async function requireRole(minimumRequiredRole: WorkspaceRole): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!hasMinimumRole(session.role, minimumRequiredRole)) {
    throw new Error("FORBIDDEN: Insufficient role permissions");
  }
  return session;
}
