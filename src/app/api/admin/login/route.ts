import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Fetch password from database
    const { data: settings, error: fetchError } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (fetchError || !settings) {
      console.error("Error fetching admin password:", fetchError);
      // Fallback to env if DB fails (optional, but safer for first run)
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
      const expected = ADMIN_PASSWORD?.trim();
      const provided = password?.trim();
      
      if (provided === expected) {
        return await handleSuccess();
      }
      
      return NextResponse.json(
        { success: false, error: "Authentication configuration error" },
        { status: 500 }
      );
    }

    const expected = settings.value.trim();
    const provided = password?.trim();

    if (provided === expected) {
      return await handleSuccess();
    }

    console.log("Admin login failed: Invalid password");
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

async function handleSuccess() {
  const cookieStore = await cookies();
  cookieStore.set("lapzen_admin_access", "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  console.log("Admin login successful, cookie set.");
  return NextResponse.json({ success: true });
}
