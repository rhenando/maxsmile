import { NextResponse } from "next/server";

import { createServiceRoleClient, getAdminContext } from "@/lib/admin-auth";
import {
  adminAppointmentSchema,
  getClosedDateMessage,
  makeReference,
} from "@/lib/booking-rules";
import {
  forbiddenOriginResponse,
  isSameOriginRequest,
} from "@/lib/request-security";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) return forbiddenOriginResponse();

    const admin = await getAdminContext();
    if (!admin.ok) return admin.response;

    const body = await req.json().catch(() => null);
    const parsed = adminAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const closedMessage = getClosedDateMessage(parsed.data.appointment_date);
    if (closedMessage) {
      return NextResponse.json({ error: closedMessage }, { status: 400 });
    }

    const supabaseAdmin = createServiceRoleClient();
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        branch_slug: admin.branchSlug,
        full_name: parsed.data.full_name,
        mobile: parsed.data.mobile,
        service: parsed.data.service,
        appointment_date: parsed.data.appointment_date,
        status: parsed.data.status,
        privacy_agreed: parsed.data.privacy_agreed,
        reference: makeReference(),
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
