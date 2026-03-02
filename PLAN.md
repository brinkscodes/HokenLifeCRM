# HokenLife CRM — Architecture Plan

## Tech Stack Summary

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **Supabase** (PostgreSQL + Auth + RLS)
- **Stripe** for SaaS subscriptions
- **Vercel** for hosting

---

## Project Structure

```
hokenlife/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Public pages
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/           # Pricing page
│   │   │   └── layout.tsx         # Marketing layout
│   │   ├── (auth)/                # Auth pages
│   │   │   ├── login/             # Login page
│   │   │   ├── signup/            # Sign up page
│   │   │   └── callback/          # OAuth callback
│   │   ├── (dashboard)/           # Protected CRM routes
│   │   │   ├── dashboard/         # Dashboard home
│   │   │   ├── contacts/          # Contact management
│   │   │   ├── policies/          # Insurance policies
│   │   │   ├── claims/            # Claims tracking
│   │   │   ├── leads/             # Lead pipeline
│   │   │   ├── settings/          # User/org settings
│   │   │   └── layout.tsx         # Dashboard shell (sidebar + header)
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── stripe/        # Stripe webhook handler
│   │   ├── layout.tsx             # Root layout (theme provider)
│   │   └── globals.css            # Global styles + Tailwind
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── forms/                 # Reusable form components
│   │   ├── tables/                # Data table components
│   │   ├── charts/                # Dashboard chart components
│   │   ├── layout/                # Shell, sidebar, header
│   │   ├── marketing/             # Landing page sections
│   │   └── theme/                 # Theme toggle, provider
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser Supabase client
│   │   │   ├── server.ts          # Server Supabase client
│   │   │   └── middleware.ts      # Auth middleware helper
│   │   ├── stripe.ts              # Stripe client + helpers
│   │   └── utils.ts               # Shared utilities
│   ├── types/                     # TypeScript types
│   └── hooks/                     # Custom React hooks
├── supabase/
│   ├── migrations/                # SQL migration files
│   └── seed.sql                   # Seed data
├── public/
│   ├── logo.svg                   # HokenLife logo
│   └── favicon.ico                # Favicon
├── .env.local                     # Environment variables (gitignored)
├── CONTEXT.md
├── TASKS.md
├── PLAN.md
├── PROGRESS.md
├── TEST_LOG.md
└── package.json
```

---

## Core Data Models

```
profiles         — id (= auth.user.id), full_name, email, role, org_id, avatar_url, created_at
organizations    — id, name, slug, plan, trial_ends_at, stripe_customer_id, stripe_subscription_id, created_at
contacts         — id, first_name, last_name, email, phone, type, notes, org_id, created_by, created_at
policies         — id, policy_number, contact_id, type, status, premium, start_date, end_date, org_id, created_at
claims           — id, claim_number, policy_id, status, amount, description, filed_date, org_id, created_at
leads            — id, contact_id, source, status, assigned_to, value, org_id, created_at
activities       — id, type, description, contact_id, user_id, org_id, created_at
subscriptions    — id, org_id, stripe_subscription_id, plan, status, current_period_start, current_period_end
```

### Key Relationships
- Organization has many Profiles, Contacts, Policies, Claims, Leads
- Contact has many Policies, Claims, Activities, Leads
- Policy has many Claims
- Lead belongs to Contact, assigned to Profile (user)
- All CRM data scoped to Organization via RLS

### Row Level Security (RLS)
- All tables enforce `org_id = auth.user.org_id`
- Users can only see data within their organization
- Service role key bypasses RLS for admin/webhook operations

---

## Implementation Phases

