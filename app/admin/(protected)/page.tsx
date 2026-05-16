export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AlertTriangle, CalendarCheck2, CheckCircle2, Clock3, Search } from "lucide-react";

import AppointmentActions from "@/components/admin/appointment-actions";
import WalkInAppointmentButton from "@/components/admin/walkin-appointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { SERVICES } from "@/lib/services";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";
const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "reserved", label: "Reserved" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No-show" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];

const SERVICE_LABEL: Record<string, string> = Object.fromEntries(
  SERVICES.map((service) => [service.value, service.label]),
);

type AppointmentRow = {
  id: string;
  created_at: string;
  branch_slug: string;
  service: string;
  appointment_date: string;
  full_name: string;
  mobile: string;
  reference: string | null;
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

function isIsoDate(value?: string) {
  if (!value) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeStatus(value?: string): StatusFilter {
  const candidate = (value ?? "all").toLowerCase();
  return STATUS_OPTIONS.some((option) => option.value === candidate)
    ? (candidate as StatusFilter)
    : "all";
}

function sanitizeSearch(value?: string) {
  return (value ?? "")
    .trim()
    .slice(0, 80)
    .replace(/[%,()]/g, " ")
    .replace(/\s+/g, " ");
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

  return `${months[monthIndex]} ${day}, ${y}`;
}

function statusLabel(status: string) {
  return (
    STATUS_OPTIONS.find((option) => option.value === status.toLowerCase())
      ?.label ?? status
  );
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
  for (const [key, value] of Object.entries(params)) {
    if (value && value.trim() !== "") sp.set(key, value);
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function metricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: number;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-black/10 bg-white shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/45">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
            {value}
          </p>
          <p className="mt-1 text-xs text-black/50">{helper}</p>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10"
          style={{ backgroundColor: "rgba(218,197,131,0.16)", color: GOLD_DARK }}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
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

  const branchSlug = adminRow.branch_slug as string;
  const status = normalizeStatus(toStr(sp?.status));
  const rawFrom = toStr(sp?.from);
  const rawTo = toStr(sp?.to);
  const from = isIsoDate(rawFrom) ? rawFrom : undefined;
  const to = isIsoDate(rawTo) ? rawTo : undefined;
  const q = sanitizeSearch(toStr(sp?.q));
  const page = toInt(toStr(sp?.page), 1);
  const today = todayYYYYMMDD();

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

  const countBy = async (nextStatus?: string, date?: string) => {
    let countQuery = supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("branch_slug", branchSlug);

    if (nextStatus) countQuery = countQuery.eq("status", nextStatus);
    if (date) countQuery = countQuery.eq("appointment_date", date);

    const { count } = await countQuery;
    return count ?? 0;
  };

  const [queryResult, reservedCount, confirmedCount, completedCount, todayCount] =
    await Promise.all([
      query.order("created_at", { ascending: false }).range(fromIdx, toIdx),
      countBy("reserved"),
      countBy("confirmed"),
      countBy("completed"),
      countBy(undefined, today),
    ]);

  const { data: rows, error, count } = queryResult;
  const appointments = (rows ?? []) as AppointmentRow[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const baseParams = {
    status: status === "all" ? undefined : status,
    from,
    to,
    q: q || undefined,
  };

  if (total > 0 && page > totalPages) {
    redirect(`/admin${buildQS({ ...baseParams, page: String(totalPages) })}`);
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const hasFilters = status !== "all" || !!from || !!to || !!q;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCard({
          label: "Today",
          value: todayCount,
          helper: "Appointments dated today",
          icon: <CalendarCheck2 className="h-5 w-5" />,
        })}
        {metricCard({
          label: "Reserved",
          value: reservedCount,
          helper: "Needs confirmation",
          icon: <Clock3 className="h-5 w-5" />,
        })}
        {metricCard({
          label: "Confirmed",
          value: confirmedCount,
          helper: "Ready for visit",
          icon: <CheckCircle2 className="h-5 w-5" />,
        })}
        {metricCard({
          label: "Completed",
          value: completedCount,
          helper: "Finished records",
          icon: <ShieldMetricIcon />,
        })}
      </div>

      <Card className="rounded-2xl border-black/10 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg tracking-tight">
                Appointments
              </CardTitle>
              <div
                className="mt-2 h-px w-20"
                style={{ backgroundColor: GOLD }}
              />
              <p className="mt-2 text-sm text-black/60">
                Review, filter, and update appointment requests for your branch.
              </p>
            </div>

            <WalkInAppointmentButton />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error ? (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error.message}</span>
            </div>
          ) : null}

          <form className="rounded-2xl border border-black/10 bg-[#FAF7F1] p-3">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={status}
                    className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    From
                  </label>
                  <Input
                    name="from"
                    type="date"
                    defaultValue={from ?? ""}
                    className="rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    To
                  </label>
                  <Input
                    name="to"
                    type="date"
                    defaultValue={to ?? ""}
                    className="rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                    <Input
                      name="q"
                      placeholder="Name, ref, or mobile"
                      defaultValue={q}
                      className="rounded-xl bg-white pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="h-10 rounded-xl text-white"
                  style={{ backgroundColor: GOLD_DARK }}
                >
                  Apply
                </Button>

                <Button asChild variant="outline" className="h-10 rounded-xl bg-white">
                  <Link href="/admin">Clear</Link>
                </Button>
              </div>
            </div>
          </form>

          {appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white px-4 py-10 text-center">
              <p className="text-sm font-medium text-black">
                {hasFilters ? "No matching appointments" : "No appointments yet"}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-black/55">
                {hasFilters
                  ? "Try clearing filters or widening your date range."
                  : "New booking and walk-in records will appear here."}
              </p>
              {hasFilters ? (
                <Button asChild variant="outline" className="mt-4 rounded-xl">
                  <Link href="/admin">Clear filters</Link>
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="space-y-3 lg:hidden">
                {appointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="rounded-2xl border-black/10 bg-white shadow-sm"
                  >
                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-black">
                            {appointment.full_name}
                          </p>
                          <p className="mt-1 text-xs text-black/55">
                            {formatAppointmentDate(appointment.appointment_date)}
                          </p>
                        </div>
                        <span
                          className={[
                            "inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                            statusClass(appointment.status),
                          ].join(" ")}
                        >
                          {statusLabel(appointment.status)}
                        </span>
                      </div>

                      <div className="grid gap-3 text-sm text-black/70">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black/40">
                            Service
                          </p>
                          <p className="mt-1 break-words">
                            {SERVICE_LABEL[appointment.service] ??
                              appointment.service}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black/40">
                              Mobile
                            </p>
                            <a
                              href={`tel:${appointment.mobile}`}
                              className="mt-1 block break-words underline-offset-4 hover:underline"
                            >
                              {appointment.mobile}
                            </a>
                          </div>
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black/40">
                              Reference
                            </p>
                            <p className="mt-1 break-all font-mono text-xs">
                              {appointment.reference ?? "Not set"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black/40">
                              Created
                            </p>
                            <p className="mt-1">
                              {new Date(appointment.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="min-[420px]:text-right">
                            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-black/40">
                              Actions
                            </p>
                            <AppointmentActions
                              appointmentId={appointment.id}
                              currentStatus={appointment.status}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-black/10 lg:block">
              <table className="w-full table-fixed text-[13px] leading-snug">
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[12%]" />
                  <col className="w-[16%]" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                  <col className="w-[13%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="bg-[#FAF7F1] text-left text-black/70">
                  <tr>
                    <th className="px-3 py-3 font-medium">Created</th>
                    <th className="px-3 py-3 font-medium">Appointment</th>
                    <th className="px-3 py-3 font-medium">Service</th>
                    <th className="px-3 py-3 font-medium">Patient</th>
                    <th className="px-3 py-3 font-medium">Mobile</th>
                    <th className="px-3 py-3 font-medium">Reference</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment, idx) => (
                    <tr
                      key={appointment.id}
                      className={[
                        "border-t border-black/10",
                        idx % 2 === 0 ? "bg-white" : "bg-[#FAF7F1]/35",
                        "hover:bg-[#FAF7F1]",
                      ].join(" ")}
                    >
                      <td className="break-words px-3 py-3 text-black/65">
                        {new Date(appointment.created_at).toLocaleString()}
                      </td>

                      <td className="break-words px-3 py-3 font-medium text-black/85">
                        {formatAppointmentDate(appointment.appointment_date)}
                      </td>

                      <td className="break-words px-3 py-3">
                        <span>
                          {SERVICE_LABEL[appointment.service] ??
                            appointment.service}
                        </span>
                      </td>

                      <td className="break-words px-3 py-3 font-medium text-black/80">
                        {appointment.full_name}
                      </td>

                      <td className="break-words px-3 py-3">
                        <a
                          href={`tel:${appointment.mobile}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {appointment.mobile}
                        </a>
                      </td>

                      <td className="break-all px-3 py-3 font-mono text-[12px] text-black/65">
                        {appointment.reference ?? "Not set"}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={[
                            "inline-flex max-w-full items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                            statusClass(appointment.status),
                          ].join(" ")}
                        >
                          {statusLabel(appointment.status)}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-right">
                        <AppointmentActions
                          appointmentId={appointment.id}
                          currentStatus={appointment.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-sm text-black/60">
              Showing{" "}
              <span className="font-medium text-black/80">
                {total === 0 ? 0 : fromIdx + 1}-{Math.min(toIdx + 1, total)}
              </span>{" "}
              of <span className="font-medium text-black/80">{total}</span>
            </p>

            <div className="flex items-center gap-2">
              <Link
                aria-disabled={!canPrev}
                className={!canPrev ? "pointer-events-none opacity-50" : ""}
                href={buildQS({ ...baseParams, page: String(page - 1) })}
              >
                <Button variant="outline" className="rounded-xl">
                  Prev
                </Button>
              </Link>

              <span className="text-sm text-black/60">
                Page <span className="font-medium text-black/80">{page}</span> /{" "}
                <span className="font-medium text-black/80">{totalPages}</span>
              </span>

              <Link
                aria-disabled={!canNext}
                className={!canNext ? "pointer-events-none opacity-50" : ""}
                href={buildQS({ ...baseParams, page: String(page + 1) })}
              >
                <Button variant="outline" className="rounded-xl">
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

function ShieldMetricIcon() {
  return <CheckCircle2 className="h-5 w-5" />;
}
