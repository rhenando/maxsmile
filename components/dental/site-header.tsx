"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MapPin, Phone, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { BRANCHES, BranchSlug } from "@/lib/branches";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";
const GOLD_DARK_HOVER = "#A7894B";

const PHONE = "+639000000000";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Location", href: "/location" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BranchPickerModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (href: string) => void;
}) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  const branchList = React.useMemo(() => {
    return (
      Object.entries(BRANCHES) as [BranchSlug, (typeof BRANCHES)[BranchSlug]][]
    ).map(([slug, b]) => ({
      slug,
      name: b.name,
      subtitle: b.subtitle,
      href: `/book/${slug}`,
    }));
  }, []);

  React.useEffect(() => setMounted(true), []);

  // lock body scroll (same behavior as Hero)
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function go(href: string) {
    onClose();
    onPick(href);
    router.push(href);
  }

  if (!open || !mounted) return null;

  // ✅ Portal to body → identical placement/behavior to Hero
  return createPortal(
    <div className='fixed inset-0 z-999 flex items-end sm:items-center justify-center p-3 sm:p-4'>
      <button
        type='button'
        aria-label='Close'
        onClick={onClose}
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
                onClick={onClose}
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
                  onClick={() => go(b.href)}
                  className='group w-full rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10'
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
                      <p className='mt-1 text-sm text-black/60'>{b.subtitle}</p>

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
    </div>,
    document.body
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [bookOpen, setBookOpen] = React.useState(false);

  function isActive(href: string) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function openBooking() {
    setBookOpen(true);
  }

  function openBookingFromMenu() {
    setMenuOpen(false);
    setTimeout(() => setBookOpen(true), 120);
  }

  return (
    <>
      <header className='sticky top-0 z-50 border-b border-black/10 bg-[#FAF7F1]/80 backdrop-blur'>
        <div className='h-0.5 w-full' style={{ backgroundColor: GOLD }} />

        <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8'>
          <Link href='/' className='flex items-center gap-2' aria-label='Home'>
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

          <nav className='hidden items-center gap-6 text-sm font-medium text-black/70 md:flex'>
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "relative transition hover:text-black",
                    active && "text-black"
                  )}
                >
                  {item.label}
                  <span
                    className={cx(
                      "pointer-events-none absolute -bottom-2 left-0 h-px w-full opacity-0 transition",
                      active && "opacity-100"
                    )}
                    style={{ backgroundColor: GOLD_DARK }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className='hidden md:flex'>
            <button
              type='button'
              onClick={openBooking}
              className='h-11 rounded-xl px-5 text-sm font-medium text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10'
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
          </div>

          <div className='flex items-center gap-2 md:hidden'>
            <button
              type='button'
              onClick={openBooking}
              className='h-10 rounded-xl px-3 text-[11px] font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10'
              style={{ backgroundColor: GOLD_DARK }}
            >
              Book an Appointment
            </button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='outline'
                  className='h-10 w-10 rounded-xl border-black/10 bg-white/70 p-0'
                >
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side='right'
                className='w-[86vw] max-w-sm bg-[#FAF7F1]'
              >
                <SheetHeader>
                  <SheetTitle className='text-left font-serif text-lg text-black'>
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className='mt-6 space-y-1'>
                  {NAV.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cx(
                          "flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition",
                          active
                            ? "border-black/10 bg-white text-black"
                            : "border-transparent text-black/70 hover:bg-white/60"
                        )}
                      >
                        <span>{item.label}</span>
                        <span
                          className={cx(
                            "h-1.5 w-1.5 rounded-full opacity-0",
                            active && "opacity-100"
                          )}
                          style={{ backgroundColor: GOLD_DARK }}
                        />
                      </Link>
                    );
                  })}
                </div>

                <Separator className='my-5' />

                <Button
                  type='button'
                  onClick={openBookingFromMenu}
                  className='h-11 w-full rounded-xl text-white'
                  style={{ backgroundColor: GOLD_DARK }}
                >
                  Book an Appointment
                </Button>

                <Button
                  asChild
                  variant='outline'
                  className='mt-3 h-11 w-full rounded-xl'
                >
                  <a
                    href={`tel:${PHONE}`}
                    className='flex items-center justify-center gap-2'
                  >
                    <Phone className='h-4 w-4' />
                    Call
                  </a>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ✅ Portal modal renders outside header (same as Hero behavior) */}
      <BranchPickerModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onPick={() => {}}
      />
    </>
  );
}
