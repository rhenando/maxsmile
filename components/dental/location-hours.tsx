import { MapPin, Phone } from "lucide-react";

import BranchHours from "@/components/dental/BranchHours";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRANCHES } from "@/lib/branches";

const GOLD_DARK = "#B19552";

export default function LocationHours() {
  const branch = BRANCHES["manila-main"];
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${branch.name} ${branch.address}`,
  )}`;

  return (
    <section
      id="location"
      className="border-y border-black/10 bg-white/60 py-10 sm:py-14"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-black/60">Location</p>
            <h2 className="mt-1 font-serif text-2xl tracking-tight sm:text-3xl">
              Visit us with ease
            </h2>
          </div>

          <Button
            asChild
            className="w-full rounded-xl bg-[#AF9046] text-white hover:bg-[#9C813E] sm:w-auto"
          >
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              Get Directions
            </a>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <Card className="rounded-2xl border-black/10 bg-white shadow-sm lg:col-span-7">
            <CardContent className="p-4 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-black/10">
                <div className="relative w-full pb-[62.5%]">
                  <iframe
                    src={branch.mapEmbedSrc}
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label="MaxSmile Dental Clinic map"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-black/10 bg-white shadow-sm lg:col-span-5">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm text-black/60">Featured Branch</p>
              <p className="mt-1 font-medium">
                MaxSmile Dental Clinic - {branch.name}
              </p>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-black/65 underline-offset-4 hover:underline"
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: GOLD_DARK }}
                />
                <span>{branch.address}</span>
              </a>

              <a
                href={`tel:${branch.phone}`}
                className="mt-3 flex items-center gap-2 text-sm text-black/65 underline-offset-4 hover:underline"
              >
                <Phone className="h-4 w-4" style={{ color: GOLD_DARK }} />
                {branch.phone}
              </a>

              <div className="mt-6">
                <BranchHours hours={branch.hours} />
              </div>

              <div className="mt-6 rounded-xl border border-[#E0C878]/40 bg-[#FAF7F1] p-4 text-sm leading-relaxed text-black/70">
                Walk-ins are welcome when available. Booking ahead helps us
                serve you faster.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
