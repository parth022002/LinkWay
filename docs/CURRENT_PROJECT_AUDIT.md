# LinkWay — Current Codebase & Project Audit

**Document Status:** Complete Audit  
**Date:** November 2026  
**Auditor:** Lead Software Architect & Security Engineer  
**Workspace:** `LinkWay Code`

---

## 1. Executive Summary

An exhaustive inspection of `c:\Users\parth\OneDrive\Desktop\LinkWay\LinkWay Code` was conducted across frontend pages, backend APIs, data schemas, configurations, dependency manifests, and legacy files. 

The audit reveals a hybrid transition state:
1. **Legacy Prototype Residue:** Files from an early Python/Flask URL shortener prototype (`app.py`, `templates/`, `instance/database.db`, `__pycache__/`) remain present in the directory.
2. **Next.js Skeleton:** A nascent Next.js 15 / TypeScript / Prisma skeleton was created, with minimal placeholder pages (`src/app/page.tsx`, `src/app/app/page.tsx`), a health check route (`/api/health`), and four basic utility modules (`src/lib/url.ts`, `src/lib/short-code.ts`, `src/lib/utm.ts`, `src/lib/validation.ts`).
3. **Missing Production Dependencies:** Critical packages such as `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, and `qrcode` were missing from `package.json`, and `node_modules` was not yet installed.
4. **Prisma Schema Limitations:** The initial `schema.prisma` contained preliminary models for User, Workspace, WorkspaceMember, Campaign, Link, LinkVersion, and RedirectEvent, but lacked models for CustomDomain, AbuseReport, AuditLog, and QR Assets, and lacked password/session authentication credentials.

Below is the detailed findings breakdown answering the 7 core questions.

---

## 2. Answers to the 7 Core Audit Questions

### 1. What is already implemented?
- **Health Check API Route:** `src/app/api/health/route.ts` responds with `{ status: "ok", service: "linkway-web", timestamp: ... }`.
- **Destination URL Validator:** `src/lib/url.ts` contains basic Zod validation enforcing HTTP/HTTPS schemes, maximum length of 2048 characters, and rejection of URLs with embedded username/passwords.
- **Short Code Generation Utility:** `src/lib/short-code.ts` implements crypto random byte generation with a base-58 character set (`23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ`).
- **UTM Builder Utility:** `src/lib/utm.ts` takes destination URLs and an object of `source`, `medium`, `campaign`, `term`, `content` and attaches `utm_*` query parameters via `URL.searchParams`.
- **Zod Input Schema:** `src/lib/validation.ts` defines `createLinkSchema` verifying destinationUrl, optional title, optional campaignId, and optional customCode regex.
- **Initial Prisma Schema:** `prisma/schema.prisma` defines preliminary models for User, Workspace, WorkspaceMember, Campaign, Link, LinkVersion, and RedirectEvent.
- **Starter Next.js Config:** `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`.

### 2. What is partially implemented?
- **Landing Page (`src/app/page.tsx`):** Contains raw HTML/inline-styled elements with the product name, tagline, and basic workflow text, but lacks modern responsive styling, the approved brand logo, feature breakdowns, live link creator preview, interactive workflow visualizer, trust details, and navigation.
- **Dashboard Shell (`src/app/app/page.tsx`):** A static dashboard placeholder with three hardcoded cards ("Active links", "Recorded redirects", "Campaigns") with no database connectivity, no link list, no campaign manager, and no interactive actions.
- **Prisma Schema:** Models exist for Link and LinkVersion, but lack fields for QR styling, abuse reports, audit events, custom domains, and session management.

### 3. What is missing?
- **Tailwind CSS & Design System:** Tailwind was referenced in `globals.css` with `@tailwind base;` but `@tailwindcss/postcss` / `tailwindcss` dependencies and configuration were not fully wired up.
- **Approved Brand Assets in Application:** The approved brand logo (`LinkWay_Logo_DarkMode_Transparent.png`) and `LinkWay_Favicon.ico` were in `Upload/` and not integrated into the Next.js `/public/brand` directory or app header.
- **Authentication & Session Management:** No sign-up, sign-in, session verification, cookie management, or password hashing exists. Anyone can navigate directly to `/app`.
- **Server-Side Authorization & Workspace Isolation:** API routes and pages do not verify user identity, workspace membership, or roles.
- **Redirect Engine Route:** No `/r/[code]` or `/[code]` dynamic route exists to resolve short links and execute HTTP 302/307 redirects.
- **Event Recording Engine:** No background/asynchronous mechanism captures redirect metadata (user-agent, referrer, timestamp, country).
- **Interactive Link Management UI:** No link creation modal/form, edit modal, pause/activate toggles, archive/delete actions, search bar, or tag filters.
- **Interactive Campaign DNA & UTM UI:** No dedicated campaign creation and UTM builder tool with live preview.
- **QR Identity Engine & UI:** No QR code generation, preview, SVG export, or PNG download.
- **Version History & Rollback UI:** No version timeline or rollback action.
- **Analytics Dashboard & Charts:** No charts, time-series visualization, device/referrer breakdown, or CSV export.
- **Team Management & Custom Domains UI:** No team invite flow, role management, or domain verification UI.
- **Abuse Reporting & Admin Review:** No public report form or admin quarantine switch.
- **Automated Test Suite:** Vitest script is in `package.json`, but zero test files exist.

### 4. What is broken?
- **Dependency Tree & Execution:** `node_modules` was missing. Running `npm run dev` or `npm run build` failed immediately due to missing dependencies.
- **CSS Styling:** `globals.css` attempted to import `@tailwind` but tailwindcss was not installed in `devDependencies`.
- **Database Connection:** `DATABASE_URL` in `.env.example` points to a placeholder. Running Prisma without a configured local SQLite or Postgres database errors out.
- **Obsolete Flask Residue:** The root folder contains `app.py`, `templates/`, `instance/database.db`, and `__pycache__/` from an old prototype which conflicts conceptually with the Next.js project.

### 5. What needs redesigning?
- **Landing Page (`/`):** Must be elevated into a world-class SaaS marketing page adhering to `LinkWay_Brand_and_Website_Development_Guidelines_v1.0.docx` with hero section, live interactive shortener widget, campaign-to-QR workflow showcase, signature capabilities, trust & privacy transparency section, and FAQ.
- **App Dashboard (`/app`):** Needs a complete SaaS shell featuring sidebar navigation, workspace switcher, summary metrics cards, active links table, quick-create modal, and status filters.
- **Theme & Color Palette:** Replace default generic colors with LinkWay brand tokens (`#0B1430` Navy, `#101B3B` Navy Surface, `#111D3B` Ink, `#9636F5` Violet, `#2458F5` Blue, `#08C8E8` Cyan).

