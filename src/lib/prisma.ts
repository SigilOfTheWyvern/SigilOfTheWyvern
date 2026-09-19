import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function isDatabaseConfigured() {
  const raw = process.env.DATABASE_URL?.trim() ?? "";
  return Boolean(raw) && !raw.startsWith("file:");
}

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function normalizeDatabaseUrl(raw: string) {
  const value = raw.replace(/^["']|["']$/g, "");
  const marker = value.indexOf("://");
  if (marker === -1) return value;
  const rest = value.slice(marker + 3);
  const at = rest.lastIndexOf("@");
  if (at === -1) return value;
  const creds = rest.slice(0, at);
  const host = rest.slice(at + 1);
  const colon = creds.indexOf(":");
  if (colon === -1) return value;
  const user = creds.slice(0, colon);
  const password = creds.slice(colon + 1);
  const encoded =
    /[@#/? ]/.test(password) && !password.includes("%")
      ? encodeURIComponent(password)
      : password;
  return `${value.slice(0, marker + 3)}${user}:${encoded}@${host}`;
}

function databaseUrl() {
  const raw = normalizeDatabaseUrl(process.env.DATABASE_URL?.trim() ?? "");
  if (!raw || raw.startsWith("file:")) {
    if (isProductionBuild()) {
      return "postgresql://build:build@127.0.0.1:5432/postgres";
    }
    throw new Error(
      "DATABASE_URL must be the Supabase Postgres URI. Set it in Netlify Site configuration → Environment variables for All scopes.",
    );
  }
  try {
    const url = new URL(raw);
    const pooler = url.hostname.includes("pooler.supabase.com");
    if (pooler && (url.port === "5432" || url.port === "")) {
      url.port = "6543";
    }
    if (pooler || url.port === "6543") {
      url.searchParams.set("pgbouncer", "true");
    }
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", process.env.NODE_ENV === "development" ? "3" : "1");
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "10");
    }
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
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
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
