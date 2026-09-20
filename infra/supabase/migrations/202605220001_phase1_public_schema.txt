create extension if not exists "pgcrypto";

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  number int not null,
  status text not null check (status in ('open', 'closed', 'full')),
  seats_total int not null default 0,
  seats_remaining int not null default 0,
  open_date timestamptz,
  close_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete set null,
  applicant_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.research_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  creator_id uuid null,
  title text not null,
  abstract text not null,
  methodology text,
  required_expertise jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  visibility text not null default 'public',
  collaborators jsonb not null default '[]'::jsonb,
  lead_name text,
  lead_institution text,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content_md text,
  cover_image text,
  category text,
  author text,
  is_published boolean not null default false,
  publish_date timestamptz,
  seo_data jsonb not null default '{}'::jsonb
);

create table if not exists public.content_events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  date timestamptz,
  location text,
  description text,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'ended')),
  is_paid boolean not null default false,
  capacity int,
  registrants jsonb not null default '[]'::jsonb,
  cover_image text
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  institution text,
  subject text,
  message text not null,
  source_page text,
  created_at timestamptz not null default now()
);

alter table public.batches enable row level security;
alter table public.applications enable row level security;
alter table public.research_projects enable row level security;
alter table public.content_blogs enable row level security;
alter table public.content_events enable row level security;
alter table public.contact_inquiries enable row level security;

drop policy if exists "Public can read batches" on public.batches;
create policy "Public can read batches" on public.batches for select using (true);

drop policy if exists "Public can read public research" on public.research_projects;
create policy "Public can read public research" on public.research_projects for select using (visibility = 'public' and status = 'published');

drop policy if exists "Public can read published blogs" on public.content_blogs;
create policy "Public can read published blogs" on public.content_blogs for select using (is_published = true);

drop policy if exists "Public can read events" on public.content_events;
create policy "Public can read events" on public.content_events for select using (true);

drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications" on public.applications for insert with check (true);

drop policy if exists "Public can submit contact inquiries" on public.contact_inquiries;
create policy "Public can submit contact inquiries" on public.contact_inquiries for insert with check (true);

create index if not exists idx_batches_status_number on public.batches(status, number desc);
create index if not exists idx_research_projects_visibility_created on public.research_projects(visibility, created_at desc);
create index if not exists idx_content_blogs_published_date on public.content_blogs(is_published, publish_date desc);
create index if not exists idx_content_events_status_date on public.content_events(status, date);
create index if not exists idx_applications_created_at on public.applications(created_at desc);
create index if not exists idx_contact_inquiries_created_at on public.contact_inquiries(created_at desc);
