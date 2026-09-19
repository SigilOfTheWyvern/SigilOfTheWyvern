import { prisma } from "@/lib/prisma";

async function readMany<T>(label: string, run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run();
  } catch (error) {
    console.error(`catalog.${label}`, error);
    return [];
  }
}

async function readOne<T>(label: string, run: () => Promise<T | null>): Promise<T | null> {
  try {
    return await run();
  } catch (error) {
    console.error(`catalog.${label}`, error);
    return null;
  }
}

export async function getPublishedProducts() {
  return readMany("products", () =>
    prisma.product.findMany({
      where: { status: "published" },
      include: { variants: true },
      orderBy: { name: "asc" },
    }),
  );
}

export async function getPublishedProduct(slug: string) {
  return readOne("product", () =>
    prisma.product.findFirst({
      where: { slug, status: "published" },
      include: { variants: true },
    }),
  );
}

export async function getPublishedEvents() {
  return readMany("events", () =>
    prisma.event.findMany({
      where: { published: true },
      include: { ticketTypes: true },
      orderBy: { date: "asc" },
    }),
  );
}

export async function getPublishedEvent(id: string) {
  return readOne("event", () =>
    prisma.event.findFirst({
      where: { id, published: true },
      include: { ticketTypes: true },
    }),
  );
}

export async function getPublishedAlbums() {
  return readMany("albums", () =>
    prisma.album.findMany({
      where: { status: "published" },
      include: { tracks: { orderBy: { sort: "asc" } } },
      orderBy: { year: "desc" },
    }),
  );
}

export async function getPublishedAlbum(slug: string) {
  return readOne("album", () =>
    prisma.album.findFirst({
      where: { slug, status: "published" },
      include: { tracks: { orderBy: { sort: "asc" } } },
    }),
  );
}

export async function getPublishedNews() {
  return readMany("news", () =>
    prisma.newsArticle.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    }),
  );
}

export async function getPublishedNewsItem(slug: string) {
  return readOne("newsItem", () =>
    prisma.newsArticle.findFirst({
      where: { slug, status: "published" },
    }),
  );
}

export async function getPublishedMembers() {
  return readMany("members", () =>
    prisma.bandMember.findMany({
      where: { status: "published" },
      orderBy: { sort: "asc" },
    }),
  );
}

export async function getPublishedVideos() {
  return readMany("videos", () =>
    prisma.video.findMany({
      where: { status: "published" },
      orderBy: { year: "desc" },
    }),
  );
}

export async function getPublishedPhotos() {
  return readMany("photos", () =>
    prisma.photo.findMany({
      where: { status: "published" },
    }),
  );
}

export async function getSiteSettings() {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch (error) {
    console.error("catalog.settings", error);
    return {} as Record<string, string>;
  }
}

export async function getPublishedPage(slug: string) {
  return readOne("page", () =>
    prisma.sitePage.findFirst({
      where: { slug, status: "published" },
      include: { sections: { where: { published: true }, orderBy: { sort: "asc" } } },
    }),
  );
}

export { money } from "@/lib/money";
