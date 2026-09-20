alter table public.applications enable row level security;
alter table public.research_projects enable row level security;

drop policy if exists "Admins can read applications" on public.applications;

create policy "Admins can read applications" on public.applications
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can read research projects" on public.research_projects;

create policy "Admins can read research projects" on public.research_projects
  for select to authenticated
  using ((select public.is_admin()));
