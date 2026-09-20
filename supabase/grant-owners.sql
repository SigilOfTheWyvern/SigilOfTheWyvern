-- Promote the two site owners to Founder (full hall/studio + fan dashboard).
-- Run in the Supabase SQL editor. Safe to re-run.
-- Requires the Founder role (created by rls.sql / seed / ensureHallRoles).

do $$
declare
  founder_id text;
begin
  select id into founder_id from "Role" where slug = 'founder';
  if founder_id is null then
    raise exception 'Founder role is missing. Run supabase/rls.sql or seed roles first.';
  end if;

  update "User"
  set
    "roleId" = founder_id,
    status = 'active',
    "updatedAt" = current_timestamp
  where id in (
    '12ef6288-3691-4d2e-8f86-0102d413aff5',
    'd5a16ab4-021d-46b4-89c8-67a567dc8623'
  );

  if to_regclass('auth.users') is not null then
    insert into "User" (id, email, name, status, "roleId", "createdAt", "updatedAt")
    select
      u.id::text,
      lower(u.email),
      coalesce(
        nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')), ''),
        split_part(u.email, '@', 1)
      ),
      'active',
      founder_id,
      current_timestamp,
      current_timestamp
    from auth.users u
    where u.id in (
      '12ef6288-3691-4d2e-8f86-0102d413aff5'::uuid,
      'd5a16ab4-021d-46b4-89c8-67a567dc8623'::uuid
    )
    on conflict (id) do update
      set
        email = excluded.email,
        "roleId" = excluded."roleId",
        status = 'active',
        "updatedAt" = current_timestamp;
  end if;
end $$;
