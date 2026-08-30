-- ============================================================================
-- 0005 — the admin functions could not see crypt().
--
-- A SECURITY DEFINER function must pin its search_path, and these pinned
-- `public, pg_temp`. On Supabase pgcrypto is installed into the `extensions`
-- schema, not public, so crypt() and gen_salt() were invisible inside the
-- function and every login raised instead of comparing. Locally pgcrypto lands
-- in public, which is why it passed here and failed there.
--
-- Fix: keep the path pinned, and include the schema the extension actually
-- lives in. A schema that does not exist is ignored, so this is correct on both
-- Supabase and a bare Postgres.
-- ============================================================================

create or replace function public.fy_admin_login(p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_recent integer;
  v_hash   text;
  v_token  uuid;
begin
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

create or replace function public.fy_admin_set_password(p_token uuid, p_current text, p_new text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
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

-- Re-seed the password through a path that can see crypt(), in case 0003 wrote
-- a row with a hash that was never usable.
do $$
begin
  if not exists (select 1 from public.fy_admin where id = 1) then
    insert into public.fy_admin (id, password_hash) values (1, crypt('hapoelTA14!', gen_salt('bf', 12)));
  end if;
end;
$$;

-- Every failed attempt while the function was broken counted toward the
-- fifteen-minute lockout. Clear the slate.
delete from public.fy_admin_attempts where not ok;

revoke all on function public.fy_admin_login(text) from public;
revoke all on function public.fy_admin_set_password(uuid, text, text) from public;
grant execute on function public.fy_admin_login(text) to anon, authenticated;
grant execute on function public.fy_admin_set_password(uuid, text, text) to anon, authenticated;
