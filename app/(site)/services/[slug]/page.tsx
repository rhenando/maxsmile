import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICES } from "../services-data";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getService(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: "Service Not Found | MaxSmile Dental Clinic",
    };
  }

  return {
    title: `${service.title} | MaxSmile Dental Clinic`,
    description: service.desc,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  return (
    <main className='min-h-svh bg-[#FAF7F1] overflow-x-hidden'>
      <section className='mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8'>
        <div className='flex min-w-0 flex-col justify-center'>
          <Link
            href='/services'
            className='text-sm font-medium text-[#B19552] underline-offset-4 hover:underline'
          >
            Back to services
          </Link>

          <h1 className='mt-4 text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl'>
            {service.title}
          </h1>

          <div
            className='mt-5 h-1 w-20 rounded-full'
            style={{ backgroundColor: GOLD }}
          />

          <p className='mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg'>
            {service.desc}
          </p>

          <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
            <Button
              asChild
              className='h-11 rounded-2xl px-6 text-white'
              style={{ backgroundColor: GOLD_DARK }}
            >
              <Link href='/#book'>Book an appointment</Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='h-11 rounded-2xl border-black/10 bg-white px-6'
            >
              <Link href='/services'>View all services</Link>
            </Button>
          </div>
        </div>

        <div className='relative aspect-16/10 overflow-hidden rounded-3xl bg-black/5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]'>
          <Image
            src={service.imageSrc}
            alt={service.imageAlt}
            fill
            sizes='(min-width: 1024px) 45vw, 100vw'
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent' />
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='grid gap-4 lg:grid-cols-[0.8fr_1.2fr]'>
          <Card className='rounded-3xl border-black/10 bg-white'>
            <CardContent className='p-6'>
              <h2 className='text-lg font-semibold tracking-tight text-zinc-900'>
                Highlights
              </h2>
              <ul className='mt-5 space-y-3'>
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className='flex items-start gap-3 text-sm leading-relaxed text-black/70'
                  >
                    <span
                      className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full'
                      style={{ backgroundColor: GOLD_DARK }}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className='rounded-3xl border-black/10 bg-white'>
            <CardContent className='p-6'>
              <h2 className='text-lg font-semibold tracking-tight text-zinc-900'>
                What to expect
              </h2>
              <ul className='mt-5 space-y-3'>
                {(service.whatToExpect ?? service.bullets).map((item) => (
                  <li
                    key={item}
                    className='flex items-start gap-3 text-sm leading-relaxed text-black/70'
                  >
                    <span
                      className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full'
                      style={{ backgroundColor: GOLD_DARK }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
