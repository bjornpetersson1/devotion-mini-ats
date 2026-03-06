// /api/insert-customer.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name)
      return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert({ name })
      .select();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ customer: data[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
