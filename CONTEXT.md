# HokenLife CRM — Context

## Project Overview

**HokenLife CRM** is a SaaS CRM (Customer Relationship Management) system tailored for the insurance industry. Built for insurance agents to manage contacts, policies, claims, leads, and renewals.

---

## Domain

- **Industry**: Insurance
- **Type**: SaaS CRM application
- **Target User**: Insurance agents (individual and agency)
- **Business Model**: SaaS subscription (3 tiers + 14-day free trial)
- **Status**: Greenfield project — Phase 1 (Foundation)

## Business Model

| Detail | Value |
|--------|-------|
| Model | SaaS subscription |
| Tiers | Low / High / Enterprise (prices TBD) |
| Free Trial | 14 days |
| Payment | Stripe |
| Multi-tenant | Yes — each agency/individual gets their own org |
| Sign-up flow | Landing page → Sign up → Free trial → Pay to continue |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix primitives) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Payments | Stripe (subscriptions + webhooks) |
| Hosting | Vercel |
| Domain | Custom domain (TBD — Vercel URL for now) |

## Design Direction

| Element | Direction |
|---------|-----------|
| Theme | Dark mode first, light/dark toggle |
| Background | Deep dark (near-black) with subtle gradients |
| Accent color | Green/teal gradient (`#92FE9D` → `#00C9FF`) |
| Cards | Glassmorphism — semi-transparent, subtle borders, rounded corners |
| Sidebar | Dark, icon + text nav, collapsible, user profile |
| Charts | Clean line/donut/bar charts with green/teal accent |
| Typography | Inter (clean geometric sans-serif) |
| Spacing | Generous padding, airy layouts |
| Logo | Abstract geometric "H" icon + "HokenLife CRM" wordmark |
| Logo color | Green/teal gradient on icon, white text for wordmark |
| Landing page | Dark hero, bold headline, green CTAs, pricing table, features |

### Inspiration Sources

- Dashboard: Dark SaaS dashboards with KPI cards, charts, sidebar nav (see `/insipiration/`)
- Landing page: Revo CRM + GrowthPilot AI style (dark hero, bold text, green CTAs)
- Logo: Modern geometric lettermarks — Kynetic, HiCloud, Balancio style (see `/logo inspiration/`)

## Glossary

| Term | Definition |
|------|-----------|
| Policy | An insurance contract between insurer and policyholder |
| Premium | The amount paid for insurance coverage |
| Claim | A request by the policyholder for payment based on the policy |
| Agent | An insurance sales representative (not to be confused with AI agents) |
| Underwriting | The process of evaluating risk to determine coverage and pricing |
| Lead | A potential customer who has shown interest |
| Renewal | Extension of an existing policy for a new term |
| Organization | A tenant in the multi-tenant system (an agency or individual account) |

## External Accounts

| Service | Detail |
|---------|--------|
| GitHub | `brinkscodes/HokenLifeCRM` |
| Supabase | Project URL: `https://fkgrfspbuyzofgedcxjq.supabase.co` |
| Stripe | TBD — keys to be added later |
| Google OAuth | TBD — to be configured in Supabase dashboard later |
| Vercel | Account exists — to be connected later |

## Key Decisions

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 | Supabase over Prisma + raw PostgreSQL | Built-in auth, realtime, storage — less moving parts | 2026-03-02 |
| 2 | Supabase Auth over NextAuth | Native integration with Supabase DB, simpler setup | 2026-03-02 |
| 3 | Stripe for payments | Industry standard, good subscription/trial support | 2026-03-02 |
| 4 | Dark mode first | Matches design inspiration, modern SaaS feel | 2026-03-02 |
| 5 | Green/teal gradient as brand color | User preference, aligns with inspiration boards | 2026-03-02 |
| 6 | 3-tier pricing + 14-day free trial | Standard SaaS model for insurance CRM market | 2026-03-02 |
| 7 | Multi-tenant architecture | Each agency gets isolated data via Supabase RLS | 2026-03-02 |
| 8 | Vercel for hosting | User already has account, native Next.js support | 2026-03-02 |
