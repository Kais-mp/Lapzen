import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(request: Request) {
  try {
    const { amount, items } = await request.json();

    // Stripe's minimum amount for PKR is usually around 150 PKR
    if (!amount || amount < 150) {
      return NextResponse.json(
        { error: "Amount must be at least Rs. 150" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "pkr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items?.map((i: { id: string; name: string; quantity: number }) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
        })) || []),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 }
    );
  }
}
