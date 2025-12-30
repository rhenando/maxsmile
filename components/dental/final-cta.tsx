import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className='pb-16 sm:pb-20 md:pb-24'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='rounded-[32px] border border-black/10 bg-white p-6 shadow-sm sm:p-8 md:p-12'>
          <p className='text-sm text-black/60'>Ready when you are</p>

          <h2 className='mt-2 font-serif text-2xl tracking-tight sm:text-3xl md:text-4xl'>
            Book your appointment today
          </h2>

          <p className='mt-3 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base'>
            Fill out the booking form and we’ll confirm your schedule within the
            day.
          </p>

          <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
            <Button
              asChild
              className='h-12 w-full rounded-2xl bg-[#AF9046] px-6 text-white hover:bg-[#9C813E] sm:w-auto'
            >
              <a href='#book'>Book Appointment</a>
            </Button>

            <Button
              asChild
              variant='outline'
              className='h-12 w-full rounded-2xl border-[#AF9046] text-[#AF9046] hover:bg-[#FAF7F1] sm:w-auto'
            >
              <a href='#services'>View Services</a>
            </Button>
          </div>

          <div className='mt-8 h-px w-full bg-black/10' />

          <p className='mt-4 text-xs leading-relaxed text-black/50'>
            Premium layout sample • Replace address, hours, and contact details
            per clinic.
          </p>
        </div>
      </div>
    </section>
  );
}
