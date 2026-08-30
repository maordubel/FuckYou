-- ============================================================================
-- 0006 — names may run to 70 characters.
-- "the guy from my building that doesnt like dogs" is 45 characters and is
-- exactly the kind of entry this wall is for, so the 40-character cap was
-- cutting off the funniest half of the traffic. Replaces fy_add and
-- fy_admin_update in place; both keep their signatures. Idempotent.
-- ============================================================================


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
  if char_length(v_name) > 70 then
    return jsonb_build_object('ok', false, 'error', 'long');
  end if;
  if v_reason is not null and char_length(v_reason) > 120 then
    return jsonb_build_object('ok', false, 'error', 'reasonLong');
  end if;

  -- Contact details are never allowed on a public wall, whatever the client did.
  if public.fy_has_contact(v_name) or public.fy_has_contact(v_reason) then
    return jsonb_build_object('ok', false, 'error', 'contact');
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

revoke all on function public.fy_add(text, text, uuid) from public;
grant execute on function public.fy_add(text, text, uuid) to anon, authenticated;

-- The admin editor gets the same ceiling.
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
  if v_name is not null and char_length(v_name) > 70 then
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

revoke all on function public.fy_admin_update(uuid, uuid, text, text, integer, boolean) from public;
grant execute on function public.fy_admin_update(uuid, uuid, text, text, integer, boolean) to anon, authenticated;
