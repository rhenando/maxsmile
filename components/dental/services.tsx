import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/app/(site)/services/services-data";

const GOLD_DARK = "#B19552";

export default function Services() {
  return (
    <section id='services' className='py-10 sm:py-14'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm text-black/60'>Services</p>
            <h2 className='mt-1 font-serif text-2xl tracking-tight sm:text-3xl'>
              What we can help you with
            </h2>
          </div>

          <Link
            href='/services'
            className='hidden text-sm text-[#B19552] underline-offset-4 hover:underline sm:block'
          >
            View all services →
          </Link>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {SERVICES.slice(0, 6).map((s) => (
            <Card
              key={s.slug}
              className='p-0 overflow-hidden rounded-3xl border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-md'
            >
              {/* Image header (same as /services page) */}
              <div className='group relative m-0 w-full aspect-16/10 overflow-hidden bg-black/5'>
                <Image
                  src={s.imageSrc}
                  alt={s.imageAlt}
                  fill
                  sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                  priority={false}
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0' />
              </div>

              {/* Content (same padding/typography as /services page) */}
              <CardContent className='p-5'>
                <p className='text-base font-semibold text-black'>{s.title}</p>
                <p className='mt-1 text-sm text-black/65'>{s.desc}</p>

                <ul className='mt-4 space-y-2'>
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className='flex items-start gap-2 text-sm text-black/70'
                    >
                      <span
                        className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full'
                        style={{ backgroundColor: GOLD_DARK }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className='mt-5'>
                  <Button
                    asChild
                    variant='outline'
                    className='h-10 w-full rounded-2xl border-black/10 bg-white'
                  >
                    <Link href={`/services/${s.slug}`}>Know more</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile "View all" button */}
        <div className='mt-6 sm:hidden'>
          <Button
            asChild
            variant='outline'
            className='h-11 w-full rounded-2xl border-black/10 bg-white'
          >
            <Link href='/services'>View all services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
