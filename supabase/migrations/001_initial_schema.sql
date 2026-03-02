-- HokenLife CRM — Initial Database Schema
-- Multi-tenant architecture with Row Level Security

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'professional', 'enterprise')),
  trial_ends_at timestamptz default (now() + interval '14 days'),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  role text not null default 'owner' check (role in ('owner', 'admin', 'agent', 'viewer')),
  org_id uuid references public.organizations(id) on delete cascade,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CONTACTS
-- ============================================================
create table public.contacts (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  type text not null default 'individual' check (type in ('individual', 'business')),
  notes text,
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- POLICIES
-- ============================================================
create table public.policies (
  id uuid primary key default uuid_generate_v4(),
  policy_number text not null,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  type text not null,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'pending')),
  premium numeric(12,2) not null default 0,
  start_date date not null,
  end_date date not null,
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CLAIMS
-- ============================================================
create table public.claims (
  id uuid primary key default uuid_generate_v4(),
  claim_number text not null,
  policy_id uuid not null references public.policies(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'in_review', 'approved', 'denied', 'closed')),
  amount numeric(12,2) not null default 0,
  description text,
  filed_date date not null default current_date,
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- LEADS
-- ============================================================
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  source text not null default 'other',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  assigned_to uuid references public.profiles(id),
  value numeric(12,2),
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ACTIVITIES
-- ============================================================
create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('call', 'email', 'meeting', 'note', 'task')),
  description text not null,
  contact_id uuid references public.contacts(id) on delete set null,
  user_id uuid not null references public.profiles(id),
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_profiles_org_id on public.profiles(org_id);
create index idx_contacts_org_id on public.contacts(org_id);
create index idx_policies_org_id on public.policies(org_id);
create index idx_policies_contact_id on public.policies(contact_id);
create index idx_claims_org_id on public.claims(org_id);
create index idx_claims_policy_id on public.claims(policy_id);
create index idx_leads_org_id on public.leads(org_id);
create index idx_leads_contact_id on public.leads(contact_id);
create index idx_leads_assigned_to on public.leads(assigned_to);
create index idx_activities_org_id on public.activities(org_id);
create index idx_activities_contact_id on public.activities(contact_id);
create index idx_activities_user_id on public.activities(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.policies enable row level security;
alter table public.claims enable row level security;
alter table public.leads enable row level security;
alter table public.activities enable row level security;

-- Helper function: get current user's org_id
create or replace function public.get_user_org_id()
returns uuid
language sql
stable
security definer
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- ORGANIZATIONS: users can only see their own org
create policy "Users can view own org"
  on public.organizations for select
  using (id = public.get_user_org_id());

create policy "Owners can update own org"
  on public.organizations for update
  using (id = public.get_user_org_id());

-- PROFILES: users can see profiles in their org
create policy "Users can view org profiles"
  on public.profiles for select
  using (org_id = public.get_user_org_id());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- CONTACTS: scoped to org
create policy "Users can view org contacts"
  on public.contacts for select
  using (org_id = public.get_user_org_id());

create policy "Users can create org contacts"
  on public.contacts for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update org contacts"
  on public.contacts for update
  using (org_id = public.get_user_org_id());

create policy "Users can delete org contacts"
  on public.contacts for delete
  using (org_id = public.get_user_org_id());

-- POLICIES: scoped to org
create policy "Users can view org policies"
  on public.policies for select
  using (org_id = public.get_user_org_id());

create policy "Users can create org policies"
  on public.policies for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update org policies"
  on public.policies for update
  using (org_id = public.get_user_org_id());

create policy "Users can delete org policies"
  on public.policies for delete
  using (org_id = public.get_user_org_id());

-- CLAIMS: scoped to org
create policy "Users can view org claims"
  on public.claims for select
  using (org_id = public.get_user_org_id());

create policy "Users can create org claims"
  on public.claims for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update org claims"
  on public.claims for update
  using (org_id = public.get_user_org_id());

create policy "Users can delete org claims"
  on public.claims for delete
  using (org_id = public.get_user_org_id());

-- LEADS: scoped to org
create policy "Users can view org leads"
  on public.leads for select
  using (org_id = public.get_user_org_id());

create policy "Users can create org leads"
  on public.leads for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update org leads"
  on public.leads for update
  using (org_id = public.get_user_org_id());

create policy "Users can delete org leads"
  on public.leads for delete
  using (org_id = public.get_user_org_id());

-- ACTIVITIES: scoped to org
create policy "Users can view org activities"
  on public.activities for select
  using (org_id = public.get_user_org_id());

create policy "Users can create org activities"
  on public.activities for insert
  with check (org_id = public.get_user_org_id());

-- ============================================================
-- AUTO-CREATE PROFILE + ORG ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_org_id uuid;
begin
  -- Create a new organization for the user
  insert into public.organizations (name, slug)
  values (
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)) || '''s Organization',
    replace(lower(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))), ' ', '-') || '-' || substr(new.id::text, 1, 8)
  )
  returning id into new_org_id;

  -- Create profile linked to the org
  insert into public.profiles (id, full_name, email, role, org_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'owner',
    new_org_id
  );

  return new;
end;
$$;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
