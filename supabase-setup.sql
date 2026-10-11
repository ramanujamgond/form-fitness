-- Legacy Supabase setup, retained for old deployments only. The current app uses Neon; see DEPLOYMENT.md.
-- Run in the Supabase SQL Editor. Never publish credentials in this file.
create table if not exists public.journal (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  payload jsonb not null,
  updated_at timestamptz not null,
  primary key (user_id, id),
  constraint valid_payload check (jsonb_typeof(payload) = 'object' and payload->>'id' = id)
);
alter table public.journal enable row level security;
revoke all on public.journal from anon;
grant select, insert, update on public.journal to authenticated;
drop policy if exists "Own records only" on public.journal;
create policy "Own records only" on public.journal for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
-- Preserve a newer edit if an older offline device uploads afterward.
create or replace function public.preserve_newer_journal_record()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.updated_at <= old.updated_at then return old; end if;
  return new;
end;
$$;
drop trigger if exists preserve_newer_record on public.journal;
create trigger preserve_newer_record before update on public.journal
  for each row execute function public.preserve_newer_journal_record();
