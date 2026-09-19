import { createSupabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "uploads";

export function isSupabaseStoragePath(filePath: string) {
  return filePath.includes("/storage/v1/object/public/");
}

function objectNameFromPath(filePath: string) {
  const marker = `/object/public/${BUCKET}/`;
  const index = filePath.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(filePath.slice(index + marker.length).split("?")[0] ?? "");
}

export async function storeUpload(file: File, name: string) {
  const admin = createSupabaseAdmin();
  if (!admin) {
    throw new Error("Supabase Storage is not configured.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(name, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return admin.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

export async function removeStoredFile(filePath?: string | null) {
  if (!filePath || !isSupabaseStoragePath(filePath)) return;
  const admin = createSupabaseAdmin();
  const objectName = objectNameFromPath(filePath);
  if (!admin || !objectName) return;
  await admin.storage.from(BUCKET).remove([objectName]);
}
