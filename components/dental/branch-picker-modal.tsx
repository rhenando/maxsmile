"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MapPin, Phone, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRANCHES, type BranchSlug } from "@/lib/branches";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

export default function BranchPickerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const branchList = useMemo(
    () =>
      (Object.entries(BRANCHES) as [BranchSlug, (typeof BRANCHES)[BranchSlug]][])
        .map(([slug, branch]) => ({
          slug,
          name: branch.name,
          subtitle: branch.subtitle,
          address: branch.address,
          phone: branch.phone,
          href: `/book/${slug}`,
        })),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative w-full max-w-2xl">
        <Card className="rounded-2xl border-black/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-lg tracking-tight sm:text-xl">
                  Choose a Branch
                </CardTitle>
                <div
                  className="mt-2 h-px w-16 sm:w-20"
                  style={{ backgroundColor: GOLD }}
                />
                <p className="mt-3 text-sm text-black/60">
                  Select your preferred branch to continue booking.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:bg-black/5"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="max-h-[70svh] overflow-auto pb-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {branchList.map((branch) => (
                <button
                  key={branch.slug}
                  type="button"
                  onClick={() => go(branch.href)}
                  className="group w-full rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10"
                    style={{ backgroundColor: "rgba(218,197,131,0.16)" }}
                  >
                    <MapPin className="h-5 w-5" style={{ color: GOLD_DARK }} />
                  </div>

                  <p className="font-medium leading-snug text-black">
                    {branch.name}
                  </p>
                  <p className="mt-1 text-sm text-black/60">{branch.subtitle}</p>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-black/55">
                    {branch.address}
                  </p>

                  <span
                    className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] transition group-hover:translate-x-0.5"
                    style={{ color: GOLD_DARK }}
                  >
                    Continue
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 text-xs leading-relaxed text-black/60 sm:flex-row sm:items-center sm:justify-between">
              <span>First-come, first-served basis.</span>
              <a
                href={`tel:${branchList[0]?.phone ?? ""}`}
                className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                style={{ color: GOLD_DARK }}
              >
                <Phone className="h-4 w-4" />
                Call Manila Main
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body,
  );
}
