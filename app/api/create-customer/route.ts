import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: "defaultpassword",
      email_confirm: true,
    });

  if (userError)
    return NextResponse.json({ error: userError.message }, { status: 400 });

  const { data: profileData, error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: userData.user.id,
      email: userData.user.email,
      username: name,
      role: "user",
    });

  if (profileError)
    return NextResponse.json({ error: profileError.message }, { status: 400 });

  return NextResponse.json({ profile: profileData });
}
