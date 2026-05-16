"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";

import BranchPickerModal from "@/components/dental/branch-picker-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRANCHES } from "@/lib/branches";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";
const GOLD_DARK_HOVER = "#A7894B";

const PHONE = BRANCHES["manila-main"].phone;

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Location", href: "/location" },
  { label: "Testimonials", href: "/testimonials" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  function isActive(href: string) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function openBookingFromMenu() {
    setMenuOpen(false);
    setTimeout(() => setBookOpen(true), 120);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#FAF7F1]/90 backdrop-blur">
        <div className="h-0.5 w-full" style={{ backgroundColor: GOLD }} />

        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <div className="relative h-10 w-28 sm:h-12 sm:w-36">
              <Image
                src="/logo.png"
                alt="MaxSmile Dental Clinic"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 112px, 144px"
              />
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-black/70 md:flex">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "relative transition hover:text-black",
                    active && "text-black",
                  )}
                >
                  {item.label}
                  <span
                    className={cx(
                      "pointer-events-none absolute -bottom-2 left-0 h-px w-full opacity-0 transition",
                      active && "opacity-100",
                    )}
                    style={{ backgroundColor: GOLD_DARK }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-black/75 transition hover:bg-black/5"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <button
              type="button"
              onClick={() => setBookOpen(true)}
              className="h-11 rounded-xl px-5 text-sm font-medium text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
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
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setBookOpen(true)}
              className="h-10 rounded-xl px-3 text-[11px] font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              style={{ backgroundColor: GOLD_DARK }}
            >
              Book
            </button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 w-10 rounded-xl border-black/10 bg-white/70 p-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[86vw] max-w-sm bg-[#FAF7F1]"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-lg text-black">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-1">
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
                            : "border-transparent text-black/70 hover:bg-white/60",
                        )}
                      >
                        <span>{item.label}</span>
                        <span
                          className={cx(
                            "h-1.5 w-1.5 rounded-full opacity-0",
                            active && "opacity-100",
                          )}
                          style={{ backgroundColor: GOLD_DARK }}
                        />
                      </Link>
                    );
                  })}
                </div>

                <Separator className="my-5" />

                <Button
                  type="button"
                  onClick={openBookingFromMenu}
                  className="h-11 w-full rounded-xl text-white"
                  style={{ backgroundColor: GOLD_DARK }}
                >
                  Book Appointment
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="mt-3 h-11 w-full rounded-xl"
                >
                  <a
                    href={`tel:${PHONE}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <BranchPickerModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
