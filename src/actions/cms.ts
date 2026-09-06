"use server";

import { revalidatePath } from "next/cache";
import { recordChange } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { requirePermission, type Action, type Resource } from "@/lib/rbac";
import { revalidateSite } from "@/lib/revalidate";
import { HOME_FIELDS } from "@/lib/site-copy";
import { dollarsToCents, slugify } from "@/lib/slug";
import { eventSchema, productSchema, sectionSchema } from "@/lib/validations";

async function touch(
  userId: string,
  action: Action,
  resource: Resource,
  targetId?: string,
  before?: unknown,
  after?: unknown,
  label?: string,
) {
  await recordChange({ userId, action, resource, targetId, before, after, label });
}

async function requireStatusChange(
  resource: Resource,
  nextStatus: string,
  previous?: string | null,
) {
  const publishing = nextStatus === "published" && previous !== "published";
  const unpublishing = previous === "published" && nextStatus !== "published";
  if (publishing || unpublishing) {
    await requirePermission(resource, "publish");
  }
}

export async function saveProduct(formData: FormData) {
  const user = await requirePermission("merch", formData.get("id") ? "edit" : "create");
  const parsed = productSchema.safeParse({
    slug: String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("name") ?? "")),
    name: formData.get("name"),
    kind: formData.get("kind"),
    fabric: formData.get("fabric"),
    blurb: formData.get("blurb"),
    priceCents: dollarsToCents(formData.get("priceDollars") || formData.get("priceCents")),
    status: formData.get("status"),
    imagePath: String(formData.get("imagePath") ?? ""),
  });
  if (!parsed.success) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.product.findUnique({ where: { id } }) : null;
  await requireStatusChange("merch", parsed.data.status, previous?.status);
  const data = { ...parsed.data, imagePath: parsed.data.imagePath || null };
  const product = id
    ? await prisma.product.update({ where: { id }, data })
    : await prisma.product.create({ data });
  await touch(user.id, id ? "edit" : "create", "merch", product.id, previous, product, product.name);
  revalidateSite("/store", `/store/${product.slug}`, "/studio/merch");
}

