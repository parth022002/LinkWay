# LinkWay — Intelligent Link Management Platform

<p align="center">
  <img src="public/brand/logo-dark.png" alt="LinkWay Logo" width="320" />
</p>

<p align="center">
  <strong>Every Link. One Smarter Way.</strong><br />
  Create · Shorten · Track · Protect · Optimize
</p>

---

## Overview

**LinkWay** is a modern, policy-gated SaaS link management platform engineered for marketers, growth teams, creators, and developers. Built on a deterministic routing edge and honest analytics model, LinkWay bridges campaign planning with safe redirection.

### Core Capabilities:
- **Campaign DNA & UTM Governance:** Standardized campaign templates and automatic UTM parameter builder (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) with duplicate key resolution and `#hash` fragment preservation.
- **Collision-Resistant Short Links:** Cryptographically random Base58 7-character short codes with automated collision retry and custom alias validation against reserved keywords.
- **Dynamic QR Identity:** Instant vector SVG and high-resolution raster PNG QR codes paired to canonical short links.
- **Immutable Version Ledgers:** Every destination change creates a historical snapshot with actor attribution and 1-click rollback.
- **Honest Analytics & Reporting:** Real-time metrics tracking recorded redirect events, referrers, device families, and country distributions with **zero raw IP persistence**.
- **Policy-Gated Redirect Security:** Strict anti-open-redirect architecture. Redirects resolve exclusively to database-verified destinations.
- **Workspace Tenancy & RBAC:** Multi-tenant workspace isolation with role hierarchies (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER`).
- **Public Abuse Intake:** Open reporting endpoint (`/abuse`) and administrative triage.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) & React 19
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with official LinkWay design tokens
- **Database & ORM:** PostgreSQL (Neon serverless) & SQLite (local dev) via Prisma ORM
- **Authentication:** Bcrypt password hashing & signed HS256 JWT session cookies
- **QR Engine:** `qrcode` library (SVG vector & PNG raster)
- **Testing:** Vitest automated test runner

---

## Quickstart

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/parth022002/LinkWay.git
cd LinkWay
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration uses local SQLite (`file:./dev.db`). For production, supply your Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host/linkway?sslmode=require"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
AUTH_SECRET="your-32-character-secret-key"
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

```bash
# Run unit and integration tests (27 tests)
npm test

# Type check
npm run typecheck

# Code linting
npm run lint

# Production build
npm run build
```

---

## License

Private & Proprietary — LinkWay Inc. All rights reserved.
