import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function databaseUrl() {
  const raw = process.env.DATABASE_URL?.trim() ?? "";
  if (!raw || raw.startsWith("file:")) {
    throw new Error(
      "DATABASE_URL must be the Supabase Postgres URI. Netlify does not store a local SQLite file.",
    );
  }
  try {
    const url = new URL(raw);
    if (url.port === "6543") {
      url.searchParams.set("pgbouncer", "true");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
