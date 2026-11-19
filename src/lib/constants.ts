export const WORKSPACE_ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
} as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES];

export const LINK_STATUSES = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
} as const;
export type LinkStatus = (typeof LINK_STATUSES)[keyof typeof LINK_STATUSES];

export const DOMAIN_STATUSES = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  FAILED: "FAILED",
} as const;
export type DomainStatus = (typeof DOMAIN_STATUSES)[keyof typeof DOMAIN_STATUSES];

export const ABUSE_STATUSES = {
  PENDING: "PENDING",
  INVESTIGATING: "INVESTIGATING",
  RESOLVED: "RESOLVED",
  DISMISSED: "DISMISSED",
} as const;
export type AbuseStatus = (typeof ABUSE_STATUSES)[keyof typeof ABUSE_STATUSES];

// System reserved words that cannot be used as custom short codes
export const RESERVED_SLUGS = new Set([
  "api",
  "app",
  "auth",
  "login",
  "signup",
  "logout",
  "register",
  "r",
  "dashboard",
  "settings",
  "admin",
  "static",
  "public",
  "brand",
  "docs",
  "legal",
  "privacy",
  "terms",
  "abuse",
  "status",
  "health",
  "robots.txt",
  "sitemap.xml",
  "favicon.ico",
  "analytics",
  "campaigns",
  "links",
  "qr",
  "qr-codes",
]);
