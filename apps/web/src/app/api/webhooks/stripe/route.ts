import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      console.log(`Stripe checkout completed for customer: ${session.customer}`);
      // Update organization in DB
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      console.log(`Subscription cancelled: ${subscription.id}`);
      // Downgrade to FREE
      break;
    }
    default:
      console.log(`Unhandled stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
