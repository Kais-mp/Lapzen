import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/coupons/redeem
 * Called server-side when an order is placed.
 * Body: { coupon_id, user_id?, order_id, email?, ip_address?, discount_applied }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { coupon_id, user_id, order_id, email, ip_address, discount_applied } = body;

    if (!coupon_id || !order_id) {
      return NextResponse.json({ error: "coupon_id and order_id are required." }, { status: 400 });
    }

    // Insert usage record
    const { error: usageError } = await supabaseAdmin
      .from("coupon_usage")
      .insert({
        coupon_id,
        user_id: user_id || null,
        order_id,
        email: email || null,
        ip_address: ip_address || null,
        discount_applied: discount_applied || 0,
      });

    if (usageError) throw usageError;

    // Fetch current count and increment atomically
    const { data: coupon, error: fetchError } = await supabaseAdmin
      .from("coupons")
      .select("times_used")
      .eq("id", coupon_id)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabaseAdmin
      .from("coupons")
      .update({
        times_used: (coupon?.times_used || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", coupon_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/coupons/redeem error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
