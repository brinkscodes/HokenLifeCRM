# HokenLife CRM — Tasks

> Active task tracking. Update this file as work progresses.

---

## Next Up

### Remaining Features
- [ ] Email notifications
- [ ] Testing suite
- [ ] CSV import (upload + preview + validate)
- [ ] Migrate `middleware.ts` → `proxy.ts` (Next.js 16 convention)

### Pending Setup
- [ ] Add Vercel URL to Supabase redirect URLs (`https://hokenlife-crm.vercel.app/**`)
- [ ] Redeploy to Vercel WITH middleware once Vercel fixes global middleware deployment issue
- [ ] Set up Stripe keys + webhook endpoint in `.env.local`
- [ ] Add `STRIPE_STARTER_PRICE_ID` + `STRIPE_PROFESSIONAL_PRICE_ID` to `.env.local`
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Set custom domain on Vercel

---

## Done

- [x] Initialize project documentation (2026-03-02)
- [x] Initialize git repository (2026-03-02)
- [x] Define tech stack and architecture (2026-03-02)
- [x] Gather design inspiration and logo direction (2026-03-02)
- [x] Update all project docs to reflect final decisions (2026-03-02)
- [x] Scaffold Next.js project with TypeScript + Tailwind CSS 4 (2026-03-02)
- [x] Install and configure shadcn/ui — 19 components (2026-03-02)
- [x] Configure Supabase client (browser + server) + env vars (2026-03-02)
- [x] Set up Supabase Auth (email/password + Google OAuth ready) (2026-03-02)
- [x] Define database schema + run migrations + RLS policies (2026-03-02)
- [x] Set up Stripe webhook handler (2026-03-02)
- [x] Build dashboard layout — sidebar, header, theme toggle (2026-03-02)
- [x] Create SVG logo component (abstract geometric H) (2026-03-02)
- [x] Build landing page — hero, features, pricing, CTA (2026-03-02)
- [x] Build login + signup pages (2026-03-02)
- [x] Push to GitHub `brinkscodes/HokenLifeCRM` (2026-03-02)
- [x] Contacts CRUD — full table, search, create/edit/delete (2026-03-02)
- [x] Policies CRUD — linked to contacts, status tracking, premiums (2026-03-02)
- [x] Claims CRUD — linked to policies, status workflow (2026-03-02)
- [x] Leads pipeline — linked to contacts, assignable, value tracking (2026-03-02)
- [x] Dashboard wired with real KPI data from Supabase (2026-03-02)
- [x] Dedicated pricing page with 3-tier cards + FAQ (2026-03-02)
- [x] Password reset flow — forgot-password + update-password (2026-03-02)
- [x] Stripe checkout API route — creates sessions for authenticated users (2026-03-02)
- [x] Activity timeline — dedicated page, log calls/emails/meetings/notes/tasks (2026-03-02)
- [x] Renewals tracking — dedicated page with urgency badges + filters (2026-03-02)
- [x] Settings page — profile, org name, billing with upgrade buttons (2026-03-02)
- [x] Global search — Cmd+K command palette across all data (2026-03-02)
- [x] Dashboard analytics — policies by type chart, leads by status chart (2026-03-02)
- [x] Seed data — 20 contacts, 30 policies, 10 claims, 15 leads, 25 activities (2026-03-02)
- [x] CSV export — download buttons on contacts, policies, claims, leads tables (2026-03-02)
- [x] RBAC — permissions utility, role checks in all server actions, role-based sidebar/settings/middleware, team management page (2026-03-02)
- [x] Create admin test account (`god@hokenlife.com`) + apply seed data (2026-03-02)
- [x] Deploy to Vercel — `https://hokenlife-crm.vercel.app` (without middleware due to Vercel infra issue) (2026-03-02)
