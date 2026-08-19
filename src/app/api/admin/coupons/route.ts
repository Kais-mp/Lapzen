import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// GET /api/admin/coupons - list all coupons with usage stats
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select(`
        *,
        coupon_usage(count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET /api/admin/coupons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/coupons - create a coupon
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

      const {
        code,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount_amount,
        usage_limit_total,
        usage_limit_per_user,
        is_active,
        is_auto_apply,
        first_time_only,
        starts_at,
        expires_at,
        product_id,
        product_ids,
      } = body;

    if (!code || !discount_type) {
      return NextResponse.json({ error: "Code and discount type are required." }, { status: 400 });
    }

    const cleanCode = String(code).toUpperCase().trim().replace(/[^A-Z0-9_\-]/g, "");
    if (!cleanCode) {
      return NextResponse.json({ error: "Invalid coupon code format." }, { status: 400 });
    }

    if (discount_type !== "free_shipping" && (discount_value === undefined || discount_value === null || Number(discount_value) <= 0)) {
      return NextResponse.json({ error: "Discount value must be greater than 0." }, { status: 400 });
    }

    if (discount_type === "percentage" && Number(discount_value) > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100%." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("coupons")
      .insert({
        code: cleanCode,
        description: description || null,
        discount_type,
        discount_value: discount_type === "free_shipping" ? 0 : Number(discount_value),
        min_order_amount: Number(min_order_amount) || 0,
        max_discount_amount: max_discount_amount ? Number(max_discount_amount) : null,
        usage_limit_total: usage_limit_total ? Number(usage_limit_total) : null,
          usage_limit_per_user: usage_limit_per_user ? Number(usage_limit_per_user) : 1,
          is_active: is_active !== false,
          is_auto_apply: is_auto_apply === true,
          first_time_only: first_time_only === true,
          starts_at: starts_at || null,
          expires_at: expires_at || null,
            product_id: product_id || null,
            product_ids: Array.isArray(product_ids) && product_ids.length > 0 ? product_ids : null,
        })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/admin/coupons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/coupons - update a coupon
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    if (updates.code) {
      updates.code = String(updates.code).toUpperCase().trim().replace(/[^A-Z0-9_\-]/g, "");
    }

    if (updates.discount_type === "percentage" && updates.discount_value && Number(updates.discount_value) > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100%." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("coupons")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PATCH /api/admin/coupons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/coupons - delete a coupon
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/admin/coupons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
