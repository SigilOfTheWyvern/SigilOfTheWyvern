-- Run in the Supabase SQL editor.
-- Public read for CMS images. Writes go through the service role in /api/upload.

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read uploads" on storage.objects;
create policy "Public read uploads"
on storage.objects
for select
to public
using (bucket_id = 'uploads');
