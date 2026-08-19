import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = supabaseAdmin;

  // Fetch contact submissions
  const { data: submissions, error: submissionsError } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (submissionsError) {
    return NextResponse.json({ error: submissionsError.message }, { status: 500 });
  }

  // Fetch customers (profiles with role customer or all profiles if role is not strictly used)
  const { data: customers, error: customersError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (customersError) {
    return NextResponse.json({ error: customersError.message }, { status: 500 });
  }

  return NextResponse.json({ submissions, customers });
}

export async function DELETE(request: Request) {
  const supabase = supabaseAdmin;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type"); // 'submission' or 'customer'

  if (!id || !type) {
    return NextResponse.json({ error: "Missing ID or type" }, { status: 400 });
  }

  if (type === "submission") {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (type === "customer") {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
