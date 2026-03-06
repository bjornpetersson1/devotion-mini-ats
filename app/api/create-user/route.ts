import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

    // 1️⃣ Skapa användare
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email.trim(),
        password: "defaultpassword",
        email_confirm: true,
      });

    // Endast faila om användaren inte skapades
    if (!userData?.user) {
      return NextResponse.json(
        { error: userError?.message || "Failed to create user" },
        { status: 400 },
      );
    }

    return NextResponse.json({ user: userData.user });
  } catch (err: any) {
    console.error("API create-user error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
