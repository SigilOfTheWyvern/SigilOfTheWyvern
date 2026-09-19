import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function databaseUrl() {
  const raw = process.env.DATABASE_URL?.trim() ?? "";
  if (!raw || raw.startsWith("file:")) {
    if (isProductionBuild()) {
      return "postgresql://build:build@127.0.0.1:5432/postgres";
    }
    throw new Error(
      "DATABASE_URL must be the Supabase Postgres URI. Set it in Netlify Site configuration → Environment variables.",
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

function getClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = new PrismaClient({
    datasources: { db: { url: databaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
