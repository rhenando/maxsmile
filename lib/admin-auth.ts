import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { BranchSlug } from "@/lib/branches";

export type AdminContext =
  | {
      ok: true;
      userId: string;
      branchSlug: BranchSlug;
      role?: string;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await createClient();
  const { data: claimsRes, error: claimsErr } = await supabase.auth.getClaims();
  const userId = claimsRes?.claims?.sub;

  if (claimsErr || !userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: adminRow, error: adminErr } = await supabase
    .from("admin_users")
    .select("branch_slug, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminErr || !adminRow?.branch_slug) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    userId,
    branchSlug: adminRow.branch_slug as BranchSlug,
    role: adminRow.role ?? undefined,
  };
}

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase service role configuration");
  }

  return createSupabaseAdminClient(url, key, {
    auth: { persistSession: false },
  });
}
