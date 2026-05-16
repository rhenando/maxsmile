import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/admin-auth";
import {
  DAILY_LIMIT_PER_BRANCH,
  getClosedDateMessage,
  makeReference,
  normalizePublicBookingBody,
  publicBookingSchema,
} from "@/lib/booking-rules";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/request-security";

export const dynamic = "force-dynamic";

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

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit({
    key: `availability:${ip}`,
    limit: 90,
    windowMs: 60_000,
  });
  if (!rate.ok) return rateLimitResponse(rate.resetAt);

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

  const parsed = publicBookingSchema
    .pick({ branch_slug: true, appointment_date: true })
    .safeParse({ branch_slug, appointment_date });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid branch or date" }, { status: 400 });
  }

  const dateStr = parsed.data.appointment_date;
  const closedMessage = getClosedDateMessage(dateStr);
  if (closedMessage) {
    return NextResponse.json({
      branch_slug: parsed.data.branch_slug,
      appointment_date: dateStr,
      limit: DAILY_LIMIT_PER_BRANCH,
      count: 0,
      remaining: 0,
      isFull: true,
      isOffDay: true,
      message: closedMessage,
    });
  }

  const supabaseAdmin = createServiceRoleClient();
  const { count, error } = await supabaseAdmin
    .from("appointments")
    .select("reference", { count: "exact", head: true })
    .eq("branch_slug", parsed.data.branch_slug)
    .eq("appointment_date", dateStr)
    .in("status", ["reserved", "confirmed"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const c = count ?? 0;

  return NextResponse.json({
    branch_slug: parsed.data.branch_slug,
    appointment_date: dateStr,
    limit: DAILY_LIMIT_PER_BRANCH,
    count: c,
    remaining: Math.max(0, DAILY_LIMIT_PER_BRANCH - c),
    isFull: c >= DAILY_LIMIT_PER_BRANCH,
    isOffDay: false,
  });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit({
    key: `booking:${ip}`,
    limit: 12,
    windowMs: 10 * 60_000,
  });
  if (!rate.ok) return rateLimitResponse(rate.resetAt);

  const body = await req.json().catch(() => null);
  const parsed = publicBookingSchema.safeParse(normalizePublicBookingBody(body));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid appointment details" },
      { status: 400 },
    );
  }

  const {
    branch_slug,
    appointment_date: dateStr,
    full_name,
    mobile,
    service,
    website,
  } = parsed.data;

  if (website && website.trim() !== "") {
    return NextResponse.json(
      { error: "Invalid appointment details" },
      { status: 400 },
    );
  }

  const closedMessage = getClosedDateMessage(dateStr);
  if (closedMessage) {
    return NextResponse.json({ error: closedMessage }, { status: 400 });
  }

  const supabaseAdmin = createServiceRoleClient();
  const { count, error: countErr } = await supabaseAdmin
    .from("appointments")
    .select("reference", { count: "exact", head: true })
    .eq("branch_slug", branch_slug)
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
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      branch_slug,
      service,
      appointment_date: dateStr,
      full_name,
      mobile,
      reference,
      status: "reserved",
      privacy_agreed: true,
    })
    .select("reference, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void sendSMSConfirmation({
    mobile,
    fullName: full_name,
    date: dateStr,
    reference: data.reference,
  });

  return NextResponse.json({
    ok: true,
    reference: data.reference,
    createdAt: data.created_at,
  });
}
