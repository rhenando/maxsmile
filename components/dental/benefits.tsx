import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, Sparkles, ClipboardCheck } from "lucide-react";

const benefits = [
  {
    title: "Gentle, patient-first care",
    desc: "Comfort-forward approach with thoughtful guidance.",
    Icon: HeartHandshake,
  },
  {
    title: "Modern, clean clinic experience",
    desc: "A calm space designed for quality and ease.",
    Icon: Sparkles,
  },
  {
    title: "Clear guidance & transparent options",
    desc: "We explain steps clearly so you feel confident.",
    Icon: ClipboardCheck,
  },
];

export default function Benefits() {
  return (
    <section className='py-10 sm:py-14'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8 md:p-10'>
          <p className='text-sm text-black/60'>Why choose MaxSmile</p>

          <h2 className='mt-1 font-serif text-2xl tracking-tight sm:text-3xl'>
            Luxury feel, clinical excellence
          </h2>

          <div className='mt-3 h-px w-24 bg-[#AF9046]/60' />

          <div className='mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3'>
            {benefits.map(({ title, desc, Icon }) => (
              <Card
                key={title}
                className='h-full rounded-3xl border-black/10 bg-[#FAF7F1] shadow-none'
              >
                <CardContent className='flex h-full flex-col p-5 sm:p-6'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white'>
                    <Icon className='h-5 w-5 text-[#AF9046]' />
                  </div>

                  <p className='mt-4 font-medium leading-snug'>{title}</p>
                  <p className='mt-2 text-sm leading-relaxed text-black/60'>
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='mt-8'>
            <a
              href='#book'
              className='inline-flex w-full items-center justify-center rounded-2xl bg-[#AF9046] px-5 py-3 text-sm font-medium text-white hover:bg-[#9C813E] sm:w-auto'
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
