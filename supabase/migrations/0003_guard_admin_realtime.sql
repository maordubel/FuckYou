-- ============================================================================
-- 0003 — content guard, hidden admin, audit trail, realtime.
-- Additive and idempotent. Everything privileged is checked in the database on
-- the first line of the function; the client is never the authority.
-- ============================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------ guard ------
-- Names and reasons are public and permanent-ish, so contact details never
-- belong in them. This runs inside fy_add, which is the only way in.
create or replace function public.fy_has_contact(p_text text)
returns boolean
language sql
immutable
set search_path = pg_catalog, pg_temp
as $$
  select coalesce(p_text, '') ~* '(\+?\d[\d\s().-]{6,}\d)'          -- phone numbers
      or coalesce(p_text, '') ~* '[[:alnum:]._%+-]+@[[:alnum:].-]+\.[a-z]{2,}'  -- email
      or coalesce(p_text, '') ~* '(https?://|www\.)'                -- links
      or coalesce(p_text, '') ~* '@[[:alnum:]_]{4,}';               -- handles
$$;

-- ------------------------------------------------------------- audit -----
-- On the table, not inside the functions: this also catches a manual UPDATE
-- from the SQL editor, which is the change most worth recording.
create table if not exists public.fy_audit (
  id         bigserial primary key,
  at         timestamptz not null default now(),
  action     text not null,
  entry_id   uuid,
  before     jsonb,
  after      jsonb,
  actor      text not null default current_user
);

alter table public.fy_audit enable row level security;
revoke all on public.fy_audit from anon, authenticated;

create or replace function public.fy_audit_entries()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    insert into public.fy_audit (action, entry_id, before) values ('delete', old.id, to_jsonb(old));
    return old;
  end if;

  if tg_op = 'UPDATE' then
    -- a vote is not an edit; only record the things a person changes
    if old.name is distinct from new.name
       or old.reason is distinct from new.reason
       or old.hidden is distinct from new.hidden
       or old.votes is distinct from new.votes and abs(new.votes - old.votes) > 1 then
      insert into public.fy_audit (action, entry_id, before, after)
      values ('update', new.id, to_jsonb(old), to_jsonb(new));
    end if;
    return new;
  end if;

  insert into public.fy_audit (action, entry_id, after) values ('insert', new.id, to_jsonb(new));
  return new;
end;
$$;

drop trigger if exists fy_entries_audit on public.fy_entries;
create trigger fy_entries_audit
  after insert or update or delete on public.fy_entries
  for each row execute function public.fy_audit_entries();

-- ------------------------------------------------------------- admin -----
create table if not exists public.fy_admin (
  id            smallint primary key default 1,
  password_hash text not null,
  updated_at    timestamptz not null default now(),
  constraint fy_admin_single_row check (id = 1)
);

create table if not exists public.fy_admin_sessions (
  token      uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '12 hours'
);

create table if not exists public.fy_admin_attempts (
  id      bigserial primary key,
  at      timestamptz not null default now(),
  ok      boolean not null
);

alter table public.fy_admin enable row level security;
alter table public.fy_admin_sessions enable row level security;
alter table public.fy_admin_attempts enable row level security;
revoke all on public.fy_admin, public.fy_admin_sessions, public.fy_admin_attempts from anon, authenticated;

-- Seed the admin row with a password nobody knows — a random string hashed and
-- thrown away. No secret has ever lived in this repository. Set a real one from
-- the SQL editor after running the migrations; see README, "Set the password".
insert into public.fy_admin (id, password_hash)
values (1, crypt(gen_random_uuid()::text || gen_random_uuid()::text, gen_salt('bf', 12)))
on conflict (id) do nothing;

/** True when the token is a live session. Every admin function calls this on
    its first line — the client never decides. */
create or replace function public.fy_admin_ok(p_token uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.fy_admin_sessions
    where token = p_token and expires_at > now()
  );
$$;

