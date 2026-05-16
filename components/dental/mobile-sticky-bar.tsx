"use client";

import { BRANCHES } from "@/lib/branches";

const PHONE = BRANCHES["manila-main"].phone;

export default function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#FAF7F1]/85 backdrop-blur md:hidden">
      <div className="mx-auto w-full max-w-6xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="grid grid-cols-3 gap-2">
          <a
            href="#book"
            className="rounded-xl bg-[#AF9046] px-3 py-3 text-center text-sm font-medium text-white active:scale-[0.99]"
          >
            Book
          </a>

          <a
            href={`tel:${PHONE}`}
            className="rounded-xl border border-black/10 bg-white px-3 py-3 text-center text-sm font-medium text-black/80 active:scale-[0.99]"
          >
            Call
          </a>

          <a
            href="/location"
            className="rounded-xl border border-black/10 bg-white px-3 py-3 text-center text-sm font-medium text-black/80 active:scale-[0.99]"
          >
            Branches
          </a>
        </div>
      </div>
    </div>
  );
}
