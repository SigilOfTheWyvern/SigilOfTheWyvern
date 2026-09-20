-- Promote site owners and ensure Founder + Developer hold every door.
-- Safe to re-run.

do $$
declare
  founder_id text;
  developer_id text;
begin
  insert into "Role" (id, name, slug, description, color, "isSystem")
  values
    (replace(gen_random_uuid()::text, '-', ''), 'Founder', 'founder', 'Founder of the mark. Full control.', '#c4a574', true),
    (replace(gen_random_uuid()::text, '-', ''), 'Developer', 'developer', 'Builder of the seal. Same doors as Founder.', '#8f1218', true)
  on conflict (slug) do update
    set
      name = excluded.name,
      description = excluded.description,
      color = excluded.color,
      "isSystem" = true;

  select id into founder_id from "Role" where slug = 'founder';
  select id into developer_id from "Role" where slug = 'developer';
  if founder_id is null or developer_id is null then
    raise exception 'Founder or Developer role is missing.';
  end if;

  insert into "RolePermission" (id, "roleId", resource, action)
  select replace(gen_random_uuid()::text, '-', ''), role_id, resource, action
  from unnest(array[founder_id, developer_id]) as role_id
  cross join unnest(array[
    'studio','analytics','pages','music','merch','tickets','tour','news','media','band',
    'users','roles','orders','cms','settings','audit','inbox','fan'
  ]) as resource
  cross join unnest(array[
    'view','create','edit','delete','publish','upload','reorder','manage'
  ]) as action
  on conflict ("roleId", resource, action) do nothing;

  insert into "SitePage" (id, slug, title, status, "updatedAt")
  values (replace(gen_random_uuid()::text, '-', ''), 'home', 'Home', 'published', current_timestamp)
  on conflict (slug) do nothing;

  update "User"
  set
    "roleId" = founder_id,
    status = 'active',
    "updatedAt" = current_timestamp
  where id = '12ef6288-3691-4d2e-8f86-0102d413aff5';

  update "User"
  set
    "roleId" = developer_id,
    status = 'active',
    "updatedAt" = current_timestamp
  where id = 'd5a16ab4-021d-46b4-89c8-67a567dc8623';

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
      case
        when u.id = 'd5a16ab4-021d-46b4-89c8-67a567dc8623'::uuid then developer_id
        else founder_id
      end,
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
