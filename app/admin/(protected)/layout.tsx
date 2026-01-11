import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/admin-header";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: claimsRes, error: claimsErr } = await supabase.auth.getClaims();
  const claims = claimsRes?.claims;

  if (claimsErr || !claims?.sub) {
    redirect("/admin/login");
  }

  const userId = claims.sub;

  const { data: adminRow, error: adminErr } = await supabase
    .from("admin_users")
    .select("branch_slug, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminErr || !adminRow?.branch_slug) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className='min-h-svh bg-[#FAF7F1]'>
      <AdminHeader branchSlug={adminRow.branch_slug} />
      <main className='mx-auto w-full max-w-7xl px-4 py-6'>{children}</main>
    </div>
  );
}
