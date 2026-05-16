import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient, getAdminContext } from "@/lib/admin-auth";
import {
  forbiddenOriginResponse,
  isSameOriginRequest,
} from "@/lib/request-security";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!isSameOriginRequest(req)) return forbiddenOriginResponse();

  const admin = await getAdminContext();
  if (!admin.ok) return admin.response;

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabaseAdmin = createServiceRoleClient();
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .delete()
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
