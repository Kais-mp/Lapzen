import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * POST /api/coupons/validate
 * Body: { code, order_amount, user_id?, email? }
 * Returns discount details or an error.
 * 
 * Spam-protection layers:
 *  1. Rate limiting per IP (10 attempts/min)
 *  2. Code sanitisation
 *  3. Per-user and per-IP usage checks
 *  4. First-time customer verification
 *  5. Total + per-user usage cap enforcement
 *  6. Active/date window checks
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate-limit: 10 attempts per minute per IP
  const rl = rateLimit(`coupon_validate:${ip}`, 10, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { code, order_amount, user_id, email, product_id } = body;

    if (!code) {
      return NextResponse.json({ error: "No coupon code provided." }, { status: 400 });
    }

    const cleanCode = String(code).toUpperCase().trim().replace(/[^A-Z0-9_\-]/g, "");
    if (!cleanCode) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
    }

    // Fetch the coupon
      const { data: coupon, error: cErr } = await supabaseAdmin
        .from("coupons")
        .select("*, products(id, title)")
        .eq("code", cleanCode)
        .single();

    if (cErr || !coupon) {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
    }

    const now = new Date();

    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return NextResponse.json({ error: "This coupon is not yet valid." }, { status: 400 });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
      }

        // Product restriction check (supports both product_ids array and legacy product_id)
        const restrictedIds: string[] = coupon.product_ids && coupon.product_ids.length > 0
          ? coupon.product_ids
          : coupon.product_id ? [coupon.product_id] : [];

        if (restrictedIds.length > 0) {
          if (!product_id || !restrictedIds.includes(product_id)) {
            return NextResponse.json(
              { error: "This coupon is only valid for specific products not in your selection." },
              { status: 400 }
            );
          }
        }

      // Total usage limit
    if (coupon.usage_limit_total !== null && coupon.times_used >= coupon.usage_limit_total) {
      return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
    }

    // Minimum order amount
    const orderAmt = Number(order_amount) || 0;
    if (coupon.min_order_amount && orderAmt < Number(coupon.min_order_amount)) {
      return NextResponse.json(
        { error: `Minimum order of Rs. ${Number(coupon.min_order_amount).toLocaleString()} required.` },
        { status: 400 }
      );
    }

    // First-time customer check
    if (coupon.first_time_only) {
      if (user_id) {
        const { count } = await supabaseAdmin
          .from("orders")
          .select("id", { count: "exact" })
          .eq("user_id", user_id);
        if ((count || 0) > 0) {
          return NextResponse.json({ error: "This coupon is for first-time customers only." }, { status: 400 });
        }
      } else if (email) {
        const { count } = await supabaseAdmin
          .from("orders")
          .select("id", { count: "exact" })
          .ilike("customer_details->>email", email.trim());
        if ((count || 0) > 0) {
          return NextResponse.json({ error: "This coupon is for first-time customers only." }, { status: 400 });
        }
      }
    }

    // Per-user usage limit
    const perUserLimit = coupon.usage_limit_per_user ?? 1;

    if (user_id) {
      const { count: userUsage } = await supabaseAdmin
        .from("coupon_usage")
        .select("id", { count: "exact" })
        .eq("coupon_id", coupon.id)
        .eq("user_id", user_id);

      if ((userUsage || 0) >= perUserLimit) {
        return NextResponse.json({ error: "You have already used this coupon." }, { status: 400 });
      }
    } else if (email) {
      const { count: emailUsage } = await supabaseAdmin
        .from("coupon_usage")
        .select("id", { count: "exact" })
        .eq("coupon_id", coupon.id)
        .ilike("email", email.trim());

      if ((emailUsage || 0) >= perUserLimit) {
        return NextResponse.json({ error: "This coupon has already been used with this email." }, { status: 400 });
      }
    }

    // Spam protection: same IP used this coupon too many times
    if (ip !== "unknown") {
      const { count: ipUsage } = await supabaseAdmin
        .from("coupon_usage")
        .select("id", { count: "exact" })
        .eq("coupon_id", coupon.id)
        .eq("ip_address", ip);

      // Allow up to 3 uses from same IP (covers household/shared devices)
      if ((ipUsage || 0) >= 3) {
        return NextResponse.json(
          { error: "Too many coupon uses detected from your network." },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discountAmount = 0;
    let freeShipping = false;

    if (coupon.discount_type === "percentage") {
      discountAmount = (orderAmt * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, Number(coupon.max_discount_amount));
      }
    } else if (coupon.discount_type === "fixed") {
      discountAmount = Math.min(Number(coupon.discount_value), orderAmt);
    } else if (coupon.discount_type === "free_shipping") {
      freeShipping = true;
      discountAmount = 0;
    }

      return NextResponse.json({
        valid: true,
        coupon_id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: Math.round(discountAmount),
        free_shipping: freeShipping,
        description: coupon.description,
          product_id: coupon.product_id || null,
          product_ids: coupon.product_ids || null,
          product_name: coupon.products?.title || null,
      });
  } catch (err: any) {
    console.error("POST /api/coupons/validate error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
