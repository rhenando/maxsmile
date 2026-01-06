import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function makeReference() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MS-${y}${m}${day}-${rand}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // accept snake_case (preferred)
  const branch_slug = body?.branch_slug ?? body?.branchSlug;
  const appointment_date = body?.appointment_date ?? body?.date;
  const full_name = body?.full_name ?? body?.fullName;
  const mobile = body?.mobile;
  const service = body?.service;
  const privacy_agreed =
    body?.privacy_agreed ?? body?.privacyAgreed ?? body?.privacyAgreed === true;

  if (!branch_slug)
    return NextResponse.json({ error: "Missing branch_slug" }, { status: 400 });
  if (!appointment_date)
    return NextResponse.json(
      { error: "Missing appointment_date" },
      { status: 400 }
    );
  if (!full_name || String(full_name).trim().length < 2)
    return NextResponse.json({ error: "Missing full_name" }, { status: 400 });
  if (!mobile || String(mobile).trim().length < 8)
    return NextResponse.json({ error: "Invalid mobile" }, { status: 400 });
  if (!service)
    return NextResponse.json({ error: "Missing service" }, { status: 400 });
  if (!privacy_agreed)
    return NextResponse.json(
      { error: "Privacy consent is required" },
      { status: 400 }
    );

  const reference = makeReference();

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      branch_slug: String(branch_slug),
      service: String(service),
      appointment_date: String(appointment_date),
      full_name: String(full_name).trim(),
      mobile: String(mobile).trim(),
      reference,
      status: "reserved",
      privacy_agreed: true,
    })
    .select("reference, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    reference: data.reference,
    createdAt: data.created_at,
  });
}
