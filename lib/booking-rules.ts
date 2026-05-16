import { z } from "zod";

import { BRANCHES, type BranchSlug } from "@/lib/branches";
import { SERVICES, type ServiceValue } from "@/lib/services";

export const DAILY_LIMIT_PER_BRANCH = 20;
export const OFF_DAY = 2;

export const HOLIDAYS: Record<string, string> = {
  "2026-04-02": "Holy Week (Maundy Thursday)",
  "2026-04-03": "Holy Week (Good Friday)",
  "2026-04-04": "Holy Week (Black Saturday)",
};

const BRANCH_SLUGS = Object.keys(BRANCHES) as BranchSlug[];
const SERVICE_VALUES = SERVICES.map((service) => service.value) as [
  ServiceValue,
  ...ServiceValue[],
];

export const branchSlugSchema = z.enum(
  BRANCH_SLUGS as [BranchSlug, ...BranchSlug[]],
);
export const serviceSchema = z.enum(SERVICE_VALUES);
export const statusSchema = z.enum([
  "reserved",
  "confirmed",
  "completed",
  "no_show",
  "cancelled",
]);

export const appointmentDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
  .refine((date) => parseISODateParts(date) !== null, "Invalid date.");

export const publicBookingSchema = z.object({
  branch_slug: branchSlugSchema,
  appointment_date: appointmentDateSchema,
  full_name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(8).max(24),
  service: serviceSchema,
  privacy_agreed: z.literal(true),
  website: z.string().optional(),
});

export const adminAppointmentSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(8).max(24),
  service: serviceSchema,
  appointment_date: appointmentDateSchema,
  status: statusSchema.default("reserved"),
  privacy_agreed: z.boolean(),
});

export type PublicBookingInput = z.infer<typeof publicBookingSchema>;
export type AdminAppointmentInput = z.infer<typeof adminAppointmentSchema>;

export function parseISODateParts(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const y = Number(match[1]);
  const mon = Number(match[2]);
  const d = Number(match[3]);
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

export function isHoliday(iso: string) {
  return iso in HOLIDAYS;
}

export function getHolidayLabel(iso: string) {
  return HOLIDAYS[iso] ?? "Holiday";
}

export function getClosedDateMessage(iso: string) {
  const parts = parseISODateParts(iso);
  if (!parts) return "Invalid appointment date.";

  if (parts.weekday === OFF_DAY) {
    return "We're closed every Tuesday. Please choose another date.";
  }

  if (isHoliday(iso)) {
    return `We're closed on ${getHolidayLabel(iso)}. Please choose another date.`;
  }

  return "";
}

export function makeReference() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `MS-${y}${m}${day}-${rand}`;
}

export function normalizePublicBookingBody(body: unknown) {
  const raw = body as Record<string, unknown> | null;
  const rawPrivacy = raw?.privacy_agreed ?? raw?.privacyAgreed;

  return {
    branch_slug: raw?.branch_slug ?? raw?.branchSlug,
    appointment_date: raw?.appointment_date ?? raw?.date,
    full_name: raw?.full_name ?? raw?.fullName,
    mobile: raw?.mobile,
    service: raw?.service,
    website: raw?.website,
    privacy_agreed:
      rawPrivacy === true ||
      rawPrivacy === "true" ||
      rawPrivacy === 1 ||
      rawPrivacy === "1",
  };
}