create or replace function public.fy_admin_login(p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_recent integer;
  v_hash   text;
  v_token  uuid;
begin
  -- Count the attempt first and never raise, so a wrong guess still costs the
  -- guesser a slot in the window.
  select count(*) into v_recent
  from public.fy_admin_attempts
  where at > now() - interval '15 minutes' and not ok;

  if v_recent >= 10 then
    insert into public.fy_admin_attempts (ok) values (false);
    return jsonb_build_object('ok', false, 'error', 'rate');
  end if;

  select password_hash into v_hash from public.fy_admin where id = 1;

  if v_hash is null or v_hash <> crypt(coalesce(p_password, ''), v_hash) then
    insert into public.fy_admin_attempts (ok) values (false);
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;

  delete from public.fy_admin_sessions where expires_at < now();
  insert into public.fy_admin_sessions default values returning token into v_token;
  insert into public.fy_admin_attempts (ok) values (true);

  return jsonb_build_object('ok', true, 'token', v_token);
end;
$$;

create or replace function public.fy_admin_logout(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.fy_admin_sessions where token = p_token;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.fy_admin_set_password(p_token uuid, p_current text, p_new text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_hash text;
begin
  if not public.fy_admin_ok(p_token) then
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;
  if char_length(coalesce(p_new, '')) < 10 then
    return jsonb_build_object('ok', false, 'error', 'weak');
  end if;

  select password_hash into v_hash from public.fy_admin where id = 1;
  if v_hash is null or v_hash <> crypt(coalesce(p_current, ''), v_hash) then
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;

  update public.fy_admin set password_hash = crypt(p_new, gen_salt('bf', 12)), updated_at = now() where id = 1;
  delete from public.fy_admin_sessions;
  return jsonb_build_object('ok', true);
end;
$$;

/** The admin list sees hidden rows too — that is the point of it. */
create or replace function public.fy_admin_list(p_token uuid, p_query text default '', p_limit integer default 200)
returns jsonb
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  v_rows jsonb;
begin
  if not public.fy_admin_ok(p_token) then
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;

  select coalesce(jsonb_agg(row order by votes desc), '[]'::jsonb) into v_rows
  from (
    select jsonb_build_object(
             'id', id, 'name', name, 'reason', reason, 'votes', votes,
             'reports', reports, 'hidden', hidden, 'created_at', created_at
           ) as row,
           votes
    from public.fy_entries
    where coalesce(p_query, '') = '' or name ilike '%' || p_query || '%'
    order by votes desc
    limit least(greatest(coalesce(p_limit, 200), 1), 500)
  ) t;

  return jsonb_build_object('ok', true, 'rows', v_rows);
end;
$$;

create or replace function public.fy_admin_update(
  p_token uuid,
  p_id uuid,
  p_name text default null,
  p_reason text default null,
  p_votes integer default null,
  p_hidden boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text;
begin
  if not public.fy_admin_ok(p_token) then
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;
  if not exists (select 1 from public.fy_entries where id = p_id) then
    return jsonb_build_object('ok', false, 'error', 'notFound');
  end if;

  v_name := nullif(btrim(coalesce(p_name, '')), '');
  if v_name is not null and char_length(v_name) > 40 then
    return jsonb_build_object('ok', false, 'error', 'long');
  end if;

  update public.fy_entries
  set name     = coalesce(v_name, name),
      name_key = coalesce(public.fy_name_key(v_name), name_key),
      reason   = case when p_reason is null then reason else nullif(btrim(p_reason), '') end,
      votes    = greatest(coalesce(p_votes, votes), 0),
      hidden   = coalesce(p_hidden, hidden)
  where id = p_id;

  return jsonb_build_object('ok', true);
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'duplicate');
end;
$$;

create or replace function public.fy_admin_delete(p_token uuid, p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.fy_admin_ok(p_token) then
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;

  delete from public.fy_entries where id = p_id;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.fy_admin_audit(p_token uuid, p_limit integer default 60)
returns jsonb
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  v_rows jsonb;
begin
  if not public.fy_admin_ok(p_token) then
    return jsonb_build_object('ok', false, 'error', 'denied');
  end if;

  select coalesce(jsonb_agg(r), '[]'::jsonb) into v_rows
  from (
    select jsonb_build_object('at', at, 'action', action, 'entry_id', entry_id,
                              'before', before -> 'name', 'after', after -> 'name') as r
    from public.fy_audit
    order by at desc
    limit least(greatest(coalesce(p_limit, 60), 1), 200)
  ) t;

  return jsonb_build_object('ok', true, 'rows', v_rows);
end;
$$;

-- ------------------------------------------------------------- grants ----
revoke all on function public.fy_has_contact(text) from public;
revoke all on function public.fy_admin_ok(uuid) from public;
revoke all on function public.fy_admin_login(text) from public;
revoke all on function public.fy_admin_logout(uuid) from public;
revoke all on function public.fy_admin_set_password(uuid, text, text) from public;
revoke all on function public.fy_admin_list(uuid, text, integer) from public;
revoke all on function public.fy_admin_update(uuid, uuid, text, text, integer, boolean) from public;
revoke all on function public.fy_admin_delete(uuid, uuid) from public;
revoke all on function public.fy_admin_audit(uuid, integer) from public;

grant execute on function public.fy_admin_login(text)                                   to anon, authenticated;
grant execute on function public.fy_admin_logout(uuid)                                  to anon, authenticated;
grant execute on function public.fy_admin_set_password(uuid, text, text)                to anon, authenticated;
grant execute on function public.fy_admin_list(uuid, text, integer)                     to anon, authenticated;
grant execute on function public.fy_admin_update(uuid, uuid, text, text, integer, boolean) to anon, authenticated;
grant execute on function public.fy_admin_delete(uuid, uuid)                            to anon, authenticated;
grant execute on function public.fy_admin_audit(uuid, integer)                           to anon, authenticated;

-- ----------------------------------------------------------- realtime ----
-- The wall listens for changes so a count climbs while you are looking at it.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'fy_entries'
  ) then
    execute 'alter publication supabase_realtime add table public.fy_entries';
  end if;
exception
  when undefined_object then null;  -- publication absent on a bare Postgres
end;
$$;
