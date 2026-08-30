-- ============================================================================
-- Fuck You — schema, RLS and server authority.
-- Idempotent: safe to run twice in a row against an empty database.
-- Tables are read-only to anon. Every write goes through a SECURITY DEFINER
-- function that re-checks the rule itself. No service_role, no Edge Function.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tables ---
create table if not exists public.fy_entries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  name_key       text not null unique,
  reason         text,
  votes          integer not null default 1,
  reports        integer not null default 0,
  hidden         boolean not null default false,
  created_at     timestamptz not null default now(),
  last_signed_at timestamptz not null default now()
);

create table if not exists public.fy_votes (
  entry_id   uuid not null references public.fy_entries (id) on delete cascade,
  voter      uuid not null,
  created_at timestamptz not null default now(),
  primary key (entry_id, voter)
);

create table if not exists public.fy_reports (
  entry_id   uuid not null references public.fy_entries (id) on delete cascade,
  voter      uuid not null,
  created_at timestamptz not null default now(),
  primary key (entry_id, voter)
);

create index if not exists fy_entries_top_idx
  on public.fy_entries (votes desc, last_signed_at desc) where not hidden;
create index if not exists fy_entries_new_idx
  on public.fy_entries (created_at desc) where not hidden;
create index if not exists fy_entries_name_idx
  on public.fy_entries (lower(name));
create index if not exists fy_votes_voter_idx
  on public.fy_votes (voter, created_at desc);

-- ------------------------------------------------------------------ rls ---
alter table public.fy_entries enable row level security;
alter table public.fy_votes   enable row level security;
alter table public.fy_reports enable row level security;

drop policy if exists fy_entries_read on public.fy_entries;
create policy fy_entries_read
  on public.fy_entries for select
  to anon, authenticated
  using (not hidden);

-- fy_votes and fy_reports get no policy at all: unreadable and unwritable
-- from the client. They are only reachable through the functions below.

revoke all on public.fy_entries from anon, authenticated;
revoke all on public.fy_votes   from anon, authenticated;
revoke all on public.fy_reports from anon, authenticated;
grant select on public.fy_entries to anon, authenticated;

-- ------------------------------------------------------------ normalise ---
-- Strips Hebrew niqqud (U+0591-U+05C7) and then every non-alphanumeric, so
-- "משה!" and a vowelised spelling collapse onto the same key.
-- Mirrored in src/lib/text.ts.
create or replace function public.fy_name_key(p_text text)
returns text
language sql
immutable
set search_path = pg_catalog, pg_temp
as $$
  select nullif(
    regexp_replace(
      regexp_replace(
        regexp_replace(lower(btrim(coalesce(p_text, ''))), '[\u0591-\u05C7]', '', 'g'),
        '[^[:alnum:] ]', '', 'g'
      ),
      '[[:space:]]+', ' ', 'g'
    ),
  '');
$$;

-- ------------------------------------------------------------ functions ---
-- Failures return a value. They never RAISE, so the rate-limit rows written in
-- the same transaction survive and the quota applies to the attacker too.

