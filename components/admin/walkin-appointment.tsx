"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ✅ Replace this with your shared SERVICES list if you have one
let SERVICE_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: "Oral Prophylaxis (Cleaning)",
    label: "Oral Prophylaxis (Cleaning)",
  },
  { value: "Tooth Restoration (Pasta)", label: "Tooth Restoration (Pasta)" },
  { value: "Tooth Extraction (Bunot)", label: "Tooth Extraction (Bunot)" },
  { value: "Dentures (Pustiso)", label: "Dentures (Pustiso)" },
  { value: "Jacket Crown", label: "Jacket Crown" },
  { value: "Fixed Bridge", label: "Fixed Bridge" },
  { value: "Veneers", label: "Veneers" },
  { value: "Teeth Whitening", label: "Teeth Whitening" },
  { value: "Root Canal Treatment", label: "Root Canal Treatment" },
  { value: "Implants", label: "Implants" },
  { value: "Surgery", label: "Surgery" },
  { value: "Periapical X-Ray", label: "Periapical X-Ray" },
  { value: "Panoramic X-Ray", label: "Panoramic X-Ray" },
];

try {
  // Optional dynamic import if you prefer resilience
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("@/lib/services");
  if (Array.isArray(mod?.SERVICES)) SERVICE_OPTIONS = mod.SERVICES;
} catch {
  // keep fallback
}

const GOLD_DARK = "#B19552";

const STATUS_OPTIONS = [
  { value: "reserved", label: "Reserved" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No-show" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function WalkInAppointmentButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultDate = useMemo(() => todayYYYYMMDD(), []);
  const defaultService = SERVICE_OPTIONS?.[0]?.value ?? "";

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [service, setService] = useState(defaultService);
  const [appointmentDate, setAppointmentDate] = useState(defaultDate);
  const [status, setStatus] = useState<StatusValue>("confirmed");
  const [err, setErr] = useState<string | null>(null);

  function resetForm() {
    setFullName("");
    setMobile("");
    setService(defaultService);
    setAppointmentDate(defaultDate);
    setStatus("confirmed");
    setErr(null);
  }

  async function handleCreate() {
    setErr(null);

    if (!fullName.trim()) return setErr("Full name is required.");
    if (!mobile.trim()) return setErr("Mobile is required.");
    if (!service) return setErr("Service is required.");
    if (!appointmentDate) return setErr("Appointment date is required.");

    const res = await fetch("/api/admin/appointments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName.trim(),
        mobile: mobile.trim(),
        service,
        appointment_date: appointmentDate,
        status,
        privacy_agreed: true, // ✅ walk-in: set automatically
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErr(data?.error ?? "Failed to create appointment.");
      return;
    }

    setOpen(false);
    resetForm();

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type='button'
        onClick={() => setOpen(true)}
        className='rounded-2xl text-white'
        style={{ backgroundColor: GOLD_DARK }}
      >
        + Walk-in Patient
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetForm();
        }}
      >
        <DialogContent className='rounded-3xl'>
          <DialogHeader>
            <DialogTitle className='tracking-tight'>New Walk-in</DialogTitle>
            <DialogDescription>
              Add a walk-in patient. This will create a new appointment record
              for your branch.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4'>
            {err ? (
              <p className='rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
                {err}
              </p>
            ) : null}

            <div className='grid gap-2'>
              <Label className='text-sm'>Full name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='rounded-2xl'
                placeholder='Juan Dela Cruz'
                disabled={isPending}
              />
            </div>

            <div className='grid gap-2'>
              <Label className='text-sm'>Mobile</Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className='rounded-2xl'
                placeholder='09xxxxxxxxx'
                disabled={isPending}
              />
            </div>

            <div className='grid gap-2'>
              <Label className='text-sm'>Service</Label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className='h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none'
                disabled={isPending}
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='grid gap-2'>
                <Label className='text-sm'>Appointment date</Label>
                <Input
                  type='date'
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className='rounded-2xl'
                  disabled={isPending}
                />
              </div>

              <div className='grid gap-2'>
                <Label className='text-sm'>Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusValue)}
                  className='h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none'
                  disabled={isPending}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className='gap-2 sm:gap-2'>
            <Button
              type='button'
              variant='outline'
              className='rounded-2xl'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type='button'
              className='rounded-2xl text-white'
              style={{ backgroundColor: GOLD_DARK }}
              onClick={handleCreate}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
