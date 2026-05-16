"use client";

import BranchHours from "@/components/dental/BranchHours";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Clock, CheckCircle2, CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { BRANCHES, BranchSlug } from "@/lib/branches";
import { HOLIDAYS } from "@/lib/booking-rules";
import { SERVICES, type ServiceValue } from "@/lib/services";

// Brand tones
const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

// ✅ Clinic name (used in display + subtitle checks)
const LOGO_ALT = "MaxSmile Dental Clinic";

// ✅ Holiday dates (YYYY-MM-DD) — clinic is closed on these days
/** Convert Date to local YYYY-MM-DD */
function toLocalISO(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function isHoliday(iso: string): boolean {
  return iso in HOLIDAYS;
}

function getHolidayLabel(iso: string): string {
  return HOLIDAYS[iso] || "Holiday";
}

/** Returns true if the date is either Tuesday or a holiday */
function isClosedDate(iso: string): boolean {
  return isOffDay(iso) || isHoliday(iso);
}

/** Returns a user-facing reason why the date is closed, or "" if open */
function closedDateMessage(iso: string): string {
  if (isOffDay(iso)) {
    return "We're closed every Tuesday. Please choose another date.";
  }
  if (isHoliday(iso)) {
    return `We're closed on ${getHolidayLabel(iso)}. Please choose another date.`;
  }
  return "";
}

function mapsLink(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function todayLocalISO() {
  return toLocalISO(new Date());
}

// ✅ display like "Jan/03/2026"
function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  const mon = date.toLocaleString("en-US", { month: "short" });
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mon}/${dd}/${yyyy}`;
}

/** ❌ Off day: Tuesday (0=Sun, 1=Mon, 2=Tue, ...) */
const OFF_DAY = 2;

function isOffDay(iso: string) {
  if (!iso) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.getDay() === OFF_DAY;
}

/** If today is a closed date (Tuesday or holiday), default to the next open day */
function nextOpenDateFrom(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);

  while (dt.getDay() === OFF_DAY || isHoliday(toLocalISO(dt))) {
    dt.setDate(dt.getDate() + 1);
  }

  return toLocalISO(dt);
}

/** Convert YYYY-MM-DD to a local Date object (midnight) */
function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Holiday Date objects for the calendar (for red styling) */
const HOLIDAY_DATES = Object.keys(HOLIDAYS).map(isoToDate);

export default function BookingPageClient({
  branchSlug,
}: {
  branchSlug: string;
}) {
  const router = useRouter();
  const branch = BRANCHES[branchSlug as BranchSlug];

  const [service, setService] = useState<ServiceValue>(SERVICES[0]?.value);
  const [date, setDate] = useState<string>(() =>
    nextOpenDateFrom(todayLocalISO()),
  );

  const [dateError, setDateError] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reference, setReference] = useState<string>("");
  const [reservedOpen, setReservedOpen] = useState(false);

  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

  const [checkingCapacity, setCheckingCapacity] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [calendarOpen]);

  useEffect(() => {
    const next = nextOpenDateFrom(todayLocalISO());
    setDate(next);
    setDateError("");
    setConfirmed(false);
    setReference("");
    setFullName("");
    setMobile("");
    setService(SERVICES[0]?.value);
    setReservedOpen(false);
    setPrivacyAgreed(false);
    setPrivacyError(false);
    setCheckingCapacity(false);
    setIsFull(false);
    setCalendarOpen(false);
  }, [branchSlug]);

  // Check capacity when date/branch changes
  useEffect(() => {
    if (!branch || !date) return;

    const closedMsg = closedDateMessage(date);
    if (closedMsg) {
      setIsFull(true);
      setDateError(closedMsg);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function checkCapacity() {
      setCheckingCapacity(true);
      try {
        const res = await fetch(
          `/api/appointments?branchSlug=${encodeURIComponent(branchSlug)}&date=${encodeURIComponent(date)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return;
        if (cancelled) return;

        const full = !!json?.isFull;
        setIsFull(full);
        setDateError(full ? "Schedule for this date is full. Please choose another day." : "");
      } catch (e: unknown) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setIsFull(false);
        }
      } finally {
        if (!cancelled) setCheckingCapacity(false);
      }
    }

    checkCapacity();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [branchSlug, date, branch]);

  const canConfirm =
    !!branch &&
    !!date &&
    !isClosedDate(date) &&
    !isFull &&
    fullName.trim().length >= 2 &&
    mobile.trim().length >= 8 &&
    privacyAgreed &&
    !submitting &&
    !checkingCapacity;

  function handleDateSelect(selected: Date | undefined) {
    if (!selected) return;
    const iso = toLocalISO(selected);
    setDate(iso);
    setCalendarOpen(false);

    const closedMsg = closedDateMessage(iso);
    setDateError(closedMsg);
    setIsFull(!!closedMsg);
  }

  async function handleConfirm() {
    if (!branch || !date || submitting || confirmed) return;
    setDateError("");

    if (!privacyAgreed) {
      setPrivacyError(true);
      return;
    }

    const closedMsg = closedDateMessage(date);
    if (closedMsg) {
      setDateError(closedMsg);
      return;
    }

    if (isFull) {
      setDateError("Schedule for this date is full. Please choose another day.");
      return;
    }

    setPrivacyError(false);
    setSubmitting(true);
    setConfirmed(false);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchSlug,
          service,
          date,
          fullName,
          mobile,
          privacyAgreed: true,
          website: "",
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setIsFull(true);
        setDateError(json?.error || "Schedule for this date is full. Please choose another day.");
        return;
      }

      if (!res.ok) throw new Error(json?.error || "Failed to submit booking.");

      setReference(json.reference);
      setConfirmed(true);
      setReservedOpen(true);
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSuccessOk() {
    setReservedOpen(false);
    router.push("/services");
  }

  if (!branch) {
    return (
      <div className='mx-auto w-full max-w-3xl px-4 py-10'>
        <Card className='rounded-3xl border-black/10'>
          <CardHeader>
            <CardTitle>Branch not found</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-black/70'>
            <p>This booking page does not exist. Please choose a branch again.</p>
            <Button
              onClick={() => router.push("/")}
              className='rounded-xl text-white'
              style={{ backgroundColor: GOLD_DARK }}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const clinicDisplayName = `${LOGO_ALT} - ${branch.name}`;
  const mapQuery = `${clinicDisplayName} ${branch.address}`;
  const displayDate = formatDisplayDate(date);
  const isClosedSelected = isClosedDate(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      {/* ✅ Custom calendar styles injected via <style> */}
      <style>{`
        .booking-calendar {
          --rdp-accent-color: ${GOLD_DARK};
          --rdp-accent-background-color: ${GOLD}33;
          font-family: inherit;
        }
        .booking-calendar .rdp-day {
          border-radius: 10px;
        }
        .booking-calendar .rdp-selected .rdp-day_button {
          background-color: ${GOLD_DARK};
          color: #fff;
          font-weight: 600;
        }
        .booking-calendar .rdp-disabled .rdp-day_button {
          opacity: 0.35;
        }
        /* ✅ Holiday dates: red text + light red bg */
        .booking-calendar .rdp-holiday .rdp-day_button {
          color: #dc2626 !important;
          background-color: #fef2f2 !important;
          font-weight: 600;
          text-decoration: line-through;
        }
        .booking-calendar .rdp-holiday.rdp-disabled .rdp-day_button {
          color: #dc2626 !important;
          background-color: #fef2f2 !important;
          opacity: 0.7;
        }
        /* ✅ Tuesday dates: muted strikethrough */
        .booking-calendar .rdp-tuesday .rdp-day_button {
          color: #9ca3af !important;
          text-decoration: line-through;
        }
      `}</style>

      <main className='min-h-svh bg-[#FAF7F1] flex flex-col overflow-x-hidden'>
        <div className='flex-1 overflow-y-auto lg:overflow-hidden pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-0'>
          <section className='mx-auto h-full w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
            <div className='grid min-h-0 gap-4 lg:grid-cols-12 lg:gap-6'>
              {/* Booking UI */}
              <div className='order-1 lg:order-2 lg:col-span-7 min-h-0'>
                <Card className='rounded-3xl border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] lg:h-full flex flex-col'>
                  <CardHeader className='pb-3 shrink-0'>
                    <CardTitle className='text-lg tracking-tight sm:text-xl'>
                      Book an appointment
                    </CardTitle>
                    <div className='mt-2 h-px w-20' style={{ backgroundColor: GOLD }} />
                    <p className='mt-2 text-sm text-black/60'>
                      No time selection needed. We&apos;ll arrange your time based on
                      availability and confirm via call/text.
                    </p>
                  </CardHeader>

                  <CardContent className='space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto'>
                    <div className='grid gap-3 sm:gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='service'>Service</Label>
                        <select
                          id='service'
                          value={service}
                          onChange={(e) => setService(e.target.value as ServiceValue)}
                          className='h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#DAC583]/40'
                        >
                          {SERVICES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* ✅ Custom calendar picker */}
                      <div className='space-y-2'>
                        <Label>Date</Label>
                        <div className='relative' ref={calendarRef}>
                          <button
                            type='button'
                            onClick={() => setCalendarOpen((o) => !o)}
                            className='flex h-11 w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#DAC583]/40'
                          >
                            <span className={date ? "text-black" : "text-black/40"}>
                              {date ? displayDate : "Select a date"}
                            </span>
                            <CalendarDays className='h-4 w-4 text-black/40' />
                          </button>

                          {calendarOpen && (
                            <div className='absolute left-1/2 top-[calc(100%+4px)] z-50 w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-3 shadow-xl sm:left-0 sm:w-auto sm:translate-x-0'>
                              <DayPicker
                                className='booking-calendar'
                                mode='single'
                                selected={date ? isoToDate(date) : undefined}
                                onSelect={handleDateSelect}
                                defaultMonth={date ? isoToDate(date) : today}
                                disabled={[
                                  { before: today },
                                  { dayOfWeek: [OFF_DAY] },
                                  ...HOLIDAY_DATES.map((d) => d),
                                ]}
                                modifiers={{
                                  holiday: HOLIDAY_DATES,
                                  tuesday: { dayOfWeek: [OFF_DAY] },
                                }}
                                modifiersClassNames={{
                                  holiday: "rdp-holiday",
                                  tuesday: "rdp-tuesday",
                                }}
                                showOutsideDays
                                fixedWeeks
                              />
                              <div className='mt-1 flex items-center gap-4 border-t border-black/5 pt-2 text-[10px] text-black/50'>
                                <span className='flex items-center gap-1'>
                                  <span className='inline-block h-2.5 w-2.5 rounded-sm bg-red-100 border border-red-300' />
                                  Holiday
                                </span>
                                <span className='flex items-center gap-1'>
                                  <span className='inline-block h-2.5 w-2.5 rounded-sm bg-gray-100 border border-gray-300' />
                                  Tuesday (closed)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {dateError ? (
                          <p className='text-[11px] font-medium text-red-600'>{dateError}</p>
                        ) : date ? (
                          <p className='text-[11px] text-black/55'>
                            Selected: <span className='font-semibold'>{displayDate}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Banner if a closed date is somehow selected */}
                    {isClosedSelected && !dateError ? (
                      <div className='rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700'>
                        {closedDateMessage(date) || "We are closed on this date. Please choose another date."}
                      </div>
                    ) : null}

                    <div className='grid gap-3 sm:gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Full Name</Label>
                        <Input
                          id='name'
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder='Juan Dela Cruz'
                          className='h-11 rounded-xl'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='mobile'>Mobile Number</Label>
                        <Input
                          id='mobile'
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder='09xx xxx xxxx'
                          inputMode='tel'
                          className='h-11 rounded-xl'
                        />
                      </div>
                    </div>

                    {/* Privacy Notice + Consent */}
                    <div className='rounded-2xl border border-black/10 bg-white p-4'>
                      <p className='text-xs leading-relaxed text-black/70'>
                        <span className='font-semibold text-black'>Privacy Notice:</span>{" "}
                        By submitting this form, you consent to the collection and
                        processing of your personal information in accordance with
                        the Data Privacy Act of 2012 (RA 10173). Your data will be
                        used only to contact you regarding your inquiry and will
                        not be shared without your consent.
                      </p>

                      <div className='mt-3 flex items-start gap-2'>
                        <input
                          id='privacy-consent'
                          type='checkbox'
                          checked={privacyAgreed}
                          onChange={(e) => {
                            setPrivacyAgreed(e.target.checked);
                            if (e.target.checked) setPrivacyError(false);
                          }}
                          className='mt-0.5 h-4 w-4 rounded border-black/20 accent-[#B19552]'
                        />
                        <label htmlFor='privacy-consent' className='text-xs text-black/70'>
                          I agree to the Privacy Notice.
                        </label>
                      </div>

                      {privacyError && (
                        <p className='mt-2 text-xs font-medium text-red-600'>
                          Please tick the checkbox to continue.
                        </p>
                      )}
                    </div>

                    {confirmed && (
                      <div className='rounded-2xl border border-[#DAC583]/35 bg-[#FAF7F1] p-4 text-sm text-black/75'>
                        <div className='flex items-start gap-2'>
                          <CheckCircle2 className='mt-0.5 h-4 w-4' style={{ color: GOLD_DARK }} />
                          <div className='min-w-0'>
                            <p className='font-medium text-black'>Booking request received!</p>
                            <p className='mt-1'>
                              Reference: <span className='font-semibold'>{reference}</span>
                            </p>
                            <p className='mt-2 text-black/65'>
                              {branch.name} • {displayDate}
                            </p>
                            <p className='mt-2 text-black/65'>Your booking has been reserved.</p>
                            <p className='mt-2 text-black/60'>
                              Please note: we serve on a first come, first served
                              basis. If you&apos;re unable to come, your slot may be
                              released to other patients.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Desktop confirm button */}
                    <div className='hidden sm:block'>
                      <Button
                        type='button'
                        onClick={handleConfirm}
                        disabled={!canConfirm || confirmed}
                        className='h-12 w-full rounded-2xl text-white'
                        style={{
                          backgroundColor: confirmed || !canConfirm ? "#cbbf9a" : GOLD_DARK,
                        }}
                      >
                        {confirmed
                          ? "Reserved"
                          : submitting
                            ? "Submitting..."
                            : isClosedSelected
                              ? "Clinic Closed"
                              : isFull
                                ? "Schedule Full"
                                : "Confirm Appointment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Branch Info */}
              <div className='order-2 lg:order-1 lg:col-span-5 min-h-0'>
                <Card className='rounded-3xl border-black/10 bg-white lg:h-full flex flex-col'>
                  <CardHeader className='pb-3 shrink-0'>
                    <CardTitle className='text-lg tracking-tight'>Branch details</CardTitle>
                    <div className='mt-2 h-px w-16' style={{ backgroundColor: GOLD }} />
                  </CardHeader>

                  <CardContent className='space-y-4 text-sm text-black/70 lg:min-h-0 lg:flex-1 lg:overflow-y-auto'>
                    <div className='overflow-hidden rounded-2xl border border-black/10 bg-white'>
                      <iframe
                        title={`${clinicDisplayName} map`}
                        src={branch.mapEmbedSrc}
                        className='h-40 w-full sm:h-56 lg:h-60'
                        style={{ border: 0 }}
                        loading='lazy'
                        referrerPolicy='no-referrer-when-downgrade'
                        allowFullScreen
                      />
                    </div>

                    <p className='text-black leading-snug wrap-break-word'>
                      <span className='font-medium'>{clinicDisplayName}</span>
                      {branch.subtitle &&
                      branch.subtitle !== LOGO_ALT &&
                      branch.subtitle !== branch.name ? (
                        <span className='mt-1 block text-xs text-black/60'>
                          {branch.subtitle}
                        </span>
                      ) : null}
                    </p>

                    <a
                      href={mapsLink(mapQuery)}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-start gap-2 hover:underline wrap-break-word'
                    >
                      <MapPin className='mt-0.5 h-4 w-4 shrink-0' style={{ color: GOLD_DARK }} />
                      <span className='wrap-break-word'>{branch.address}</span>
                    </a>

                    <div className='flex items-start gap-2'>
                      <Clock className='mt-0.5 h-4 w-4 shrink-0' style={{ color: GOLD_DARK }} />
                      <div className='min-w-0 flex-1'>
                        <BranchHours hours={branch.hours} />
                      </div>
                    </div>

                    <a
                      href={`tel:${branch.phone}`}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-[#FAF7F1] px-4 py-3 text-sm font-semibold text-black/80 transition hover:bg-black/5'
                    >
                      <Phone className='h-4 w-4' style={{ color: GOLD_DARK }} />
                      <span>{branch.phone}</span>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>

        {/* Mobile sticky confirm */}
        {!confirmed && (
          <div className='fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/85 backdrop-blur sm:hidden pb-[env(safe-area-inset-bottom)]'>
            <div className='mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3'>
              <div className='min-w-0'>
                <p className='truncate text-xs font-semibold text-black'>
                  {branch.name}
                  {displayDate ? ` • ${displayDate}` : ""}
                </p>
                <p className='truncate text-[11px] text-black/60'>
                  {isClosedSelected
                    ? isHoliday(date)
                      ? `Closed — ${getHolidayLabel(date)}`
                      : "Closed every Tuesday"
                    : isFull
                      ? "Schedule is full — choose another day"
                      : canConfirm
                        ? "Ready to confirm"
                        : privacyAgreed
                          ? "Enter your details to continue"
                          : "Please agree to the Privacy Notice"}
                </p>
              </div>

              <button
                type='button'
                onClick={handleConfirm}
                disabled={!canConfirm}
                className='ml-auto h-11 shrink-0 rounded-xl px-4 text-xs font-semibold text-white'
                style={{ backgroundColor: canConfirm ? GOLD_DARK : "#cbbf9a" }}
              >
                {submitting
                  ? "Submitting..."
                  : isClosedSelected
                    ? "Closed"
                    : isFull
                      ? "Full"
                      : "Confirm"}
              </button>
            </div>
          </div>
        )}

        {/* Success dialog */}
        <Dialog open={reservedOpen} onOpenChange={setReservedOpen}>
          <DialogContent className='rounded-3xl border-black/10'>
            <DialogHeader>
              <DialogTitle className='tracking-tight'>Reservation Confirmed</DialogTitle>
              <DialogDescription className='text-black/70'>
                Your slot has been reserved. SMS sent with your reservation details.
                <span className='block mt-1 text-xs text-black/55'>
                  If you don&apos;t receive the SMS, please double-check your number or call the clinic.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className='mt-2 rounded-2xl border border-black/10 bg-[#FAF7F1] p-4 text-sm text-black/70'>
              <p className='font-semibold text-black'>{branch.name}</p>
              <p className='mt-1'>{displayDate}</p>
              {reference ? (
                <p className='mt-2'>
                  Reference: <span className='font-semibold'>{reference}</span>
                </p>
              ) : null}
            </div>

            <div className='mt-4 flex gap-2'>
              <Button
                type='button'
                onClick={handleSuccessOk}
                className='w-full rounded-2xl text-white'
                style={{ backgroundColor: GOLD_DARK }}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
