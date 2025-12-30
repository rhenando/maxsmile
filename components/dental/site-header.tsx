"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 border-b border-black/10 bg-[#FAF7F1]/80 backdrop-blur'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8'>
        <Link href='#' className='flex items-center gap-2'>
          {/* Logo */}
          <div className='relative h-10 w-28 sm:h-12 sm:w-36'>
            <Image
              src='/logo.png'
              alt='MaxSmile Dental Clinic'
              fill
              className='object-contain'
              priority
              sizes='(max-width: 640px) 112px, 144px'
            />
          </div>
        </Link>

        <nav className='hidden items-center gap-6 text-base text-black/70 md:flex'>
          <a href='#services' className='hover:text-black'>
            Services
          </a>
          <a href='#location' className='hover:text-black'>
            Location
          </a>
          <a href='#faq' className='hover:text-black'>
            FAQ
          </a>
        </nav>

        {/* CTA scales nicely on mobile */}
        <Button
          asChild
          className='h-10 rounded-xl bg-[#AF9046] px-4 text-xs font-medium text-white hover:bg-[#9C813E] sm:h-11 sm:px-5 sm:text-sm'
        >
          <a href='#book'>Book Appointment</a>
        </Button>
      </div>
    </header>
  );
}
