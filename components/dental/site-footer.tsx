import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

const PHONE = "+639000000000";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Location", href: "/location" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-black/10 bg-[#FAF7F1]'>
      {/* subtle gold strip */}
      <div className='h-0.5 w-full' style={{ backgroundColor: GOLD }} />

      <div className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          {/* Left: logo + small text */}
          <div className='flex items-center gap-3'>
            <div className='relative h-9 w-28'>
              <Image
                src='/logo.png'
                alt='MaxSmile Dental Clinic'
                fill
                className='object-contain'
                sizes='112px'
              />
            </div>
          </div>

          {/* Middle: links */}
          <nav className='flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-black/70'>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='transition hover:text-black'
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: call */}
          <a
            href={`tel:${PHONE}`}
            className='inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5'
          >
            <Phone className='h-4 w-4' style={{ color: GOLD_DARK }} />
            Call {PHONE}
          </a>
        </div>

        <Separator className='my-6' />

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-xs text-black/60'>
            © {year} MaxSmile Dental Clinic. All rights reserved.
          </p>

          <p className='text-xs text-black/60'>
            Privacy: Data is used only to contact you about your booking.
          </p>
        </div>
      </div>
    </footer>
  );
}
