// app/location/page.tsx
import Link from "next/link";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

import BranchHours from "@/components/dental/BranchHours";
import { BRANCHES, type BranchSlug, type WeeklyHours } from "@/lib/branches";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Brand tones
const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

export const metadata = {
  title: "Locations | MaxSmile Dental Clinic",
  description:
    "Find a MaxSmile Dental Clinic branch near you. View address, hours, contact details, and book an appointment instantly.",
};

function mapsLink(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

type BranchCard = {
  slug: BranchSlug;
  name: string;
  subtitle?: string;
  address: string;
  phone: string;
  hours: WeeklyHours;
  mapEmbedSrc?: string;
};

function getBranchList(): BranchCard[] {
  return (
    Object.entries(BRANCHES) as Array<
      [BranchSlug, (typeof BRANCHES)[BranchSlug]]
    >
  ).map(([slug, b]) => ({
    slug,
    name: b.name,
    subtitle: b.subtitle,
    address: b.address,
    phone: b.phone,
    hours: b.hours,
    mapEmbedSrc: b.mapEmbedSrc,
  }));
}

export default function LocationPage() {
  const branches = getBranchList();

  return (
    <main className='min-h-svh bg-[#FAF7F1] overflow-x-hidden'>
      {/* Header (match Services spacing) */}
      <section className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl'>
            Our Locations
          </h1>

          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base'>
            Choose your nearest branch to view hours, get directions, or book
            instantly.
          </p>
        </div>
      </section>

      {/* Grid (match Services grid + card style) */}
      <section className='mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {branches.map((branch) => {
            const slug = branch.slug;
            const mapQuery = `${branch.name} ${branch.address}`;

            return (
              <Card
                key={slug}
                className='p-0 overflow-hidden rounded-3xl border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.06)]'
              >
                <CardContent className='p-5'>
                  {/* Title row */}
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='text-base font-semibold text-black'>
                        {branch.name}
                      </p>

                      {branch.subtitle ? (
                        <p className='mt-1 text-sm text-black/60'>
                          {branch.subtitle}
                        </p>
                      ) : null}
                    </div>

                    <span
                      className='shrink-0 rounded-full border px-2 py-1 text-[11px] font-medium'
                      style={{ borderColor: GOLD, color: GOLD_DARK }}
                    >
                      Branch
                    </span>
                  </div>

                  {/* Address + Phone */}
                  <div className='mt-4 space-y-2'>
                    {branch.address ? (
                      <p className='flex items-start gap-2 text-sm text-black/65'>
                        <MapPin className='mt-0.5 h-4 w-4 text-black/45' />
                        <span className='leading-relaxed'>
                          {branch.address}
                        </span>
                      </p>
                    ) : null}

                    {branch.phone ? (
                      <p className='flex items-center gap-2 text-sm text-black/65'>
                        <Phone className='h-4 w-4 text-black/45' />
                        <a
                          href={`tel:${branch.phone}`}
                          className='underline underline-offset-4 hover:text-black'
                        >
                          {branch.phone}
                        </a>
                      </p>
                    ) : null}
                  </div>

                  {/* Hours */}
                  <div className='mt-5 rounded-2xl border border-black/10 bg-black/5 p-4'>
                    <div className='mb-3 flex items-center gap-2 text-sm font-medium text-black'>
                      <Clock className='h-4 w-4 text-black/70' />
                      Branch Hours
                    </div>

                    <BranchHours hours={branch.hours} />
                  </div>

                  {/* Actions */}
                  <div className='mt-5 grid gap-2 sm:grid-cols-2'>
                    <Button
                      asChild
                      className='h-10 w-full rounded-2xl text-white'
                      style={{ backgroundColor: GOLD_DARK }}
                    >
                      <Link href={`/book/${slug}`}>Book here</Link>
                    </Button>

                    <Button
                      asChild
                      variant='outline'
                      className='h-10 w-full rounded-2xl border-black/10 bg-white'
                    >
                      <a
                        href={mapsLink(mapQuery)}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Get Directions <ExternalLink className='ml-2 h-4 w-4' />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
