import { NextResponse } from "next/server";
import { createServiceRoleClient, getAdminContext } from "@/lib/admin-auth";
import { statusSchema } from "@/lib/booking-rules";
import {
  forbiddenOriginResponse,
  isSameOriginRequest,
} from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  if (!isSameOriginRequest(req)) return forbiddenOriginResponse();

  const admin = await getAdminContext();
  if (!admin.ok) return admin.response;

  const body = await req.json().catch(() => null);

  const id = body?.id as string | undefined;
  const statusResult = statusSchema.safeParse(body?.status);

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!statusResult.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabaseAdmin = createServiceRoleClient();
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .update({ status: statusResult.data })
    .eq("id", id)
    .eq("branch_slug", admin.branchSlug)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
