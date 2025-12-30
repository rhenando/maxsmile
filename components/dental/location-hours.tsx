import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function LocationHours() {
  const directionsUrl =
    "https://www.google.com/maps?daddr=MaxSmile%20Dental%20Clinic%20-%20Manila%20Main";

  return (
    <section
      id='location'
      className='border-y border-black/10 bg-white/60 py-10 sm:py-14'
    >
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm text-black/60'>Location</p>
            <h2 className='mt-1 font-serif text-2xl tracking-tight sm:text-3xl'>
              Visit us with ease
            </h2>
          </div>

          <Button
            asChild
            className='w-full rounded-xl bg-[#AF9046] text-white hover:bg-[#9C813E] sm:w-auto'
          >
            <a href={directionsUrl} target='_blank' rel='noreferrer'>
              Get Directions
            </a>
          </Button>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6'>
          {/* Map */}
          <Card className='lg:col-span-7 rounded-3xl border-black/10 bg-white shadow-sm'>
            <CardContent className='p-5 sm:p-6'>
              <div className='overflow-hidden rounded-2xl border border-black/10'>
                {/* responsive iframe container */}
                <div className='relative w-full pb-[62.5%]'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3494.5950113069252!2d120.99426657457226!3d14.56181427802615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9b93a9b5a3b%3A0x281be1309a897b1f!2sMaxSmile%20Dental%20Clinic%20-%20Manila%20Main!5e1!3m2!1sen!2sph!4v1767087917220!5m2!1sen!2sph'
                    className='absolute inset-0 h-full w-full'
                    style={{ border: 0 }}
                    allowFullScreen
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    aria-label='MaxSmile Dental Clinic map'
                  />
                </div>
              </div>

              <p className='mt-4 text-sm leading-relaxed text-black/60'>
                Nearby landmark? Add a short note here so first-time patients
                can find you faster.
              </p>
            </CardContent>
          </Card>

          {/* Address + Hours */}
          <Card className='lg:col-span-5 rounded-3xl border-black/10 bg-white shadow-sm'>
            <CardContent className='p-5 sm:p-6'>
              <p className='text-sm text-black/60'>Address</p>
              <p className='mt-1 font-medium'>
                MaxSmile Dental Clinic - Manila Main
              </p>
              <p className='mt-2 text-sm leading-relaxed text-black/60'>
                Add full address + landmark here.
              </p>

              <div className='mt-6'>
                <p className='text-sm text-black/60'>Clinic Hours</p>

                <div className='mt-3 overflow-hidden rounded-2xl border border-black/10 bg-[#FAF7F1] p-1 sm:p-2'>
                  <Table>
                    <TableBody>
                      {[
                        ["Mon–Fri", "9:00 AM – 6:00 PM"],
                        ["Saturday", "10:00 AM – 4:00 PM"],
                        ["Sunday", "Closed"],
                      ].map(([d, h]) => (
                        <TableRow key={d} className='border-black/10'>
                          <TableCell className='py-3 text-sm font-medium sm:text-base'>
                            {d}
                          </TableCell>
                          <TableCell className='py-3 text-right text-sm text-black/70 sm:text-base'>
                            {h}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className='mt-6 rounded-2xl border border-[#E0C878]/40 bg-white p-4 text-sm leading-relaxed text-black/70'>
                Tip: Walk-ins are welcome when available. Booking ahead helps us
                serve you faster.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
