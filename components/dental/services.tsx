import { Card, CardContent } from "@/components/ui/card";
import {
  Stethoscope,
  Sparkles,
  Wrench,
  Smile,
  AlignHorizontalDistributeCenter,
  ShieldPlus,
} from "lucide-react";

const services = [
  { name: "Consultation", Icon: Stethoscope },
  { name: "Cleaning", Icon: Sparkles },
  { name: "Fillings", Icon: Wrench },
  { name: "Whitening", Icon: Smile },
  { name: "Braces", Icon: AlignHorizontalDistributeCenter },
  { name: "Root Canal", Icon: ShieldPlus },
];

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

          <a
            href='#book'
            className='hidden text-sm text-[#AF9046] underline-offset-4 hover:underline sm:block'
          >
            Book now →
          </a>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {services.map(({ name, Icon }) => (
            <Card
              key={name}
              className='h-full rounded-3xl border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
            >
              <CardContent className='flex h-full flex-col p-5 sm:p-6'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-lg font-medium leading-snug'>{name}</p>
                    <p className='mt-1 text-sm leading-relaxed text-black/60'>
                      Book a visit and we’ll guide you.
                    </p>
                  </div>

                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-[#FAF7F1]'>
                    <Icon className='h-5 w-5 text-[#AF9046]' />
                  </div>
                </div>

                <a
                  href='#book'
                  className='mt-4 inline-flex text-sm font-medium text-[#AF9046] underline-offset-4 hover:underline'
                >
                  Book →
                </a>

                {/* mobile primary CTA */}
                <a
                  href='#book'
                  className='mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#AF9046] px-4 py-3 text-sm font-medium text-white hover:bg-[#9C813E] active:scale-[0.99] sm:hidden'
                >
                  Book Appointment
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
