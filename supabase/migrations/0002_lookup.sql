-- ============================================================================
-- Duplicate lookup: does this name already exist on the list?
-- Additive and idempotent. Normalisation happens in the database so the client
-- can never disagree with it about what counts as the same person.
-- ============================================================================

create or replace function public.fy_lookup(p_name text)
returns jsonb
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select coalesce(
    (
      select jsonb_build_object(
        'id', id,
        'name', name,
        'reason', reason,
        'votes', votes,
        'created_at', created_at
      )
      from public.fy_entries
      where name_key = public.fy_name_key(p_name)
        and not hidden
    ),
    'null'::jsonb
  );
$$;

revoke all on function public.fy_lookup(text) from public;
grant execute on function public.fy_lookup(text) to anon, authenticated;
