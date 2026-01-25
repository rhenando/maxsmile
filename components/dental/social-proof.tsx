"use client";

import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonialSlides = [
  { imageSrc: "/images/testimonials/f1.jpg", imageAlt: "Customer feedback" },
  { imageSrc: "/images/testimonials/f2.jpg", imageAlt: "Customer feedback" },
  { imageSrc: "/images/testimonials/f3.jpg", imageAlt: "Customer feedback" },
  { imageSrc: "/images/testimonials/f4.jpg", imageAlt: "Customer feedback" },
  { imageSrc: "/images/testimonials/f5.jpg", imageAlt: "Customer feedback" },
  { imageSrc: "/images/testimonials/f6.jpg", imageAlt: "Customer feedback" },
];

export default function SocialProof() {
  const autoplay = useRef(
    Autoplay({
      delay: 3000, // ✅ speed here (ms)
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  );

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

        <div className='relative mt-6'>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            className='w-full'
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            <CarouselContent className='-ml-3'>
              {testimonialSlides.map((t) => (
                <CarouselItem
                  key={t.imageSrc}
                  className='pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4'
                >
                  <div className='relative w-full aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm'>
                    <Image
                      src={t.imageSrc}
                      alt={t.imageAlt}
                      fill
                      className='object-cover object-center'
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className='hidden sm:flex -left-4 border-black/10 bg-white/90 hover:bg-white' />
            <CarouselNext className='hidden sm:flex -right-4 border-black/10 bg-white/90 hover:bg-white' />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
