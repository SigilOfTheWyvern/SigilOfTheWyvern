-- Keep only Founder, Developer, Band Member, and Fan.
-- Founder and Developer receive every permission. Safe to re-run.

do $$
declare
  founder_id text;
  developer_id text;
  band_id text;
  fan_id text;
begin
  insert into "Role" (id, name, slug, description, color, "isSystem")
  values
    (replace(gen_random_uuid()::text, '-', ''), 'Founder', 'founder', 'Founder of the mark. Full control of every door.', '#c4a574', true),
    (replace(gen_random_uuid()::text, '-', ''), 'Developer', 'developer', 'Builder of the seal. Same full control as Founder.', '#8f1218', true),
    (replace(gen_random_uuid()::text, '-', ''), 'Band Member', 'band-member', 'Sees Studio. Edits the band page. Views music, tour, media, and news.', '#d6c4a0', true),
    (replace(gen_random_uuid()::text, '-', ''), 'Fan', 'fan', 'The rite of the crowd. Fan hall only.', '#e8e2da', true)
  on conflict (slug) do update
    set
      name = excluded.name,
      description = excluded.description,
      color = excluded.color,
      "isSystem" = true;

  select id into founder_id from "Role" where slug = 'founder';
  select id into developer_id from "Role" where slug = 'developer';
  select id into band_id from "Role" where slug = 'band-member';
  select id into fan_id from "Role" where slug = 'fan';
  if founder_id is null or developer_id is null or band_id is null or fan_id is null then
    raise exception 'Hall roles are missing.';
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

  insert into "RolePermission" (id, "roleId", resource, action)
  select replace(gen_random_uuid()::text, '-', ''), band_id, resource, action
  from (
    values
      ('studio', 'view'),
      ('band', 'view'),
      ('band', 'edit'),
      ('band', 'create'),
      ('band', 'upload'),
      ('music', 'view'),
      ('tour', 'view'),
      ('media', 'view'),
      ('news', 'view'),
      ('fan', 'view'),
      ('fan', 'edit')
  ) as perms(resource, action)
  on conflict ("roleId", resource, action) do nothing;

  insert into "RolePermission" (id, "roleId", resource, action)
  select replace(gen_random_uuid()::text, '-', ''), fan_id, resource, action
  from (
    values
      ('fan', 'view'),
      ('fan', 'edit'),
      ('orders', 'view'),
      ('tickets', 'view')
  ) as perms(resource, action)
  on conflict ("roleId", resource, action) do nothing;

  insert into "SitePage" (id, slug, title, status, "updatedAt")
  values (replace(gen_random_uuid()::text, '-', ''), 'home', 'Home', 'published', current_timestamp)
  on conflict (slug) do nothing;

  update "User"
  set "roleId" = founder_id, status = 'active', "updatedAt" = current_timestamp
  where id = '12ef6288-3691-4d2e-8f86-0102d413aff5';

  update "User"
  set "roleId" = developer_id, status = 'active', "updatedAt" = current_timestamp
  where id = 'd5a16ab4-021d-46b4-89c8-67a567dc8623';

  update "User"
  set "roleId" = fan_id, "updatedAt" = current_timestamp
  where "roleId" not in (founder_id, developer_id, band_id, fan_id);

  delete from "Role"
  where slug not in ('founder', 'developer', 'band-member', 'fan');

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
