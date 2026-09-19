import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { recordChange } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { RESOURCES } from "@/lib/rbac-constants";
import { getAuthUser, hasPermission } from "@/lib/rbac";
import { storeUpload } from "@/lib/storage";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getAuthUser();
  const canUpload = user && RESOURCES.some((resource) => hasPermission(user, resource, "upload"));
  if (!user || !canUpload) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type) || file.size > MAX) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = `${randomBytes(8).toString("hex")}.${ext}`;
  let publicPath: string;
  try {
    publicPath = await storeUpload(file, name);
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  await prisma.mediaAsset.create({
    data: {
      path: publicPath,
      name: file.name.slice(0, 120),
      mime: file.type,
      size: file.size,
      uploadedBy: user.id,
    },
  });
  await recordChange({
    userId: user.id,
    action: "upload",
    resource: "media",
    targetId: publicPath,
    label: file.name,
    before: { path: "empty" },
    after: { path: publicPath },
  });

  const wantsJson = request.headers.get("accept")?.includes("application/json");
  if (wantsJson) {
    return NextResponse.json({ path: publicPath, name: file.name });
  }

  return NextResponse.redirect(new URL("/studio/media", request.url));
}
