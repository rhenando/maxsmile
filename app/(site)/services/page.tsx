import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SERVICES, SERVICE_FAQS } from "./services-data";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

export const metadata = {
  title: "Services | MaxSmile Dental Clinic",
  description: "Explore MaxSmile Dental Clinic services and learn more.",
};

export default function ServicesPage() {
  return (
    <main className='min-h-svh bg-[#FAF7F1] overflow-x-hidden'>
      <section className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl'>
            Services
          </h1>

          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base'>
            Explore our dental services across all branches — gentle care,
            modern treatment, and results you can feel confident about.
          </p>
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {SERVICES.map((s) => (
            <Card
              key={s.slug}
              className='p-0 overflow-hidden rounded-3xl border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.06)]'
            >
              {/* Image */}
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
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <Card className='rounded-3xl border-black/10 bg-white'>
          <CardHeader>
            <CardTitle className='text-lg tracking-tight'>FAQs</CardTitle>
            <div className='mt-2 h-px w-14' style={{ backgroundColor: GOLD }} />
          </CardHeader>
          <CardContent className='pt-0'>
            <Accordion type='single' collapsible className='w-full'>
              {SERVICE_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className='text-left text-sm text-black'>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className='text-sm text-black/70'>
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
