# LinkWay — Environment Setup & Configuration Guide

**Document Status:** Complete Environment Setup  
**Date:** November 2026  
**Stack:** Next.js 15, React 19, TypeScript, Prisma, Tailwind CSS

---

## 1. Prerequisites

- **Node.js:** v20.x or v22.x LTS (Tested on Node v22.20.0).
- **Package Manager:** `npm` (v10+) or `pnpm` (v9+).
- **Operating System:** Windows, macOS, or Linux.
- **Database:** Local SQLite (zero-config, out-of-the-box dev) or PostgreSQL 15+ (Neon / Supabase / local Postgres).

---

## 2. Quickstart Step-by-Step

### Step 1: Clone & Navigate
```bash
cd "c:\Users\parth\OneDrive\Desktop\LinkWay\LinkWay Code"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Step 4: Initialize the Database
Generate Prisma client and run migrations or db push:
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Environment Variables Reference

| Variable | Description | Default / Example | Required |
|---|---|---|---|
| `DATABASE_URL` | Prisma connection string for PostgreSQL or SQLite. | `postgresql://user:pass@host/db?sslmode=require` or `file:./dev.db` | **Yes** |
| `NEXT_PUBLIC_APP_URL` | Canonical origin of the web application. | `http://localhost:3000` | **Yes** |
| `NEXT_PUBLIC_SHORT_DOMAIN` | Short link hostname (if using a distinct vanity domain). | `http://localhost:3000` | No |
| `AUTH_SECRET` | 32-byte secret used for signing session cookies and tokens. | `super-secret-development-key-32-chars-min!` | **Yes** |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL for edge caching & rate limits. | `https://your-upstash-redis.upstash.io` | No |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST bearer token. | `Axxx...` | No |
| `SAFE_BROWSING_API_KEY` | Google Safe Browsing API v4 key for malware URL checks. | `AIzaSy...` | No |
| `RESEND_API_KEY` | Resend API key for transactional email delivery. | `re_...` | No |
| `EMAIL_FROM` | Default "From" address for system emails. | `LinkWay <noreply@linkway.app>` | No |

---

## 4. Verification Commands

Run the automated verification suite to confirm everything is operational:

```bash
# 1. Type Check
npm run typecheck

# 2. Linting
npm run lint

# 3. Unit and Integration Tests
npm test

# 4. Production Build
npm run build
```