export async function saveVariant(formData: FormData) {
  const user = await requirePermission("merch", "edit");
  const id = String(formData.get("id") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const size = String(formData.get("size") ?? "").trim();
  const product = productId ? await prisma.product.findUnique({ where: { id: productId } }) : null;
  const sku = String(formData.get("sku") ?? "").trim() || `${product?.slug ?? "relic"}-${slugify(size)}`;
  const inventory = Number(formData.get("inventory") ?? 0);
  if (!size || Number.isNaN(inventory)) {
    return;
  }
  const previous = id ? await prisma.productVariant.findUnique({ where: { id } }) : null;
  const variant = id
    ? await prisma.productVariant.update({ where: { id }, data: { size, sku, inventory } })
    : await prisma.productVariant.create({
        data: { productId, size, sku, inventory },
      });
  await touch(user.id, id ? "edit" : "create", "merch", variant.id, previous, variant, `${variant.size} ${variant.sku}`);
  revalidateSite("/store", product?.slug ? `/store/${product.slug}` : "", "/studio/merch");
}

export async function deleteVariant(id: string) {
  const user = await requirePermission("merch", "delete");
  const previous = await prisma.productVariant.findUnique({ where: { id } });
  await prisma.productVariant.delete({ where: { id } });
  await touch(user.id, "delete", "merch", id, previous, null, previous?.sku);
  revalidateSite("/store", "/studio/merch");
}

export async function deleteProduct(id: string) {
  const user = await requirePermission("merch", "delete");
  const previous = await prisma.product.findUnique({ where: { id } });
  await prisma.product.delete({ where: { id } });
  await touch(user.id, "delete", "merch", id, previous, null, previous?.name);
  revalidateSite("/store", previous?.slug ? `/store/${previous.slug}` : "", "/studio/merch", "/fan/saved");
}

export async function saveEvent(formData: FormData) {
  const user = await requirePermission("tour", formData.get("id") ? "edit" : "create");
  const parsed = eventSchema.safeParse({
    city: formData.get("city"),
    venue: formData.get("venue"),
    support: formData.get("support") || undefined,
    date: formData.get("date"),
    status: formData.get("status"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.event.findUnique({ where: { id } }) : null;
  const nextPublished = Boolean(parsed.data.published);
  if ((previous ? previous.published : false) !== nextPublished) {
    await requirePermission("tour", "publish");
  }
  const data = {
    city: parsed.data.city,
    venue: parsed.data.venue,
    support: parsed.data.support,
    date: new Date(parsed.data.date),
    status: parsed.data.status,
    published: Boolean(parsed.data.published),
  };
  const event = id
    ? await prisma.event.update({ where: { id }, data })
    : await prisma.event.create({ data });
  await touch(user.id, id ? "edit" : "create", "tour", event.id, previous, event, event.city);
  revalidateSite("/tour", `/tour/${event.id}`, "/studio/tour", "/studio/tickets");
}

export async function saveTicketType(formData: FormData) {
  const user = await requirePermission("tickets", "create");
  const eventId = String(formData.get("eventId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const priceCents = dollarsToCents(formData.get("priceDollars") || formData.get("priceCents"));
  const inventory = Number(formData.get("inventory") ?? 0);
  if (!eventId || !name) return;
  const type = await prisma.ticketType.create({
    data: { eventId, name, priceCents, inventory },
  });
  await touch(user.id, "create", "tickets", type.id, null, type, type.name);
  revalidateSite("/tour", `/tour/${eventId}`, "/studio/tickets", "/studio/tour");
}

export async function saveNews(formData: FormData) {
  const user = await requirePermission("news", formData.get("id") ? "edit" : "create");
  const data = {
    slug: String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("title") ?? "")),
    date: String(formData.get("date") ?? ""),
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    body: String(formData.get("body") ?? ""),
    status: String(formData.get("status") ?? "draft"),
  };
  if (!data.slug || !data.title || !data.body) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.newsArticle.findUnique({ where: { id } }) : null;
  await requireStatusChange("news", data.status, previous?.status);
  const article = id
    ? await prisma.newsArticle.update({ where: { id }, data })
    : await prisma.newsArticle.create({ data });
  await touch(user.id, id ? "edit" : "create", "news", article.id, previous, article, article.title);
  revalidateSite("/news", `/news/${article.slug}`, "/studio/news");
}

export async function deleteNews(id: string) {
  const user = await requirePermission("news", "delete");
  const previous = await prisma.newsArticle.findUnique({ where: { id } });
  await prisma.newsArticle.delete({ where: { id } });
  await touch(user.id, "delete", "news", id, previous, null, previous?.title);
  revalidateSite("/news", previous?.slug ? `/news/${previous.slug}` : "", "/studio/news");
}

export async function saveMember(formData: FormData) {
  const user = await requirePermission("band", formData.get("id") ? "edit" : "create");
  const data = {
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    mark: String(formData.get("mark") ?? ""),
    line: String(formData.get("line") ?? ""),
    imagePath: String(formData.get("imagePath") ?? "") || null,
    sort: Number(formData.get("sort") ?? 0),
    status: String(formData.get("status") ?? "published"),
  };
  if (!data.name || !data.role) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.bandMember.findUnique({ where: { id } }) : null;
  await requireStatusChange("band", data.status, previous?.status);
  const member = id
    ? await prisma.bandMember.update({ where: { id }, data })
    : await prisma.bandMember.create({ data });
  await touch(user.id, id ? "edit" : "create", "band", member.id, previous, member, member.name);
  revalidateSite("/band", "/studio/band");
}

export async function saveAlbum(formData: FormData) {
  const user = await requirePermission("music", formData.get("id") ? "edit" : "create");
  const data = {
    slug: String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("title") ?? "")),
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    year: String(formData.get("year") ?? ""),
    note: String(formData.get("note") ?? ""),
    tone: String(formData.get("tone") ?? "from-charcoal via-void to-steel/60"),
    duration: String(formData.get("duration") ?? ""),
    label: String(formData.get("label") ?? ""),
    recorded: String(formData.get("recorded") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    lyrics: String(formData.get("lyrics") ?? ""),
    imagePath: String(formData.get("imagePath") ?? "") || null,
    status: String(formData.get("status") ?? "draft"),
  };
  if (!data.slug || !data.title) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.album.findUnique({ where: { id } }) : null;
  await requireStatusChange("music", data.status, previous?.status);
  const album = id
    ? await prisma.album.update({ where: { id }, data })
    : await prisma.album.create({ data });
  await touch(user.id, id ? "edit" : "create", "music", album.id, previous, album, album.title);
  revalidateSite("/music", `/music/${album.slug}`, "/studio/music");
}

export async function saveSetting(key: string, value: string) {
  const user = await requirePermission("settings", "edit");
  const previous = await prisma.siteSetting.findUnique({ where: { key } });
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  await touch(user.id, "edit", "settings", key, { value: previous?.value ?? "" }, { value }, key);
  revalidateSite("/fan/vault", "/studio/pages", "/studio/settings");
}

export async function saveSettingGroup(formData: FormData) {
  await requirePermission("settings", "edit");
  const keys = new Set<string>(["home.logo", ...HOME_FIELDS.map((field) => field.key)]);
  for (const [key, value] of formData.entries()) {
    if (!keys.has(key) || typeof value !== "string") continue;
    await saveSetting(key, value);
  }
}

export async function saveSection(formData: FormData) {
  const user = await requirePermission("pages", formData.get("id") ? "edit" : "create");
  const parsed = sectionSchema.safeParse({
    type: formData.get("type"),
    heading: formData.get("heading") || undefined,
    body: formData.get("body") || undefined,
    buttonLabel: formData.get("buttonLabel") || undefined,
    buttonHref: formData.get("buttonHref") || undefined,
    imagePath: formData.get("imagePath") || undefined,
    background: formData.get("background") || undefined,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return;
  const pageId = String(formData.get("pageId") ?? "");
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.pageSection.findUnique({ where: { id } }) : null;
  const count = await prisma.pageSection.count({ where: { pageId } });
  const section = id
    ? await prisma.pageSection.update({
        where: { id },
        data: { ...parsed.data, imagePath: String(formData.get("imagePath") ?? "") || null },
      })
    : await prisma.pageSection.create({
        data: {
          ...parsed.data,
          pageId,
          sort: count + 1,
          published: parsed.data.published ?? true,
          imagePath: String(formData.get("imagePath") ?? "") || null,
        },
      });
  await touch(user.id, id ? "edit" : "create", "pages", section.id, previous, section, section.heading ?? "Home block");
  revalidateSite("/studio/pages");
}

export async function reorderSection(id: string, direction: "up" | "down") {
  const user = await requirePermission("pages", "reorder");
  const section = await prisma.pageSection.findUnique({ where: { id } });
  if (!section) return;
  const swap = await prisma.pageSection.findFirst({
    where: {
      pageId: section.pageId,
      sort: direction === "up" ? { lt: section.sort } : { gt: section.sort },
    },
    orderBy: { sort: direction === "up" ? "desc" : "asc" },
  });
  if (!swap) return;
  await prisma.$transaction([
    prisma.pageSection.update({ where: { id: section.id }, data: { sort: swap.sort } }),
    prisma.pageSection.update({ where: { id: swap.id }, data: { sort: section.sort } }),
  ]);
  await touch(user.id, "reorder", "pages", id, { sort: section.sort }, { sort: swap.sort }, section.heading ?? "Home block");
  revalidateSite("/studio/pages");
}

export async function publishPage(id: string, status: "draft" | "published") {
  const user = await requirePermission("pages", "publish");
  const previous = await prisma.sitePage.findUnique({ where: { id } });
  await prisma.sitePage.update({ where: { id }, data: { status } });
  await touch(user.id, "publish", "pages", id, { status: previous?.status }, { status }, previous?.title);
  revalidateSite("/studio/pages");
}

export async function saveVideo(formData: FormData) {
  const user = await requirePermission("media", formData.get("id") ? "edit" : "create");
  const data = {
    slug: String(formData.get("slug") ?? "").trim() || slugify(String(formData.get("title") ?? "")),
    title: String(formData.get("title") ?? ""),
    kind: String(formData.get("kind") ?? ""),
    year: String(formData.get("year") ?? ""),
    length: String(formData.get("length") ?? ""),
    note: String(formData.get("note") ?? ""),
    imagePath: String(formData.get("imagePath") ?? "") || null,
    embedUrl: String(formData.get("embedUrl") ?? "").trim() || null,
    status: String(formData.get("status") ?? "published"),
  };
  if (!data.slug || !data.title) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.video.findUnique({ where: { id } }) : null;
  await requireStatusChange("media", data.status, previous?.status);
  const video = id
    ? await prisma.video.update({ where: { id }, data })
    : await prisma.video.create({ data });
  await touch(user.id, id ? "edit" : "create", "media", video.id, previous, video, video.title);
  revalidateSite("/media", "/studio/media");
}

export async function savePhoto(formData: FormData) {
  const user = await requirePermission("media", formData.get("id") ? "edit" : "create");
  const data = {
    caption: String(formData.get("caption") ?? "").trim(),
    place: String(formData.get("place") ?? "").trim(),
    path: String(formData.get("imagePath") ?? "") || null,
    status: String(formData.get("status") ?? "published"),
  };
  if (!data.path) return;
  const id = String(formData.get("id") || "");
  const previous = id ? await prisma.photo.findUnique({ where: { id } }) : null;
  await requireStatusChange("media", data.status, previous?.status);
  const photo = id
    ? await prisma.photo.update({ where: { id }, data })
    : await prisma.photo.create({ data });
  await touch(user.id, id ? "edit" : "create", "media", photo.id, previous, photo, photo.caption || "Still");
  revalidateSite("/media", "/studio/media");
}

export async function deletePhoto(id: string) {
  const user = await requirePermission("media", "delete");
  const previous = await prisma.photo.findUnique({ where: { id } });
  await prisma.photo.delete({ where: { id } });
  await touch(user.id, "delete", "media", id, previous, null, previous?.caption || "Still");
  revalidateSite("/media", "/studio/media");
}

export async function deleteEvent(id: string) {
  const user = await requirePermission("tour", "delete");
  const previous = await prisma.event.findUnique({ where: { id } });
  await prisma.ticket.deleteMany({ where: { eventId: id } });
  await prisma.ticketType.deleteMany({ where: { eventId: id } });
  await prisma.event.delete({ where: { id } });
  await touch(user.id, "delete", "tour", id, previous, null, previous?.city);
  revalidateSite("/tour", `/tour/${id}`, "/studio/tour", "/studio/tickets");
}

export async function saveTicketTypeUpdate(formData: FormData) {
  const user = await requirePermission("tickets", "edit");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const priceCents = dollarsToCents(formData.get("priceDollars") || formData.get("priceCents"));
  const inventory = Number(formData.get("inventory") ?? 0);
  if (!id || !name) return;
  const previous = await prisma.ticketType.findUnique({ where: { id } });
  const type = await prisma.ticketType.update({ where: { id }, data: { name, priceCents, inventory } });
  await touch(user.id, "edit", "tickets", id, previous, type, name);
  revalidateSite("/tour", previous?.eventId ? `/tour/${previous.eventId}` : "", "/studio/tickets", "/studio/tour");
}

export async function deleteTicketType(id: string) {
  const user = await requirePermission("tickets", "delete");
  const previous = await prisma.ticketType.findUnique({ where: { id } });
  await prisma.ticket.deleteMany({ where: { ticketTypeId: id } });
  await prisma.ticketType.delete({ where: { id } });
  await touch(user.id, "delete", "tickets", id, previous, null, previous?.name);
  revalidateSite("/tour", previous?.eventId ? `/tour/${previous.eventId}` : "", "/studio/tickets", "/studio/tour");
}

export async function deleteAlbum(id: string) {
  const user = await requirePermission("music", "delete");
  const previous = await prisma.album.findUnique({ where: { id } });
  await prisma.album.delete({ where: { id } });
  await touch(user.id, "delete", "music", id, previous, null, previous?.title);
  revalidateSite("/music", previous?.slug ? `/music/${previous.slug}` : "", "/studio/music");
}

export async function saveTrack(formData: FormData) {
  const user = await requirePermission("music", "edit");
  const albumId = String(formData.get("albumId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  if (!albumId || !title) return;
  const sort = await prisma.track.count({ where: { albumId } });
  const track = await prisma.track.create({
    data: { albumId, title, duration: duration || "0:00", sort },
  });
  await touch(user.id, "create", "music", track.id, null, track, track.title);
  revalidateSite("/music", "/studio/music");
}

export async function deleteTrack(id: string) {
  const user = await requirePermission("music", "delete");
  const previous = await prisma.track.findUnique({ where: { id } });
  await prisma.track.delete({ where: { id } });
  await touch(user.id, "delete", "music", id, previous, null, previous?.title);
  revalidateSite("/music", "/studio/music");
}

export async function deleteMember(id: string) {
  const user = await requirePermission("band", "delete");
  const previous = await prisma.bandMember.findUnique({ where: { id } });
  await prisma.bandMember.delete({ where: { id } });
  await touch(user.id, "delete", "band", id, previous, null, previous?.name);
  revalidateSite("/band", "/studio/band");
}

export async function deleteVideo(id: string) {
  const user = await requirePermission("media", "delete");
  const previous = await prisma.video.findUnique({ where: { id } });
  await prisma.video.delete({ where: { id } });
  await touch(user.id, "delete", "media", id, previous, null, previous?.title);
  revalidateSite("/media", "/studio/media");
}

export async function deleteSection(id: string) {
  const user = await requirePermission("pages", "delete");
  const previous = await prisma.pageSection.findUnique({ where: { id } });
  await prisma.pageSection.delete({ where: { id } });
  await touch(user.id, "delete", "pages", id, previous, null, previous?.heading ?? "Home block");
  revalidateSite("/studio/pages");
}

export async function setOrderStatus(formData: FormData) {
  const user = await requirePermission("orders", "manage");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  const previous = await prisma.order.findUnique({ where: { id } });
  const order = await prisma.order.update({ where: { id }, data: { status } });
  await touch(user.id, "manage", "orders", id, { status: previous?.status }, { status: order.status }, order.id.slice(-8));
  revalidatePath("/studio/orders");
}
