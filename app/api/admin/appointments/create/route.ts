import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED = new Set([
  "reserved",
  "confirmed",
  "completed",
  "no_show",
  "cancelled",
]);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: claimsRes, error: claimsErr } =
      await supabase.auth.getClaims();
    const userId = claimsRes?.claims?.sub;

    if (claimsErr || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminRow, error: adminErr } = await supabase
      .from("admin_users")
      .select("branch_slug")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminErr || !adminRow?.branch_slug) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);

    const full_name = (body?.full_name as string | undefined)?.trim();
    const mobile = (body?.mobile as string | undefined)?.trim();
    const service = (body?.service as string | undefined)?.trim();
    const appointment_date = body?.appointment_date as string | undefined;
    const privacy_agreed = Boolean(body?.privacy_agreed);

    const statusRaw = (body?.status as string | undefined) ?? "reserved";
    const status = statusRaw.toLowerCase().trim();

    if (!full_name || !mobile || !service || !appointment_date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!ALLOWED.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        branch_slug: adminRow.branch_slug,
        full_name,
        mobile,
        service,
        appointment_date,
        status,
        privacy_agreed,
      })
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
