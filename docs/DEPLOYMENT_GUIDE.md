# LinkWay — Production Deployment Guide

**Document Version:** 1.0  
**Target Environments:** Vercel / Cloudflare / Node.js Container / Railway  
**Database:** Neon PostgreSQL Free Tier (or Supabase / AWS RDS)  
**Date:** November 2026  

---

## 1. Zero-Cost Infrastructure Architecture

LinkWay is specifically architected to operate efficiently on free tiers:
- **Web App & APIs:** Vercel Hobby / Cloudflare Pages / Railway Starter
- **Relational Database:** Neon PostgreSQL Serverless Free Tier (0.5 GiB storage, automated connection pooling)
- **Edge Cache (Optional):** Upstash Redis Free Tier (10,000 commands/day)
- **Transaction Email (Optional):** Resend Free Tier (3,000 emails/month)

---

## 2. Pre-Deployment Configuration

### Step 1: Set Up Neon PostgreSQL
1. Create a free account at [https://neon.tech](https://neon.tech).
2. Create a new project named `linkway-prod`.
3. Copy the pooled connection string (e.g. `postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).

### Step 2: Configure Environment Variables in Deployment Host
In your hosting provider dashboard (e.g. Vercel Project Settings > Environment Variables), configure:

| Key | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` | Neon pooled connection string |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | Production canonical web URL |
| `NEXT_PUBLIC_SHORT_DOMAIN` | `https://your-domain.com` | Short link origin (or separate domain) |
| `AUTH_SECRET` | `32-byte-hex-string` | Generated via `openssl rand -hex 32` |
| `NODE_ENV` | `production` | Production environment flag |

### Step 3: Run Database Migrations
Run schema push to create all tables and indexes on Neon:
```bash
npx prisma db push
```

---

## 3. Deployment Steps

### Option A: Deploy to Vercel (Recommended)
1. Push your repository to GitHub / GitLab.
2. In Vercel, click **Add New Project** and import the repository.
3. In the build settings:
   - Framework Preset: **Next.js**
   - Build Command: `npx prisma generate && next build`
   - Output Directory: `.next`
4. Add the environment variables specified in Section 2.
5. Click **Deploy**.

### Option B: Deploy as a Docker Container
A standard multi-stage Dockerfile can be built and run:
```bash
docker build -t linkway-web .
docker run -p 3000:3000 --env-file .env.local linkway-web
```

---

## 4. Post-Deployment Verification

1. **Health Check:**
   Visit `https://your-domain.com/api/health` — it should respond with `{"status":"ok","service":"linkway-web","database":"connected",...}`.
2. **Account Creation:**
   Navigate to `/signup`, register an administrative user, and verify redirection to `/app`.
3. **Link Creation & Redirect:**
   Create a short link with a custom alias (e.g., `/r/launch-test`), verify the QR code renders, and open the short URL to verify instant redirection to the target destination.
4. **Analytics Verification:**
   Verify that the redirect event was captured on the dashboard and displayed under the Analytics tab.
5. **Abuse Route:**
   Verify that `/abuse` loads and can receive reports.
