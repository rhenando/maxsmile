"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

import BranchPickerModal from "@/components/dental/branch-picker-modal";
import { BRANCHES } from "@/lib/branches";

const HERO_VIDEO_MP4 = "/videos/clinic-hero.mp4";
const HERO_POSTER = "/images/services/consultation.jpg";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";
const GOLD_DARK_HOVER = "#A7894B";
const PHONE = BRANCHES["manila-main"].phone;

export default function HeroBooking() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="book"
      className="relative h-[calc(100svh-4rem)] w-full overflow-hidden sm:h-[calc(100svh-5rem)]"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
      >
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/35 to-black/70" />

      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center sm:px-6">
        <div className="w-full max-w-4xl">
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Achieve Maximum Smiles at Minimal Cost
          </h1>

          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full opacity-95 sm:mt-5 sm:w-24"
            style={{ backgroundColor: GOLD }}
          />

          <p className="mx-auto mt-5 max-w-3xl text-[11px] font-medium uppercase tracking-[0.26em] text-white/90 sm:mt-6 sm:text-sm sm:tracking-[0.32em]">
            Premium dental care with transparent pricing you can trust.
          </p>

          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-2 text-xs text-white/85 sm:mt-7 sm:grid-cols-3">
            <span className="border-white/20 sm:border-r">3 branches</span>
            <span className="border-white/20 sm:border-r">Daily booking</span>
            <span>First-come, first-served</span>
          </div>

          <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full rounded-xl px-6 py-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto sm:px-8 sm:tracking-[0.35em]"
              style={{ backgroundColor: GOLD_DARK }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = GOLD_DARK_HOVER)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = GOLD_DARK)
              }
            >
              Book Appointment
            </button>

            <a
              href={`tel:${PHONE}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/95 backdrop-blur-sm transition hover:bg-white/15 sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          </div>
        </div>
      </div>

      <BranchPickerModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
