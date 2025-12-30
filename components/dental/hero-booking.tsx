"use client";

import { useState, type FormEvent } from "react";
import { Phone, CalendarCheck, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HeroBooking() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setDone(false);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setDone(true);
  }

  return (
    <section className='relative py-10 sm:py-14'>
      <div className='mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8'>
        {/* Left */}
        <div className='lg:col-span-7'>
          <div className='inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70 shadow-sm'>
            <span className='h-1.5 w-1.5 rounded-full bg-[#AF9046]' />
            Premium care • Booking-first
          </div>

          <h1 className='mt-5 font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl'>
            A Brighter Smile, <span className='text-[#AF9046]'>Crafted</span>{" "}
            with Care
          </h1>

          <p className='mt-4 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base md:text-lg'>
            Book in minutes. Our team will confirm your schedule and guide you
            every step.
          </p>

          <div className='mt-5 flex flex-wrap items-center gap-2 text-xs text-black/70 sm:gap-3 sm:text-sm'>
            <span className='rounded-full border border-black/10 bg-white px-3 py-1.5 shadow-sm'>
              ★ 4.9 rating
            </span>
            <span className='rounded-full border border-black/10 bg-white px-3 py-1.5 shadow-sm'>
              120+ reviews
            </span>
            <span className='rounded-full border border-black/10 bg-white px-3 py-1.5 shadow-sm'>
              Open Today
            </span>
          </div>

          <div className='mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3'>
            {[
              {
                t: "Fast booking",
                d: "Simple form, quick confirmation.",
                Icon: CalendarCheck,
              },
              {
                t: "Premium feel",
                d: "Clean, calm clinic experience.",
                Icon: Sparkles,
              },
              {
                t: "Clear guidance",
                d: "Friendly support and options.",
                Icon: ShieldCheck,
              },
            ].map((x) => (
              <div
                key={x.t}
                className='rounded-2xl border border-black/10 bg-white p-4 shadow-sm'
              >
                <div className='flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-[#FAF7F1]'>
                  <x.Icon className='h-4 w-4 text-[#AF9046]' />
                </div>
                <p className='mt-3 font-medium leading-snug'>{x.t}</p>
                <p className='mt-1 text-sm leading-relaxed text-black/60'>
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Booking Card */}
        <div className='lg:col-span-5'>
          <div id='book' className='lg:sticky lg:top-24'>
            <Card className='rounded-3xl border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.10)]'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg tracking-tight sm:text-xl'>
                  Book an Appointment
                </CardTitle>
                <div className='mt-2 h-px w-20 bg-[#AF9046]/70' />
              </CardHeader>

              <CardContent>
                <form onSubmit={onSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    <Input id='name' placeholder='Juan Dela Cruz' required />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='mobile'>Mobile Number</Label>
                    <Input
                      id='mobile'
                      placeholder='09xx xxx xxxx'
                      inputMode='tel'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='date'>Preferred Date</Label>
                      <Input id='date' type='date' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='time'>Preferred Time</Label>
                      <Input id='time' type='time' />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='service'>Service</Label>
                    <select
                      id='service'
                      defaultValue='Consultation'
                      className='h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-[#E0C878]/50'
                    >
                      <option>Consultation</option>
                      <option>Cleaning</option>
                      <option>Fillings</option>
                      <option>Whitening</option>
                      <option>Braces</option>
                      <option>Root Canal</option>
                    </select>
                  </div>

                  <Button
                    type='submit'
                    className='h-12 w-full rounded-2xl bg-[#AF9046] text-white hover:bg-[#9C813E]'
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Book Appointment"}
                  </Button>

                  <p className='text-xs leading-relaxed text-black/60'>
                    We’ll confirm your schedule within the day.
                  </p>

                  {done && (
                    <div className='rounded-2xl border border-[#E0C878]/40 bg-[#FAF7F1] p-3 text-sm leading-relaxed text-black/70'>
                      ✅ Thanks! We’ll contact you to confirm your appointment.
                    </div>
                  )}

                  <div className='pt-2 text-sm'>
                    <a
                      href='tel:+639000000000'
                      className='inline-flex items-center gap-2 text-[#AF9046] underline-offset-4 hover:underline italic'
                    >
                      <Phone className='h-4 w-4' />
                      For urgent concerns! Call us directly
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* subtle background accent */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute left-1/2 -top-24 h-88 w-88 -translate-x-1/2 rounded-full bg-[#E0C878]/20 blur-3xl sm:-top-28 sm:h-112 sm:w-md' />
      </div>
    </section>
  );
}
