"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_OPTIONS = [
  { value: "reserved", label: "Reserved" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No-show" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

function labelForStatus(v?: string) {
  const found = STATUS_OPTIONS.find((s) => s.value === (v || "").toLowerCase());
  return found?.label ?? v ?? "Unknown";
}

export default function AppointmentActions({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>(currentStatus);
  const [err, setErr] = useState<string | null>(null);

  async function updateStatus(nextStatus: StatusValue) {
    if (isPending) return;
    setErr(null);

    const prev = status;
    setStatus(nextStatus); // optimistic

    // ✅ Use the route you actually have: /api/admin/appointments/status
    const res = await fetch("/api/admin/appointments/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointmentId, status: nextStatus }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErr(data?.error ?? "Failed to update status.");
      setStatus(prev);
      return;
    }

    startTransition(() => router.refresh());
  }

  async function deleteAppointment() {
    if (isPending) return;
    setErr(null);

    // ✅ Dynamic route: /api/admin/appointments/[id]
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErr(data?.error ?? "Failed to delete appointment.");
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            variant='outline'
            className='h-9 rounded-2xl border-black/10 bg-white px-3 text-xs font-semibold text-black/70'
            disabled={isPending}
          >
            <span className='mr-2'>{labelForStatus(status)}</span>
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='rounded-2xl'>
          {STATUS_OPTIONS.map((s) => (
            <DropdownMenuItem
              key={s.value}
              onClick={() => updateStatus(s.value)}
              className='cursor-pointer'
              disabled={isPending}
            >
              <span className='text-sm'>{s.label}</span>
              {s.value === (status || "").toLowerCase() ? (
                <span className='ml-auto text-xs text-black/40'>Current</span>
              ) : null}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type='button'
            variant='outline'
            className='h-9 w-9 rounded-2xl border-black/10 p-0'
            disabled={isPending}
            aria-label='Delete appointment'
          >
            <Trash2 className='h-4 w-4 text-red-600' />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className='rounded-3xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The record will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {err ? (
            <p className='rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {err}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-2xl'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAppointment}
              className='rounded-2xl bg-red-600 text-white hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
