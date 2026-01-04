"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ChevronLeft, CheckCircle2 } from "lucide-react";

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

// Brand tones
const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

// ✅ Logo (put file in /public/)
const LOGO_SRC = "/logo.png";
const LOGO_ALT = "MaxSmile Dental Clinic";

const SERVICES = [
  { value: "consultation", label: "Consultation (30 mins)" },
  { value: "cleaning", label: "Cleaning (45 mins)" },
  { value: "fillings", label: "Fillings (60 mins)" },
  { value: "whitening", label: "Whitening (60 mins)" },
  { value: "braces", label: "Braces Assessment (45 mins)" },
] as const;

type ServiceValue = (typeof SERVICES)[number]["value"];

function mapsLink(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    q
  )}`;
}

function todayLocalISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
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

export default function BookingPageClient({
  branchSlug,
}: {
  branchSlug: string;
}) {
  const router = useRouter();

  const branch = BRANCHES[branchSlug as BranchSlug];

  const [service, setService] = useState<ServiceValue>("consultation");
  const [date, setDate] = useState<string>(() => todayLocalISO());

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reference, setReference] = useState<string>("");

  // ✅ server/admin will use this for first-come-first-serve sorting
  const [createdAt, setCreatedAt] = useState<string>("");

  // ✅ dialog after successful confirm
  const [reservedOpen, setReservedOpen] = useState(false);

  // ✅ Privacy consent
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

  useEffect(() => {
    setDate(todayLocalISO());
    setConfirmed(false);
    setReference("");
    setCreatedAt("");
    setFullName("");
    setMobile("");
    setService("consultation");
    setReservedOpen(false);
    setPrivacyAgreed(false);
    setPrivacyError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchSlug]);

  // ✅ Redirect to /services after successful submit (when dialog opens)
  useEffect(() => {
    if (!reservedOpen) return;

    const t = setTimeout(() => {
      router.push("/services");
    }, 900);

    return () => clearTimeout(t);
  }, [reservedOpen, router]);

  const canConfirm =
    !!branch &&
    !!date &&
    fullName.trim().length >= 2 &&
    mobile.trim().length >= 8 &&
    privacyAgreed &&
    !submitting;

  async function handleConfirm() {
    if (!branch || !date || submitting || confirmed) return;

    if (!privacyAgreed) {
      setPrivacyError(true);
      return;
    }

    setPrivacyError(false);
    setSubmitting(true);
    setConfirmed(false);

    // ✅ record the exact moment they booked (admin uses this)
    const nowIso = new Date().toISOString();
    setCreatedAt(nowIso);

    // simulate processing
    await new Promise((r) => setTimeout(r, 650));

    const ref =
      "MS-" +
      Math.random().toString(36).slice(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    setReference(ref);
    setConfirmed(true);
    setSubmitting(false);

    // ✅ show success dialog (then redirect effect runs)
    setReservedOpen(true);

    /**
     * Later (Supabase):
     * insert { branchSlug, service, date, fullName, mobile, createdAt: nowIso, reference: ref }
     * Then admin dashboard sorts by createdAt ASC for first-come-first-serve.
     */
  }

  if (!branch) {
    return (
      <div className='mx-auto w-full max-w-3xl px-4 py-10'>
        <Card className='rounded-3xl border-black/10'>
          <CardHeader>
            <CardTitle>Branch not found</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-black/70'>
            <p>
              This booking page doesn’t exist. Please choose a branch again.
            </p>
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

  return (
    <main className='min-h-svh bg-[#FAF7F1] flex flex-col overflow-x-hidden'>
      {/* Top strip */}
      <div className='shrink-0 border-b border-black/10 bg-white/60 backdrop-blur'>
        <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8'>
          <button
            type='button'
            onClick={() => router.back()}
            className='inline-flex items-center gap-2 text-sm text-black/70 hover:text-black'
          >
            <ChevronLeft className='h-4 w-4' />
            <span className='hidden sm:inline'>Back</span>
          </button>

          <Link href='/' className='inline-flex items-center justify-center'>
            <div className='relative h-9 w-32 sm:h-12 sm:w-56'>
              <Image
                src={LOGO_SRC}
                alt={LOGO_ALT}
                fill
                className='object-contain'
                priority
              />
            </div>
          </Link>

          <p className='hidden sm:block max-w-45 truncate text-xs uppercase tracking-[0.22em] text-black/50'>
            {branch.name}
          </p>
        </div>
      </div>

      {/* content */}
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
                  <div
                    className='mt-2 h-px w-20'
                    style={{ backgroundColor: GOLD }}
                  />
                  <p className='mt-2 text-sm text-black/60'>
                    No time selection needed. We’ll arrange your time based on
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
                        onChange={(e) =>
                          setService(e.target.value as ServiceValue)
                        }
                        className='h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#DAC583]/40'
                      >
                        {SERVICES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='date'>Date</Label>
                      <Input
                        id='date'
                        type='date'
                        min={todayLocalISO()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className='h-11 rounded-xl'
                      />
                      <p className='text-[11px] text-black/55'>
                        Selected:{" "}
                        <span className='font-semibold'>{displayDate}</span>
                      </p>
                    </div>
                  </div>

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

                  {/* ✅ Privacy Notice + Consent */}
                  <div className='rounded-2xl border border-black/10 bg-white p-4'>
                    <p className='text-xs leading-relaxed text-black/70'>
                      <span className='font-semibold text-black'>
                        Privacy Notice:
                      </span>{" "}
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
                      <label
                        htmlFor='privacy-consent'
                        className='text-xs text-black/70'
                      >
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
                        <CheckCircle2
                          className='mt-0.5 h-4 w-4'
                          style={{ color: GOLD_DARK }}
                        />
                        <div className='min-w-0'>
                          <p className='font-medium text-black'>
                            Booking request received!
                          </p>
                          <p className='mt-1'>
                            Reference:{" "}
                            <span className='font-semibold'>{reference}</span>
                          </p>
                          <p className='mt-2 text-black/65'>
                            {branch.name} • {displayDate}
                          </p>
                          <p className='mt-2 text-black/65'>
                            Your booking has been reserved.
                          </p>
                          <p className='mt-2 text-black/60'>
                            Please note: we serve on a first come, first served
                            basis. If you’re unable to come, your slot may be
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
                        backgroundColor:
                          confirmed || !canConfirm ? "#cbbf9a" : GOLD_DARK,
                      }}
                    >
                      {confirmed
                        ? "Reserved"
                        : submitting
                        ? "Submitting..."
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
                  <CardTitle className='text-lg tracking-tight'>
                    Branch details
                  </CardTitle>
                  <div
                    className='mt-2 h-px w-16'
                    style={{ backgroundColor: GOLD }}
                  />
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
                    <MapPin
                      className='mt-0.5 h-4 w-4 shrink-0'
                      style={{ color: GOLD_DARK }}
                    />
                    <span className='wrap-break-word'>{branch.address}</span>
                  </a>

                  <div className='flex items-start gap-2'>
                    <Clock
                      className='mt-0.5 h-4 w-4 shrink-0'
                      style={{ color: GOLD_DARK }}
                    />
                    <span className='wrap-break-word'>{branch.hours}</span>
                  </div>

                  <a
                    href={`tel:${branch.phone}`}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-[#FAF7F1] px-4 py-3 text-sm font-semibold text-black/80 transition hover:bg-black/5'
                  >
                    <Phone className='h-4 w-4' style={{ color: GOLD_DARK }} />
                    <span>Call {branch.phone}</span>
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
                {canConfirm
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
              {submitting ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {/* ✅ Success dialog */}
      <Dialog open={reservedOpen} onOpenChange={setReservedOpen}>
        <DialogContent className='rounded-3xl border-black/10'>
          <DialogHeader>
            <DialogTitle className='tracking-tight'>Slot Reserved</DialogTitle>
            <DialogDescription className='text-black/70'>
              Your slot has been reserved. Please visit our clinic. Thank you.
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
              onClick={() => setReservedOpen(false)}
              className='w-full rounded-2xl text-white'
              style={{ backgroundColor: GOLD_DARK }}
            >
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
