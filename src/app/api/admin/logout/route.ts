import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.delete("lapzen_admin_access");
  
    // Also set it with an expired date just to be sure
    cookieStore.set("lapzen_admin_access", "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

  return NextResponse.json({ success: true });
}