### 6. What needs refactoring?
- **Prisma Schema:** Upgrade to support both PostgreSQL (production) and local SQLite (development/testing), complete with password hash/session support, `AbuseReport`, `AuditLog`, `CustomDomain`, `QrAsset`, and full role enums.
- **UTM Builder (`src/lib/utm.ts`):** Extend to handle custom parameters, duplicate keys, URL fragment preservation, and malformed query string recovery.
- **Short Code Generator (`src/lib/short-code.ts`):** Enhance with reserved slug checking and database collision retry loops.

### 7. What security vulnerabilities exist?
- **Unprotected Dashboard:** The `/app` route was open to anyone without authentication.
- **Open Redirect Risk in Missing Resolver:** Any incoming redirect implementation must strictly resolve short codes from the database and prohibit user-controlled destination overrides.
- **Missing CSRF / Origin Verification:** State-modifying APIs must validate request origin and authentication tokens.
- **Potential SSRF:** Destination URLs must be screened against link-local and internal private IP blocks before any server-side metadata previewing.
- **Raw IP Persistence:** Redirect events must not store raw visitor IP addresses to uphold GDPR and privacy commitments.

---

## 3. Inventory of Codebase Files

| File | Current Status | Planned Action |
|---|---|---|
| `package.json` | Missing UI & QR dependencies | Add `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `lucide-react`, `qrcode`, `@types/qrcode`, `bcryptjs`, `@types/bcryptjs` |
| `app.py`, `templates/*`, `instance/*` | Legacy Flask prototype | Archive or isolate; do not use in Next.js runtime |
| `prisma/schema.prisma` | Incomplete schema | Upgrade with full models (Auth, Workspaces, Links, Versions, Events, Campaigns, Domains, Abuse) |
| `src/app/globals.css` | Basic font and CSS | Upgrade with LinkWay brand design tokens and Tailwind directives |
| `src/app/layout.tsx` | Basic HTML shell | Add brand favicon, metadata, Inter font, toast provider |
| `src/app/page.tsx` | Bare bones stub | Implement full premium SaaS landing page per guidelines |
| `src/app/app/page.tsx` | Static stub | Implement full SaaS dashboard with live data, tabs, and filters |
| `src/app/api/health/route.ts` | Working health endpoint | Maintain and expand with DB ping |
| `src/lib/short-code.ts` | Basic generator | Add reserved word screening and collision retry |
| `src/lib/url.ts` | Basic validator | Add SSRF guard and protocol normalization |
| `src/lib/utm.ts` | Basic UTM builder | Support custom params and duplicate key resolution |
| `src/lib/validation.ts` | Basic schema | Add campaign, workspace, and QR validation schemas |