create or replace function public.fy_add(p_name text, p_reason text, p_voter uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name    text := btrim(coalesce(p_name, ''));
  v_reason  text := nullif(btrim(coalesce(p_reason, '')), '');
  v_key     text;
  v_id      uuid;
  v_votes   integer;
  v_recent  integer;
  v_created boolean := false;
  v_signed  boolean := false;
  v_rows    integer := 0;
begin
  if p_voter is null then
    return jsonb_build_object('ok', false, 'error', 'generic');
  end if;
  if char_length(v_name) < 2 then
    return jsonb_build_object('ok', false, 'error', 'short');
  end if;
  if char_length(v_name) > 40 then
    return jsonb_build_object('ok', false, 'error', 'long');
  end if;
  if v_reason is not null and char_length(v_reason) > 120 then
    return jsonb_build_object('ok', false, 'error', 'reasonLong');
  end if;

  v_key := public.fy_name_key(v_name);
  if v_key is null or char_length(v_key) < 2 then
    return jsonb_build_object('ok', false, 'error', 'short');
  end if;

  select count(*) into v_recent
  from public.fy_votes
  where voter = p_voter and created_at > now() - interval '1 minute';
  if v_recent >= 8 then
    return jsonb_build_object('ok', false, 'error', 'rate');
  end if;

  select id into v_id from public.fy_entries where name_key = v_key;

  if v_id is null then
    insert into public.fy_entries (name, name_key, reason)
    values (v_name, v_key, v_reason)
    on conflict (name_key) do nothing
    returning id into v_id;

    v_created := v_id is not null;

    if v_id is null then
      select id into v_id from public.fy_entries where name_key = v_key;
    end if;
  end if;

  if v_id is null then
    return jsonb_build_object('ok', false, 'error', 'generic');
  end if;

  insert into public.fy_votes (entry_id, voter)
  values (v_id, p_voter)
  on conflict do nothing;
  get diagnostics v_rows = row_count;
  v_signed := v_rows > 0;

  if v_signed and not v_created then
    update public.fy_entries
    set votes = votes + 1, last_signed_at = now()
    where id = v_id;
  end if;

  select votes into v_votes from public.fy_entries where id = v_id;

  return jsonb_build_object(
    'ok', true,
    'status', case when v_created then 'created' when v_signed then 'signed' else 'already' end,
    'id', v_id,
    'name', (select name from public.fy_entries where id = v_id),
    'votes', v_votes
  );
end;
$$;

create or replace function public.fy_vote(p_id uuid, p_voter uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name   text;
  v_votes  integer;
  v_recent integer;
  v_signed boolean := false;
  v_rows   integer := 0;
begin
  if p_voter is null or p_id is null then
    return jsonb_build_object('ok', false, 'error', 'generic');
  end if;

  select name into v_name from public.fy_entries where id = p_id and not hidden;
  if v_name is null then
    return jsonb_build_object('ok', false, 'error', 'notFound');
  end if;

  select count(*) into v_recent
  from public.fy_votes
  where voter = p_voter and created_at > now() - interval '1 minute';
  if v_recent >= 20 then
    return jsonb_build_object('ok', false, 'error', 'rate');
  end if;

  insert into public.fy_votes (entry_id, voter)
  values (p_id, p_voter)
  on conflict do nothing;
  get diagnostics v_rows = row_count;
  v_signed := v_rows > 0;

  if v_signed then
    update public.fy_entries
    set votes = votes + 1, last_signed_at = now()
    where id = p_id;
  end if;

  select votes into v_votes from public.fy_entries where id = p_id;

  return jsonb_build_object(
    'ok', true,
    'status', case when v_signed then 'signed' else 'already' end,
    'id', p_id,
    'name', v_name,
    'votes', v_votes
  );
end;
$$;

create or replace function public.fy_report(p_id uuid, p_voter uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_new  boolean := false;
  v_rows integer := 0;
begin
  if p_voter is null or p_id is null then
    return jsonb_build_object('ok', false, 'error', 'generic');
  end if;
  if not exists (select 1 from public.fy_entries where id = p_id) then
    return jsonb_build_object('ok', false, 'error', 'notFound');
  end if;

  insert into public.fy_reports (entry_id, voter)
  values (p_id, p_voter)
  on conflict do nothing;
  get diagnostics v_rows = row_count;
  v_new := v_rows > 0;

  if v_new then
    update public.fy_entries
    set reports = reports + 1,
        hidden  = (reports + 1) >= 3
    where id = p_id;
  end if;

  return jsonb_build_object('ok', true, 'status', 'reported', 'id', p_id);
end;
$$;

create or replace function public.fy_signed(p_voter uuid)
returns setof uuid
language sql
security definer
set search_path = public, pg_temp
as $$
  select entry_id
  from public.fy_votes
  where voter = p_voter
  order by created_at desc
  limit 500;
$$;

create or replace function public.fy_stats()
returns jsonb
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'people', coalesce(count(*), 0),
    'signatures', coalesce(sum(votes), 0)
  )
  from public.fy_entries
  where not hidden;
$$;

-- --------------------------------------------------------------- grants ---
revoke all on function public.fy_name_key(text) from public;
revoke all on function public.fy_add(text, text, uuid) from public;
revoke all on function public.fy_vote(uuid, uuid) from public;
revoke all on function public.fy_report(uuid, uuid) from public;
revoke all on function public.fy_signed(uuid) from public;
revoke all on function public.fy_stats() from public;

grant execute on function public.fy_add(text, text, uuid)    to anon, authenticated;
grant execute on function public.fy_vote(uuid, uuid)         to anon, authenticated;
grant execute on function public.fy_report(uuid, uuid)       to anon, authenticated;
grant execute on function public.fy_signed(uuid)             to anon, authenticated;
grant execute on function public.fy_stats()                  to anon, authenticated;
