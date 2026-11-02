import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import type { Organization } from "@prisma/client";

// ─── getCurrentOrg ────────────────────────────────────────────────────────────
// Resolves the signed-in Clerk user to their MDIAS Organization row.
// Returns null when the request is unauthenticated or the user has no record yet.

export async function getCurrentOrg(): Promise<Organization | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { organization: true },
  });

  return user?.organization ?? null;
}

// ─── requireOrg ──────────────────────────────────────────────────────────────
// Like getCurrentOrg but throws if the caller is unauthenticated.
// Use in API routes that must be protected.

export async function requireOrg(): Promise<Organization> {
  const org = await getCurrentOrg();
  if (!org) {
    throw new Error("Unauthorized");
  }
  return org;
}
