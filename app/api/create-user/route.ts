import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

    let customerId = null;

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email.trim(),
        password: "defaultpassword",
        user_metadata: {
          role: role,
        },
        email_confirm: true,
      });

    if (!userData?.user) {
      return NextResponse.json(
        { error: userError?.message || "Failed to create user" },
        { status: 400 },
      );
    }

    await supabaseAdmin.from("profiles").insert({
      id: userData.user.id,
      email: email.trim(),
      role: role || "user",
    });

    return NextResponse.json({ user: userData.user });
  } catch (err: any) {
    console.error("API create-user error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
