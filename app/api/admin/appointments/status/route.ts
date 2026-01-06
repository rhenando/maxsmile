import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);

  const id = body?.id as string | undefined;
  const status = body?.status as string | undefined;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!status)
    return NextResponse.json({ error: "Missing status" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
