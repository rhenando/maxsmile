// app/testimonials/page.tsx
import Link from "next/link";
import { Star, Quote, ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Brand tones
const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

export const metadata = {
  title: "Testimonials | MaxSmile Dental Clinic",
  description:
    "Read patient testimonials and reviews from MaxSmile Dental Clinic. See real experiences and book your appointment today.",
};

type Testimonial = {
  name: string;
  branch?: string;
  rating: 5 | 4 | 3 | 2 | 1;
  message: string;
  service?: string;
  date?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Angela M.",
    branch: "Manila Main",
    rating: 5,
    service: "Oral Prophylaxis",
    date: "Jan 2026",
    message:
      "Super gentle and very professional. Clean clinic, accommodating staff, and clear explanation of what will happen. I felt comfortable the whole time.",
  },
  {
    name: "John R.",
    branch: "Pateros",
    rating: 5,
    service: "Tooth Restoration",
    date: "Dec 2025",
    message:
      "Ang gaan ng kamay ng dentist. Fast and pain-free. They explained after-care properly. Highly recommended.",
  },
  {
    name: "Mika S.",
    branch: "Parañaque",
    rating: 5,
    service: "Tooth Extraction",
    date: "Nov 2025",
    message:
      "I was nervous, but they made everything easy. The team was kind and calming. Very reassuring from start to finish.",
  },
  {
    name: "Paolo D.",
    branch: "Manila Main",
    rating: 5,
    service: "Teeth Whitening",
    date: "Oct 2025",
    message:
      "Great results! They set expectations clearly and I love how my smile looks now. Worth it.",
  },
  {
    name: "Carla V.",
    branch: "Pateros",
    rating: 5,
    service: "Dentures",
    date: "Sep 2025",
    message:
      "Very patient and thorough. They adjusted everything until it fit comfortably. I can smile confidently again.",
  },
  {
    name: "Nina C.",
    branch: "Manila Main",
    rating: 5,
    service: "Consultation",
    date: "Aug 2025",
    message:
      "They explained my options without pressure. Transparent and supportive. I’m glad I chose MaxSmile.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            className='h-4 w-4'
            style={{
              color: filled ? GOLD_DARK : "#d4d4d8",
              fill: filled ? GOLD_DARK : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <main className='min-h-svh bg-[#FAF7F1] overflow-x-hidden'>
      {/* Header (match Services spacing) */}
      <section className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl'>
            Testimonials
          </h1>

          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base'>
            Real patient experiences across our branches — comfort, quality
            care, and results you can smile about.
          </p>
        </div>
      </section>

      {/* Grid (match Services grid + card style) */}
      <section className='mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {TESTIMONIALS.map((t, idx) => (
            <Card
              key={`${t.name}-${idx}`}
              className='p-0 overflow-hidden rounded-3xl border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.06)]'
            >
              <CardContent className='p-5'>
                {/* Top row: name + branch pill */}
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-base font-semibold text-black'>
                      {t.name}
                    </p>
                    <p className='mt-1 text-sm text-black/60'>
                      {t.service ?? "Dental Service"}
                      {t.date ? ` • ${t.date}` : ""}
                    </p>
                  </div>

                  <span
                    className='shrink-0 rounded-full border px-2 py-1 text-[11px] font-medium'
                    style={{ borderColor: GOLD, color: GOLD_DARK }}
                  >
                    {t.branch ?? "Patient"}
                  </span>
                </div>

                {/* Stars + quote badge */}
                <div className='mt-4 flex items-center justify-between gap-3'>
                  <Stars rating={t.rating} />

                  <div className='rounded-full border border-black/10 bg-white p-2'>
                    <Quote className='h-4 w-4' style={{ color: GOLD_DARK }} />
                  </div>
                </div>

                {/* Message */}
                <p className='mt-4 text-sm leading-relaxed text-black/70'>
                  {t.message}
                </p>

                {/* Actions (match Services button sizing/radius) */}
                <div className='mt-5 grid gap-2 sm:grid-cols-2'>
                  <Button
                    asChild
                    className='h-10 w-full rounded-2xl text-white'
                    style={{ backgroundColor: GOLD_DARK }}
                  >
                    <Link href='/book/manila-main'>Book Now</Link>
                  </Button>

                  <Button
                    asChild
                    variant='outline'
                    className='h-10 w-full rounded-2xl border-black/10 bg-white'
                  >
                    <Link href='/location'>
                      View Branches <ExternalLink className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
