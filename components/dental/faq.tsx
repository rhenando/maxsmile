import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do you accept walk-ins?",
    a: "Some slots may be available, but booking ahead is recommended for faster service.",
  },
  {
    q: "How much is consultation?",
    a: "Consultation fees vary depending on the case. Book a visit and we’ll confirm details.",
  },
  {
    q: "Do you accept HMO?",
    a: "If applicable, list HMOs accepted here. You can also confirm during booking.",
  },
  {
    q: "How do I reschedule?",
    a: "Reply to our confirmation message or contact the clinic to adjust your schedule.",
  },
  {
    q: "How soon can I get an appointment?",
    a: "Often same-week availability depending on the service. Submit the form and we’ll confirm.",
  },
];

export default function Faq() {
  return (
    <section id='faq' className='py-10 sm:py-14'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
        <p className='text-sm text-black/60'>FAQ</p>

        <h2 className='mt-1 font-serif text-2xl tracking-tight sm:text-3xl'>
          Quick answers before you book
        </h2>

        <div className='mt-6 rounded-[28px] border border-black/10 bg-white p-2 shadow-sm sm:p-3 md:p-4'>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((f, idx) => (
              <AccordionItem
                key={f.q}
                value={`item-${idx}`}
                className='border-black/10'
              >
                <AccordionTrigger className='px-4 py-4 text-left text-sm sm:text-base'>
                  <span className='pr-2 leading-snug'>{f.q}</span>
                </AccordionTrigger>

                <AccordionContent className='px-4 pb-4 text-sm leading-relaxed text-black/70 sm:text-base'>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
