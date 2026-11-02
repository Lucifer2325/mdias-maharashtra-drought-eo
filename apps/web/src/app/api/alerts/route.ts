import { NextResponse } from "next/server";
import { z } from "zod";

const createAlertSchema = z.object({
  regionId: z.string().min(1),
  regionName: z.string().min(1),
  metric: z.string().min(1),
  threshold: z.number(),
  operator: z.enum(["gte", "lte", "eq"]),
  channel: z.enum(["EMAIL", "SMS", "WEBHOOK"]),
  destination: z.string().min(1),
});

export async function GET() {
  // TODO: Query from DB using Clerk auth:
  // const userOrg = await getCurrentOrg();
  // const alerts = await db.alert.findMany({ where: { organizationId: userOrg.id } });

  return NextResponse.json({
    success: true,
    data: [],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createAlertSchema.parse(body);

    // TODO: Insert into database via Prisma:
    // const newAlert = await db.alert.create({ data: { ... } });

    const created = {
      id: `alt-${Date.now()}`,
      ...validated,
      active: true,
      lastTriggeredAt: null,
    };

    return NextResponse.json({
      success: true,
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create alert",
    }, { status: 400 });
  }
}
