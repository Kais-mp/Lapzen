import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("lapzen_admin_access");

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Update password in database
    const { error: updateError } = await supabaseAdmin
      .from('site_settings')
      .update({ value: newPassword, updated_at: new Date().toISOString() })
      .eq('key', 'admin_password');

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json({ error: "Failed to update password in database" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully in the database. Changes take effect immediately." 
    });
  } catch (error) {
    console.error("Change Password API Error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
