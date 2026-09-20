create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Update applications table to allow users to see their own applications
drop policy if exists "Users can read own applications" on public.applications;
create policy "Users can read own applications" on public.applications
  for select
  to authenticated
  using (
    applicant_data->>'email' = (select email from auth.users where id = (select auth.uid()))
  );

-- Update contact_inquiries to link to users
drop policy if exists "Users can read own inquiries" on public.contact_inquiries;
create policy "Users can read own inquiries" on public.contact_inquiries
  for select
  to authenticated
  using (email = (select email from auth.users where id = (select auth.uid())));
