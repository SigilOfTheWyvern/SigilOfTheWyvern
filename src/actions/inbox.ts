"use server";

import { revalidatePath } from "next/cache";
import { recordChange } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "Other").trim();
  const body = String(formData.get("message") ?? "").trim();
  if (!name || !email.includes("@") || body.length < 8) {
    return { error: "Name, a valid email, and a real message are required." };
  }
  const message = await prisma.contactMessage.create({
    data: { name, email, subject, body },
  });
  await recordChange({
    action: "create",
    resource: "inbox",
    targetId: message.id,
    label: `${name} · ${subject}`,
    after: { name, email, subject },
  });
  revalidatePath("/studio/inbox");
  return { ok: true };
}

export async function joinMailingList(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "Enter a valid email." };
  await prisma.mailingSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  await recordChange({
    action: "create",
    resource: "inbox",
    label: email,
    after: { email },
  });
  revalidatePath("/studio/inbox");
  return { ok: true };
}

export async function deleteContactMessage(id: string) {
  const user = await requirePermission("inbox", "delete");
  const previous = await prisma.contactMessage.findUnique({ where: { id } });
  await prisma.contactMessage.delete({ where: { id } });
  await recordChange({
    userId: user.id,
    action: "delete",
    resource: "inbox",
    targetId: id,
    label: previous?.email,
    before: previous,
    after: null,
  });
  revalidatePath("/studio/inbox");
}

export async function deleteSubscriber(id: string) {
  const user = await requirePermission("inbox", "delete");
  const previous = await prisma.mailingSubscriber.findUnique({ where: { id } });
  await prisma.mailingSubscriber.delete({ where: { id } });
  await recordChange({
    userId: user.id,
    action: "delete",
    resource: "inbox",
    targetId: id,
    label: previous?.email,
    before: previous,
    after: null,
  });
  revalidatePath("/studio/inbox");
}
