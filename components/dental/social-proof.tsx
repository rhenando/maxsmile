import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Super gentle and professional. Clean clinic and easy booking!",
    name: "M. Santos",
  },
  {
    quote: "Fast reply and smooth appointment scheduling. Highly recommended.",
    name: "J. Rivera",
  },
  {
    quote: "Premium service from start to finish. Loved the experience.",
    name: "A. Cruz",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SocialProof() {
  return (
    <section className='border-y border-black/10 bg-white/60 py-10 sm:py-14'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm text-black/60'>Trusted by patients</p>
            <h2 className='mt-1 font-serif text-2xl tracking-tight sm:text-3xl'>
              Rated highly for comfort & care
            </h2>
          </div>

          <div className='w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm sm:w-auto'>
            <span className='text-[#AF9046]'>★</span> 4.9 • 120+ reviews
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className='h-full rounded-3xl border-black/10 bg-white shadow-sm'
            >
              <CardContent className='flex h-full flex-col p-5 sm:p-6'>
                <p className='text-sm leading-relaxed text-black/70 sm:text-base'>
                  “{t.quote}”
                </p>

                <div className='mt-5 flex items-center gap-3'>
                  <Avatar className='h-10 w-10 shrink-0 border border-[#AF9046]/40'>
                    <AvatarFallback className='bg-[#FAF7F1] text-xs font-medium text-[#AF9046]'>
                      {initials(t.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0 leading-tight'>
                    <p className='truncate text-sm font-medium'>{t.name}</p>
                    <p className='text-xs text-black/50'>Verified patient</p>
                  </div>
                </div>

                <div className='mt-4 h-px w-14 bg-[#AF9046]/60' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
