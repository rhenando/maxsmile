"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRANCHES, BranchSlug } from "@/lib/branches";

const HERO_VIDEO_MP4 = "/videos/clinic-hero.mp4";
const HERO_POSTER = "/images/clinic-hero-poster.jpg";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";
const GOLD_DARK_HOVER = "#A7894B";

const PHONE = "+639000000000";

export default function HeroBooking() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // ✅ derive branch list from BRANCHES keys
  // ✅ href must match: app/book/[branchSlug]/page.tsx
  const branchList = useMemo(() => {
    return (
      Object.entries(BRANCHES) as [BranchSlug, (typeof BRANCHES)[BranchSlug]][]
    ).map(([slug, b]) => ({
      slug,
      name: b.name,
      subtitle: b.subtitle,
      href: `/book/${slug}`, // ✅ correct route
    }));
  }, []);

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
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function goToBranch(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <section className='relative w-full overflow-hidden h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)]'>
      <video
        className='absolute inset-0 h-full w-full object-cover'
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        poster={HERO_POSTER}
      >
        <source src={HERO_VIDEO_MP4} type='video/mp4' />
      </video>

      <div className='absolute inset-0 bg-linear-to-b from-black/65 via-black/35 to-black/70' />

      <div className='relative z-10 flex h-full items-center justify-center px-4 sm:px-6 text-center'>
        <div className='w-full max-w-4xl'>
          <h1 className='font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl'>
            Achieve Maximum Smiles at Minimal Cost
          </h1>

          <div
            className='mx-auto mt-4 sm:mt-5 h-1 w-20 sm:w-24 rounded-full opacity-95'
            style={{ backgroundColor: GOLD }}
          />

          <p className='mx-auto mt-5 sm:mt-6 max-w-3xl text-[11px] sm:text-sm font-medium uppercase tracking-[0.26em] sm:tracking-[0.32em] text-white/90'>
            Premium dental care with transparent pricing you can trust.
          </p>

          <div className='mt-7 sm:mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => setOpen(true)}
              className='w-full sm:w-auto rounded-xl px-6 sm:px-8 py-3 text-[11px] font-medium uppercase tracking-[0.32em] sm:tracking-[0.35em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
              style={{ backgroundColor: GOLD_DARK }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = GOLD_DARK_HOVER)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = GOLD_DARK)
              }
            >
              Book an Appointment
            </button>

            <a
              href={`tel:${PHONE}`}
              className='inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/95 backdrop-blur-sm transition hover:bg-white/15'
            >
              <Phone className='h-4 w-4' />
              Call
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4'>
          <button
            type='button'
            aria-label='Close'
            onClick={() => setOpen(false)}
            className='absolute inset-0 bg-black/60'
          />

          <div className='relative w-full max-w-xl'>
            <Card className='rounded-3xl border-black/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.35)]'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <CardTitle className='text-lg tracking-tight sm:text-xl'>
                      Choose a Branch
                    </CardTitle>
                    <div
                      className='mt-2 h-px w-16 sm:w-20'
                      style={{ backgroundColor: GOLD }}
                    />
                    <p className='mt-3 text-sm text-black/60'>
                      Select your preferred branch to continue booking.
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={() => setOpen(false)}
                    className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:bg-black/5'
                    aria-label='Close modal'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>
              </CardHeader>

              <CardContent className='pb-6 max-h-[70svh] overflow-auto'>
                <div className='grid gap-3 grid-cols-1 sm:grid-cols-2'>
                  {branchList.map((b) => (
                    <button
                      key={b.slug}
                      type='button'
                      onClick={() => goToBranch(b.href)}
                      className='group w-full rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2'
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className='mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10'
                          style={{ backgroundColor: "rgba(218,197,131,0.16)" }}
                        >
                          <MapPin
                            className='h-5 w-5'
                            style={{ color: GOLD_DARK }}
                          />
                        </div>

                        <div className='min-w-0'>
                          <p className='font-medium leading-snug text-black'>
                            {b.name}
                          </p>
                          <p className='mt-1 text-sm text-black/60'>
                            {b.subtitle}
                          </p>

                          <span
                            className='mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.18em] transition group-hover:translate-x-0.5'
                            style={{ color: GOLD_DARK }}
                          >
                            Continue →
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className='mt-5 text-xs leading-relaxed text-black/60'>
                  First-come, first-served basis.
                </div>

                <div className='mt-4'>
                  <a
                    href={`tel:${PHONE}`}
                    className='inline-flex items-center gap-2 underline-offset-4 hover:underline italic'
                    style={{ color: GOLD_DARK }}
                  >
                    <Phone className='h-4 w-4' />
                    For urgent concerns! Call us directly
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
