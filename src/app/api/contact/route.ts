import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, phone, reason } = await req.json();

    if (!name || !email || !phone || !reason) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([{ name, email, phone, reason }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mocking the email sending part as we don't have a mailer service configured yet
    // In a real scenario, you'd use Resend or Nodemailer here
    console.log(`Sending email to lapzen.store@gmail.com with content:`, {
      name,
      email,
      phone,
      reason,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
