import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
      const { count: productsCount, error: pError } = await supabaseAdmin
        .from("products")
        .select("id", { count: "exact" });

      const { data: orders, error: oError } = await supabaseAdmin
        .from("orders")
        .select("total_amount, created_at");

      const { count: usersCount, error: uError } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact" });

      const { data: profiles, error: prfError } = await supabaseAdmin
        .from("profiles")
        .select("created_at");

      const { data: productsByCategory, error: cError } = await supabaseAdmin
        .from("products")
        .select("category");

      const { data: recentProducts, error: rpError } = await supabaseAdmin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (pError || oError || uError || rpError || prfError || cError) {
        console.error("Stats fetching error:", { pError, oError, uError, rpError, prfError, cError });
      }

      const totalRevenue = orders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

      // Prepare Chart Data
      const last30Days = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date(),
      });

      const revenueTrend = last30Days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayOrders = orders?.filter(o => format(new Date(o.created_at), 'yyyy-MM-dd') === dateStr) || [];
        return {
          date: format(day, 'MMM dd'),
          revenue: dayOrders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0),
          orders: dayOrders.length
        };
      });

      const userTrend = last30Days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayUsers = profiles?.filter(u => format(new Date(u.created_at), 'yyyy-MM-dd') === dateStr) || [];
        return {
          date: format(day, 'MMM dd'),
          users: dayUsers.length
        };
      });

      const categoryData = productsByCategory?.reduce((acc: any[], curr: any) => {
        const existing = acc.find(a => a.name === (curr.category || 'Uncategorized'));
        if (existing) {
          existing.value++;
        } else {
          acc.push({ name: curr.category || 'Uncategorized', value: 1 });
        }
        return acc;
      }, []) || [];

      return NextResponse.json({
        products: productsCount || 0,
        orders: orders?.length || 0,
        users: usersCount || 0,
        revenue: totalRevenue,
        recentProducts: recentProducts || [],
        charts: {
          revenueTrend,
          userTrend,
          categoryData
        }
      });
  } catch (err) {
    console.error("Internal Stats Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
