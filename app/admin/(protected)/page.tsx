export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentActions from "@/components/admin/appointment-actions";
import WalkInAppointmentButton from "@/components/admin/walkin-appointment";
import { SERVICES } from "@/lib/services";

const GOLD = "#DAC583";
const PAGE_SIZE = 20;

// ✅ value -> label lookup (works even if DB stores slug)
const SERVICE_LABEL: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.value, s.label]),
);

type AppointmentRow = {
  id: string;
  created_at: string;
  branch_slug: string;
  service: string;
  appointment_date: string; // YYYY-MM-DD
  full_name: string;
  mobile: string;
  reference: string;
  status: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

function toStr(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function toInt(v: string | undefined, fallback = 1) {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function formatAppointmentDate(yyyyMmDd: string) {
  const parts = yyyyMmDd?.split("-");
  if (!parts || parts.length !== 3) return yyyyMmDd;

  const [y, m, d] = parts;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = Number(m) - 1;
  const day = String(Number(d)).padStart(2, "0");

  if (!Number.isFinite(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return yyyyMmDd;
  }

  return `${months[monthIndex]}-${day}-${y}`;
}

function statusClass(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "confirmed")
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (s === "completed") return "border-sky-200 bg-sky-50 text-sky-900";
  if (s === "no_show") return "border-orange-200 bg-orange-50 text-orange-900";
  if (s === "cancelled" || s === "canceled")
    return "border-red-200 bg-red-50 text-red-900";
  if (s === "reserved") return "border-amber-200 bg-amber-50 text-amber-900";

  return "border-black/10 bg-white text-black/70";
}

function buildQS(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.trim() !== "") sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();

  const { data: claimsRes, error: claimsErr } = await supabase.auth.getClaims();
  const userId = claimsRes?.claims?.sub;
  if (claimsErr || !userId) redirect("/admin/login");

  const { data: adminRow, error: adminErr } = await supabase
    .from("admin_users")
    .select("branch_slug")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminErr || !adminRow?.branch_slug) {
    redirect("/admin/login?error=unauthorized");
  }

  const branchSlug = adminRow.branch_slug;

  const status = toStr(sp?.status) ?? "all";
  const from = toStr(sp?.from);
  const to = toStr(sp?.to);
  const q = (toStr(sp?.q) ?? "").trim();
  const page = toInt(toStr(sp?.page), 1);

  let query = supabase
    .from("appointments")
    .select(
      "id, created_at, branch_slug, service, appointment_date, full_name, mobile, reference, status",
      { count: "exact" },
    )
    .eq("branch_slug", branchSlug);

  if (status !== "all") query = query.eq("status", status);
  if (from) query = query.gte("appointment_date", from);
  if (to) query = query.lte("appointment_date", to);

  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,reference.ilike.%${q}%,mobile.ilike.%${q}%`,
    );
  }

  const fromIdx = (page - 1) * PAGE_SIZE;
  const toIdx = fromIdx + PAGE_SIZE - 1;

  const {
    data: rows,
    error,
    count,
  } = await query
    .order("created_at", { ascending: false })
    .range(fromIdx, toIdx);

  const appointments = (rows ?? []) as AppointmentRow[];
  const total = count ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const baseParams = {
    status: status === "all" ? undefined : status,
    from: from || undefined,
    to: to || undefined,
    q: q || undefined,
  };

  return (
    <div className='space-y-5'>
      <Card className='rounded-3xl border-black/10 bg-white'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <CardTitle className='text-lg tracking-tight'>
                Appointments
              </CardTitle>
              <div
                className='mt-2 h-px w-20'
                style={{ backgroundColor: GOLD }}
              />
              <p className='mt-2 text-sm text-black/60'>
                Showing requests for your branch. Filter & search below.
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <WalkInAppointmentButton />
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {error ? (
            <p className='rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error.message}
            </p>
          ) : null}

          <form className='flex flex-col gap-3 lg:flex-row lg:items-end'>
            <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-4'>
              <div className='sm:col-span-1'>
                <label className='mb-1 block text-xs font-medium text-black/60'>
                  Status
                </label>
                <select
                  name='status'
                  defaultValue={status}
                  className='h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none'
                >
                  <option value='all'>All</option>
                  <option value='reserved'>Reserved</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='completed'>Completed</option>
                  <option value='no_show'>No-show</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>

              <div className='sm:col-span-1'>
                <label className='mb-1 block text-xs font-medium text-black/60'>
                  From
                </label>
                <Input
                  name='from'
                  type='date'
                  defaultValue={from ?? ""}
                  className='rounded-2xl'
                />
              </div>

              <div className='sm:col-span-1'>
                <label className='mb-1 block text-xs font-medium text-black/60'>
                  To
                </label>
                <Input
                  name='to'
                  type='date'
                  defaultValue={to ?? ""}
                  className='rounded-2xl'
                />
              </div>

              <div className='sm:col-span-1'>
                <label className='mb-1 block text-xs font-medium text-black/60'>
                  Search
                </label>
                <Input
                  name='q'
                  placeholder='Name / Ref / Mobile'
                  defaultValue={q}
                  className='rounded-2xl'
                />
              </div>
            </div>

            <div className='flex gap-2'>
              <Button type='submit' className='rounded-2xl'>
                Apply
              </Button>

              <Link href='/admin'>
                <Button type='button' variant='outline' className='rounded-2xl'>
                  Clear
                </Button>
              </Link>
            </div>
          </form>

          {appointments.length === 0 ? (
            <p className='text-sm text-black/60'>No appointments found.</p>
          ) : (
            <div className='overflow-x-auto rounded-2xl border border-black/10'>
              <table className='w-full text-sm'>
                <thead className='bg-[#FAF7F1] text-left text-black/70'>
                  <tr>
                    <th className='px-4 py-3'>Created</th>
                    <th className='px-4 py-3'>Appointment</th>
                    <th className='px-4 py-3'>Service</th>
                    <th className='px-4 py-3'>Patient</th>
                    <th className='px-4 py-3'>Mobile</th>
                    <th className='px-4 py-3'>Ref</th>
                    <th className='px-4 py-3'>Status</th>
                    <th className='px-4 py-3 text-right'>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a, idx) => (
                    <tr
                      key={a.id}
                      className={[
                        "border-t border-black/10",
                        idx % 2 === 0 ? "bg-white" : "bg-black/1",
                        "hover:bg-black/3",
                      ].join(" ")}
                    >
                      <td className='px-4 py-3 whitespace-nowrap text-black/70'>
                        {new Date(a.created_at).toLocaleString()}
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap font-medium text-black/80'>
                        {formatAppointmentDate(a.appointment_date)}
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap'>
                        {/* ✅ show label if slug */}
                        {SERVICE_LABEL[a.service] ?? a.service}
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap'>
                        {a.full_name}
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap'>
                        {a.mobile}
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap font-mono text-[13px] text-black/70'>
                        {a.reference}
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap'>
                        <span
                          className={[
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                            statusClass(a.status),
                          ].join(" ")}
                        >
                          {a.status}
                        </span>
                      </td>

                      <td className='px-4 py-3 whitespace-nowrap text-right'>
                        <AppointmentActions
                          appointmentId={a.id}
                          currentStatus={a.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className='flex flex-wrap items-center justify-between gap-3 pt-1'>
            <p className='text-sm text-black/60'>
              Showing{" "}
              <span className='font-medium text-black/80'>
                {total === 0 ? 0 : fromIdx + 1}–{Math.min(toIdx + 1, total)}
              </span>{" "}
              of <span className='font-medium text-black/80'>{total}</span>
            </p>

            <div className='flex items-center gap-2'>
              <Link
                aria-disabled={!canPrev}
                className={!canPrev ? "pointer-events-none opacity-50" : ""}
                href={buildQS({ ...baseParams, page: String(page - 1) })}
              >
                <Button variant='outline' className='rounded-2xl'>
                  Prev
                </Button>
              </Link>

              <span className='text-sm text-black/60'>
                Page <span className='font-medium text-black/80'>{page}</span> /{" "}
                <span className='font-medium text-black/80'>{totalPages}</span>
              </span>

              <Link
                aria-disabled={!canNext}
                className={!canNext ? "pointer-events-none opacity-50" : ""}
                href={buildQS({ ...baseParams, page: String(page + 1) })}
              >
                <Button variant='outline' className='rounded-2xl'>
                  Next
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
