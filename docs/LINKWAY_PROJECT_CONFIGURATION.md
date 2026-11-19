# LinkWay — Project Configuration & Owner Input Guide

**Document Status:** Active Configuration Register  
**Security Policy:** STRICT ZERO-SECRETS POLICY. Never record real credentials, private keys, database passwords, or auth tokens in this file or Git. Use `.env.local` or your secure hosting environment secrets manager.

---

## 1. Overview & Purpose

This configuration sheet itemizes all external services, provider accounts, domain settings, secrets, and architectural decisions required from the project owner to power LinkWay in development, staging, and production.

---

## 2. Configuration Items

| Config Item | Details & Purpose | Source / How to Obtain | Mandatory? | Required Phase | Status |
|---|---|---|---|---|---|
| **1. Primary Database** | PostgreSQL connection URI (`DATABASE_URL`). Relational data store for users, workspaces, links, campaigns, versions, redirect events, and audit logs. | Neon (https://neon.tech), Supabase, or Railway. | **Yes** | Phase 0 | **Configured & Tested with Neon Serverless Postgres** |
| **2. Authentication Provider** | Session secret (`AUTH_SECRET`), NextAuth/BetterAuth or Clerk secret keys. Handles secure user sessions, signup, signin, password hashing. | Generate 32-byte secret with `openssl rand -hex 32` or obtain from Clerk/Better Auth dashboard. | **Yes** | Phase 1 | Integrated (Local JWT/Session + Extensible Provider) |
| **3. Application Domain** | Canonical web URL (`NEXT_PUBLIC_APP_URL`), e.g. `https://linkway.io` or `http://localhost:3000`. Used for auth callbacks, absolute canonical URLs, and QR codes. | Domain registrar (Namecheap, Cloudflare, Porkbun). | **Yes** | Phase 0 | Configured (`http://localhost:3000` for dev) |
| **4. Short-Link Domain** | Canonical short-link root domain (`NEXT_PUBLIC_SHORT_DOMAIN`), e.g. `lnk.wy` or custom short domain. | Domain registrar. | Optional (can share main domain `/r/[code]`) | Phase 5 | Configured (Uses App Domain default `/r/[code]`) |
| **5. Redis / Edge Cache** | Redis REST URL and Token (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`). Used for ultra-low-latency redirect caching, global rate limiting, and brute-force prevention. | Upstash (https://upstash.com) free tier Redis database. | No (In-memory/DB fallback implemented) | Phase 5 | In-Memory Fallback Active; Upstash Ready |
| **6. Email Service** | SMTP or API credentials (`RESEND_API_KEY`, `EMAIL_FROM`). Used for account verification, password resets, team invitations, and security alerts. | Resend (https://resend.com) or SendGrid. | No for local dev (simulated/logged); Yes for production auth. | Phase 1 | Simulated in Local Dev; Resend Ready |
| **7. URL Reputation Service** | Google Safe Browsing API or Cloudflare Radar API (`SAFE_BROWSING_API_KEY`). Screens submitted destination URLs for malware, phishing, and scam domains. | Google Cloud Console (Safe Browsing API v4) or Cloudflare Radar. | No (Local domain blocklist & scheme screening active) | Phase 2 | Local Pattern/SSRF Guard Active; API Ready |
| **8. Object Storage** | S3-compatible credentials (`S3_BUCKET`, `S3_REGION`, `S3_KEY`). Stores persistent high-res QR exports and large CSV analytics files. | Cloudflare R2 (zero egress fees) or AWS S3. | No (Dynamic stream generation implemented) | Phase 4 | Dynamic In-Memory SVG/PNG Active |
| **9. Error Monitoring** | Sentry DSN (`SENTRY_DSN` or `NEXT_PUBLIC_SENTRY_DSN`). Real-time crash reporting and unhandled exception logging. | Sentry (https://sentry.io). | No for MVP; recommended for production. | Phase 9 | Standard Next.js Structured Error Boundary Active |
| **10. Payment & Billing** | Stripe secret key & webhook secret (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Plan subscriptions and billing quotas. | Stripe Dashboard (https://stripe.com). | **No** (Monetization is deferred per v1.2 spec ₹0 baseline). | Post-MVP | Feature-Flagged / Deferred |
| **11. Brand Assets** | High-res dark/light logo vectors, favicon. | Provided in project repository under `/public/brand/`. | **Yes** | Phase 0 | **Configured & Verified** |
| **12. Legal & Support Contacts** | Support email (`support@linkway.app`), abuse reporting email (`abuse@linkway.app`), company legal name and address. | Project owner legal registration. | Yes before public launch. | Phase 8 | Placeholders configured (`abuse@linkway.app`) |

---

## 3. Owner Actions Required

1. **Verify Database:** For production deployment, set `DATABASE_URL` in your hosting dashboard (e.g. Vercel / Cloudflare / Railway) to your Neon PostgreSQL connection string.
2. **Review Legal Notice:** Confirm support and abuse emails before going live to the public.
3. **Decide Custom Short Domain:** Confirm if a dedicated short domain (e.g., `lnk.wy`) will be purchased, or if links will reside on the primary domain under `/r/:code`. Both modes are fully supported.
