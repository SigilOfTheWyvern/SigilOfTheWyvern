import { prisma } from "@/lib/prisma";

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: { status: "published" },
    include: { variants: true },
    orderBy: { name: "asc" },
  });
}

export async function getPublishedProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "published" },
    include: { variants: true },
  });
}

export async function getPublishedEvents() {
  return prisma.event.findMany({
    where: { published: true },
    include: { ticketTypes: true },
    orderBy: { date: "asc" },
  });
}

export async function getPublishedEvent(id: string) {
  return prisma.event.findFirst({
    where: { id, published: true },
    include: { ticketTypes: true },
  });
}

export async function getPublishedAlbums() {
  return prisma.album.findMany({
    where: { status: "published" },
    include: { tracks: { orderBy: { sort: "asc" } } },
    orderBy: { year: "desc" },
  });
}

export async function getPublishedAlbum(slug: string) {
  return prisma.album.findFirst({
    where: { slug, status: "published" },
    include: { tracks: { orderBy: { sort: "asc" } } },
  });
}

export async function getPublishedNews() {
  return prisma.newsArticle.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedNewsItem(slug: string) {
  return prisma.newsArticle.findFirst({
    where: { slug, status: "published" },
  });
}

export async function getPublishedMembers() {
  return prisma.bandMember.findMany({
    where: { status: "published" },
    orderBy: { sort: "asc" },
  });
}

export async function getPublishedVideos() {
  return prisma.video.findMany({
    where: { status: "published" },
    orderBy: { year: "desc" },
  });
}

export async function getPublishedPhotos() {
  return prisma.photo.findMany({
    where: { status: "published" },
  });
}

export async function getSiteSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function getPublishedPage(slug: string) {
  return prisma.sitePage.findFirst({
    where: { slug, status: "published" },
    include: { sections: { where: { published: true }, orderBy: { sort: "asc" } } },
  });
}

export { money } from "@/lib/money";
