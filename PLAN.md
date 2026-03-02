# HokenLife CRM — Architecture Plan

## Tech Stack Summary

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **Supabase** (PostgreSQL + Auth + Realtime)
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

### Phase 1 — Foundation
1. Scaffold Next.js 15 project with TypeScript + Tailwind CSS 4
2. Install and configure shadcn/ui
3. Configure Supabase client (browser + server) + env vars
4. Define database schema + migrations + RLS policies
5. Set up Supabase Auth (email/password + Google OAuth)
6. Set up Stripe integration (subscriptions, webhooks, trial)
7. Build dashboard shell (sidebar, header, theme toggle)
8. Create SVG logo
9. Push to GitHub + deploy to Vercel

### Phase 2 — Landing & Auth Flow
1. Landing page (hero, features, pricing, CTA)
2. Pricing page with 3 tiers
3. Sign-up → free trial → Stripe checkout flow
4. Login / logout / password reset
5. Dark/light mode toggle

### Phase 3 — Core CRM
1. Dashboard home (KPI cards, charts, recent activity)
2. Contacts CRUD (list, create, view, edit, delete)
3. Data tables with sorting, filtering, pagination
4. Global search

### Phase 4 — Insurance Modules
1. Policies management (CRUD + status tracking)
2. Claims tracking (CRUD + workflow)
3. Lead pipeline (kanban or list view)
4. Activity timeline per contact
5. Renewals tracking

### Phase 5 — Polish & Scale
1. Dashboard analytics (charts, KPIs)
2. Role-based access control (admin, agent, viewer)
3. Email notifications
4. Export/import (CSV)
5. Seed data for development
6. Testing suite
