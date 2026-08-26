-- Additive hardening: preserve tables and data while narrowing client access.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

 drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Admins can read profiles" on public.profiles
  for select to authenticated using ((select public.is_admin()));
create policy "Users can read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Admins can update profiles" on public.profiles
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

 drop policy if exists "Public can read events" on public.content_events;
create policy "Public can read events without registrants" on public.content_events
  for select to anon, authenticated
  using (true);

revoke select (registrants) on public.content_events from anon, authenticated;

 drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id and role = 'member');
