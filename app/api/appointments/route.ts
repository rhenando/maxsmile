import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SERVICES } from "@/lib/services";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

// ✅ derive the literal union type from SERVICES
type ServiceValue = (typeof SERVICES)[number]["value"];

// ✅ keep Set strongly typed
const SERVICE_VALUES = new Set<ServiceValue>(SERVICES.map((s) => s.value));

// ✅ type guard so TS knows the string is one of the allowed values
function isServiceValue(v: string): v is ServiceValue {
  return SERVICE_VALUES.has(v as ServiceValue);
}

function makeReference() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MS-${y}${m}${day}-${rand}`;
}

/** ❌ Off day: Tuesday (0=Sun, 1=Mon, 2=Tue, ...) */
const OFF_DAY = 2;

function parseISODateParts(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;

  const y = Number(m[1]);
  const mon = Number(m[2]);
  const d = Number(m[3]);

  const dt = new Date(Date.UTC(y, mon - 1, d));

  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mon - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }

  return { y, mon, d, weekday: dt.getUTCDay() };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const branch_slug = body?.branch_slug ?? body?.branchSlug;
  const appointment_date = body?.appointment_date ?? body?.date;
  const full_name = body?.full_name ?? body?.fullName;
  const mobile = body?.mobile;
  const service = body?.service;

  const rawPrivacy = body?.privacy_agreed ?? body?.privacyAgreed;
  const privacy_agreed =
    rawPrivacy === true ||
    rawPrivacy === "true" ||
    rawPrivacy === 1 ||
    rawPrivacy === "1";

  if (!branch_slug)
    return NextResponse.json({ error: "Missing branch_slug" }, { status: 400 });

  if (!appointment_date)
    return NextResponse.json(
      { error: "Missing appointment_date" },
      { status: 400 },
    );

  const dateStr = String(appointment_date);
  const parts = parseISODateParts(dateStr);

  if (!parts) {
    return NextResponse.json(
      { error: "Invalid appointment_date format. Use YYYY-MM-DD." },
      { status: 400 },
    );
  }

  if (parts.weekday === OFF_DAY) {
    return NextResponse.json(
      { error: "We’re closed every Tuesday. Please choose another date." },
      { status: 400 },
    );
  }

  if (!full_name || String(full_name).trim().length < 2)
    return NextResponse.json({ error: "Missing full_name" }, { status: 400 });

  if (!mobile || String(mobile).trim().length < 8)
    return NextResponse.json({ error: "Invalid mobile" }, { status: 400 });

  if (!service)
    return NextResponse.json({ error: "Missing service" }, { status: 400 });

  const serviceValue = String(service);

  // ✅ validate service slug (and satisfy TS)
  if (!isServiceValue(serviceValue)) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 });
  }

  if (!privacy_agreed)
    return NextResponse.json(
      { error: "Privacy consent is required" },
      { status: 400 },
    );

  const reference = makeReference();

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      branch_slug: String(branch_slug),
      service: serviceValue, // ✅ serviceValue is now narrowed by isServiceValue
      appointment_date: dateStr,
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
