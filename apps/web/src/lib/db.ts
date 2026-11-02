import { PrismaClient } from "@prisma/client";

// ─── Prisma Singleton ────────────────────────────────────────────────────────
// Prevents multiple PrismaClient instances during Next.js hot-reload in dev.
// In production a new instance is created once and reused for the process lifetime.

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