### Phase 1 — Foundation ✅ COMPLETE
1. ✅ Scaffold Next.js 16 project with TypeScript + Tailwind CSS 4
2. ✅ Install and configure shadcn/ui (19 components)
3. ✅ Configure Supabase client (browser + server) + env vars
4. ✅ Define database schema + migrations + RLS policies (7 tables, 24 RLS policies)
5. ✅ Set up Supabase Auth (email/password + Google OAuth ready)
6. ✅ Set up Stripe webhook handler (checkout, subscription update/cancel)
7. ✅ Build dashboard shell (collapsible sidebar, header, theme toggle)
8. ✅ Create SVG logo (abstract geometric H with gradient)
9. ✅ Push to GitHub (`brinkscodes/HokenLifeCRM`)
10. ❌ Deploy to Vercel (not connected yet)

### Phase 2 — Landing & Auth Flow ✅ COMPLETE
1. ✅ Landing page (hero, features, inline pricing, CTA)
2. ✅ Login / signup pages (email/password + Google OAuth button)
3. ✅ OAuth callback route
4. ✅ Dark/light mode toggle
5. ✅ Dedicated pricing page (`/pricing` route with 3-tier cards + FAQ)
6. ✅ Password reset flow (forgot-password → email link → update-password)
7. ✅ Stripe checkout flow (API route creates checkout session, webhook processes completion)

### Phase 3 — Core CRM ✅ COMPLETE
1. ✅ Dashboard home (KPI cards, total premiums, recent contacts, upcoming renewals)
2. ✅ Contacts CRUD (data table, search, create/edit/delete dialogs)
3. ✅ Policies CRUD (linked to contacts, 9 types, status badges, premium tracking)
4. ✅ Claims CRUD (linked to policies, status workflow: open → in_review → approved/denied → closed)
5. ✅ Leads CRUD (linked to contacts, assignable to agents, source + value tracking)
6. ✅ All server actions use Supabase with RLS enforcement

### Phase 4 — Insurance Modules ✅ COMPLETE
1. ✅ Activity timeline (dedicated page, log calls/emails/meetings/notes/tasks per contact)
2. ✅ Renewals tracking (dedicated page with urgency badges, filters, summary cards)

### Phase 5 — Polish & Scale 🟡 MOSTLY COMPLETE
1. ✅ Settings page (profile, org name, billing with upgrade buttons)
2. ✅ Dashboard analytics (policies by type donut chart, leads by status bar chart)
3. ❌ Role-based access control (admin, agent, viewer) — not yet implemented
4. ❌ Email notifications — not yet implemented
5. ✅ CSV export (contacts, policies, claims, leads — download buttons on all tables)
6. ✅ Seed data (`supabase/seed.sql` — 20 contacts, 30 policies, 10 claims, 15 leads, 25 activities)
7. ❌ Testing suite — not yet implemented
8. ✅ Global search (Cmd+K command palette, searches across contacts, policies, claims, leads)

---

## Pending External Setup (requires user action)
- [ ] Connect Vercel to GitHub repo
- [ ] Set up Stripe publishable + secret keys in `.env.local`
- [ ] Add `STRIPE_STARTER_PRICE_ID` and `STRIPE_PROFESSIONAL_PRICE_ID` to `.env.local`
- [ ] Set Stripe webhook secret in `.env.local`
- [ ] Configure Google OAuth provider in Supabase dashboard
- [ ] Set custom domain on Vercel

## Remaining Work
- [ ] Role-based access control (admin, agent, viewer)
- [ ] Email notifications
- [ ] Testing suite

---

## Session 4 — Plan ✅ COMPLETE

### Goal: Finish Phase 2 + Phase 4 + most of Phase 5

All items completed:
1. ✅ Dedicated `/pricing` page with 3-tier cards + FAQ
2. ✅ Password reset flow (forgot-password + update-password pages)
3. ✅ Stripe checkout API route (`/api/checkout`)
4. ✅ Activity timeline page with form to log activities
5. ✅ Renewals tracking page with filters and urgency badges
6. ✅ Settings page (profile, org, billing with upgrade)
7. ✅ Global search (Cmd+K command palette)
8. ✅ Dashboard analytics charts (recharts)
9. ✅ Seed data (20 contacts, 30 policies, 10 claims, 15 leads, 25 activities)
10. ✅ CSV export on all data tables
