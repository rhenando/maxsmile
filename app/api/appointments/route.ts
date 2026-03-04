import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SERVICES } from "@/lib/services";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const DAILY_LIMIT_PER_BRANCH = 20;

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

// ✅ Format date for SMS display like "Jan 03, 2026"
function formatSMSDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ✅ SMS via Semaphore (non-blocking — booking won't fail if SMS fails)
async function sendSMSConfirmation({
  mobile,
  fullName,
  date,
  reference,
}: {
  mobile: string;
  fullName: string;
  date: string;
  reference: string;
}) {
  const apiKey = process.env.SEMAPHORE_API_KEY;
  if (!apiKey) {
    console.warn("SEMAPHORE_API_KEY is not set. SMS skipped.");
    return;
  }

  const displayDate = formatSMSDate(date);
  const message =
    `Hi ${fullName}! Your appointment on ${displayDate} is confirmed. ` +
    `Ref: ${reference}. First-come, first-served, 10AM-5PM. ` +
    `Thank you & see you! Automated SMS, do not reply.`;

  try {
    const res = await fetch("https://api.semaphore.co/api/v4/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: apiKey,
        number: mobile,
        message,
        sendername: process.env.SEMAPHORE_SENDER_NAME ?? "MAXSMILE",
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown");
      console.error("SMS send failed:", res.status, err);
    }
  } catch (err) {
    console.error("SMS send error:", err);
  }
}

/**
 * ✅ GET /api/appointments?branchSlug=...&date=YYYY-MM-DD
 * Returns availability so the UI can disable the button early.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const branch_slug =
    searchParams.get("branch_slug") || searchParams.get("branchSlug");
  const appointment_date =
    searchParams.get("appointment_date") || searchParams.get("date");

  if (!branch_slug || !appointment_date) {
    return NextResponse.json(
      { error: "Missing branch_slug/branchSlug or appointment_date/date" },
      { status: 400 },
    );
  }

  const dateStr = String(appointment_date);
  const parts = parseISODateParts(dateStr);
  if (!parts) {
    return NextResponse.json(
      { error: "Invalid appointment_date format. Use YYYY-MM-DD." },
      { status: 400 },
    );
  }

  // optional: treat off-day as "full" for UI
  if (parts.weekday === OFF_DAY) {
    return NextResponse.json({
      branch_slug: String(branch_slug),
      appointment_date: dateStr,
      limit: DAILY_LIMIT_PER_BRANCH,
      count: 0,
      remaining: 0,
      isFull: true,
      isOffDay: true,
    });
  }

  const { count, error } = await supabaseAdmin
    .from("appointments")
    .select("reference", { count: "exact", head: true })
    .eq("branch_slug", String(branch_slug))
    .eq("appointment_date", dateStr)
    // ✅ count only active reservations (adjust to match your statuses)
    .in("status", ["reserved", "confirmed"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const c = count ?? 0;

  return NextResponse.json({
    branch_slug: String(branch_slug),
    appointment_date: dateStr,
    limit: DAILY_LIMIT_PER_BRANCH,
    count: c,
    remaining: Math.max(0, DAILY_LIMIT_PER_BRANCH - c),
    isFull: c >= DAILY_LIMIT_PER_BRANCH,
    isOffDay: false,
  });
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
      { error: "We're closed every Tuesday. Please choose another date." },
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

  // ✅ CAPACITY CHECK (server-enforced)
  const { count, error: countErr } = await supabaseAdmin
    .from("appointments")
    .select("reference", { count: "exact", head: true })
    .eq("branch_slug", String(branch_slug))
    .eq("appointment_date", dateStr)
    .in("status", ["reserved", "confirmed"]);

  if (countErr) {
    return NextResponse.json({ error: countErr.message }, { status: 500 });
  }

  if ((count ?? 0) >= DAILY_LIMIT_PER_BRANCH) {
    return NextResponse.json(
      {
        error:
          "This branch is fully booked for the selected date. Please choose another date.",
      },
      { status: 409 },
    );
  }

  const reference = makeReference();
  const trimmedName = String(full_name).trim();
  const trimmedMobile = String(mobile).trim();

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      branch_slug: String(branch_slug),
      service: serviceValue,
      appointment_date: dateStr,
      full_name: trimmedName,
      mobile: trimmedMobile,
      reference,
      status: "reserved",
      privacy_agreed: true,
    })
    .select("reference, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ Send SMS confirmation (non-blocking)
  await sendSMSConfirmation({
    mobile: trimmedMobile,
    fullName: trimmedName,
    date: dateStr,
    reference: data.reference,
  });

  return NextResponse.json({
    ok: true,
    reference: data.reference,
    createdAt: data.created_at,
  });
}