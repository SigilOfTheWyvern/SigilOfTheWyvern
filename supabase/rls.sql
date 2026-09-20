-- Run this whole file in the Supabase SQL editor.
-- Creates the Prisma tables if they are missing, then turns on RLS.

create table if not exists "Role" (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  color text not null default '#c4a574',
  "isSystem" boolean not null default false
);

create table if not exists "RolePermission" (
  id text primary key,
  "roleId" text not null references "Role"(id) on delete cascade,
  resource text not null,
  action text not null,
  unique ("roleId", resource, action)
);

create table if not exists "User" (
  id text primary key,
  email text not null unique,
  name text not null,
  status text not null default 'active',
  "roleId" text not null references "Role"(id),
  "imagePath" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "Product" (
  id text primary key,
  slug text not null unique,
  name text not null,
  kind text not null,
  fabric text not null,
  blurb text not null,
  "priceCents" integer not null,
  "imagePath" text,
  status text not null default 'published',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "ProductVariant" (
  id text primary key,
  "productId" text not null references "Product"(id) on delete cascade,
  size text not null,
  sku text not null unique,
  inventory integer not null default 0,
  "priceCents" integer
);

create table if not exists "Event" (
  id text primary key,
  date timestamp(3) not null,
  city text not null,
  venue text not null,
  support text,
  status text not null default 'on_sale',
  published boolean not null default true,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "TicketType" (
  id text primary key,
  "eventId" text not null references "Event"(id) on delete cascade,
  name text not null,
  "priceCents" integer not null,
  inventory integer not null default 0
);

create table if not exists "Order" (
  id text primary key,
  "userId" text not null references "User"(id),
  status text not null default 'pending',
  "totalCents" integer not null,
  "stripeSessionId" text,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "OrderItem" (
  id text primary key,
  "orderId" text not null references "Order"(id) on delete cascade,
  kind text not null,
  label text not null,
  "variantId" text,
  "ticketTypeId" text,
  qty integer not null,
  "unitCents" integer not null
);

create table if not exists "Ticket" (
  id text primary key,
  "userId" text not null references "User"(id),
  "orderId" text not null references "Order"(id),
  "eventId" text not null references "Event"(id),
  "ticketTypeId" text not null references "TicketType"(id),
  code text not null unique,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "Favorite" (
  id text primary key,
  "userId" text not null references "User"(id) on delete cascade,
  "productId" text not null references "Product"(id) on delete cascade,
  "createdAt" timestamp(3) not null default current_timestamp,
  unique ("userId", "productId")
);

create table if not exists "Notification" (
  id text primary key,
  "userId" text not null references "User"(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "AuditLog" (
  id text primary key,
  "userId" text references "User"(id),
  action text not null,
  resource text not null,
  "targetId" text,
  meta text,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "MediaAsset" (
  id text primary key,
  path text not null,
  name text not null,
  mime text not null,
  size integer not null,
  "uploadedBy" text not null references "User"(id),
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "SitePage" (
  id text primary key,
  slug text not null unique,
  title text not null,
  status text not null default 'draft',
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "PageSection" (
  id text primary key,
  "pageId" text not null references "SitePage"(id) on delete cascade,
  sort integer not null,
  type text not null,
  heading text,
  body text,
  "buttonLabel" text,
  "buttonHref" text,
  "imagePath" text,
  background text,
  published boolean not null default true
);

create table if not exists "SiteSetting" (
  key text primary key,
  value text not null
);

create table if not exists "Album" (
  id text primary key,
  slug text not null unique,
  title text not null,
  type text not null,
  year text not null,
  note text not null,
  tone text not null,
  duration text not null,
  label text not null,
  summary text not null,
  lyrics text not null,
  "imagePath" text,
  recorded text not null default '',
  status text not null default 'published'
);

create table if not exists "Track" (
  id text primary key,
  "albumId" text not null references "Album"(id) on delete cascade,
  title text not null,
  duration text not null,
  featured boolean not null default false,
  sort integer not null default 0
);

create table if not exists "NewsArticle" (
  id text primary key,
  slug text not null unique,
  date text not null,
  title text not null,
  excerpt text not null,
  body text not null,
  status text not null default 'published',
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "BandMember" (
  id text primary key,
  name text not null,
  role text not null,
  mark text not null,
  line text not null,
  "imagePath" text,
  sort integer not null default 0,
  status text not null default 'published'
);

create table if not exists "Video" (
  id text primary key,
  slug text not null unique,
  title text not null,
  kind text not null,
  year text not null,
  length text not null,
  note text not null,
  "imagePath" text,
  "embedUrl" text,
  status text not null default 'published'
);

create table if not exists "Photo" (
  id text primary key,
  caption text not null,
  place text not null,
  path text,
  status text not null default 'published'
);

create table if not exists "ContactMessage" (
  id text primary key,
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "MailingSubscriber" (
  id text primary key,
  email text not null unique,
  "createdAt" timestamp(3) not null default current_timestamp
);

insert into "Role" (id, name, slug, description, color, "isSystem")
values
  ('role_founder', 'Founder', 'founder', 'Founder of the mark. Full control.', '#c4a574', true),
  ('role_fan', 'Fan', 'fan', 'The rite of the crowd.', '#e8e2da', true)
on conflict (slug) do nothing;

insert into "RolePermission" (id, "roleId", resource, action)
select
  'rp_founder_' || resource || '_' || action,
  (select id from "Role" where slug = 'founder'),
  resource,
  action
from (
  values
    ('studio'), ('analytics'), ('pages'), ('music'), ('merch'), ('tickets'),
    ('tour'), ('news'), ('media'), ('band'), ('users'), ('roles'),
    ('orders'), ('cms'), ('settings'), ('audit'), ('inbox'), ('fan')
) as resources(resource)
cross join (
  values
    ('view'), ('create'), ('edit'), ('delete'),
    ('publish'), ('upload'), ('reorder'), ('manage')
) as actions(action)
on conflict ("roleId", resource, action) do nothing;

insert into "RolePermission" (id, "roleId", resource, action)
select
  'rp_fan_' || resource || '_' || action,
  (select id from "Role" where slug = 'fan'),
  resource,
  action
from (
  values
    ('fan', 'view'),
    ('fan', 'edit'),
    ('orders', 'view'),
    ('tickets', 'view')
) as perms(resource, action)
on conflict ("roleId", resource, action) do nothing;

-- Full Founder ownership for the two site owner auth UIDs.
do $$
declare
  founder_id text;
begin
  select id into founder_id from "Role" where slug = 'founder';
  if founder_id is null then
    null;
  else
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
  end if;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'User', 'Role', 'RolePermission', 'Product', 'ProductVariant', 'Event',
    'TicketType', 'Order', 'OrderItem', 'Ticket', 'Favorite', 'Notification',
    'AuditLog', 'MediaAsset', 'SitePage', 'PageSection', 'SiteSetting',
    'Album', 'Track', 'NewsArticle', 'BandMember', 'Video', 'Photo',
    'ContactMessage', 'MailingSubscriber'
  ]
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;
