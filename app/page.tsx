import HeroBooking from "@/components/dental/hero-booking";
import SocialProof from "@/components/dental/social-proof";
import Services from "@/components/dental/services";
import Benefits from "@/components/dental/benefits";
import LocationHours from "@/components/dental/location-hours";
import Faq from "@/components/dental/faq";
import FinalCta from "@/components/dental/final-cta";
import MobileStickyBar from "@/components/dental/mobile-sticky-bar";

export default function DentalLandingPage() {
  return (
    <div className='min-h-screen bg-[#FAF7F1] text-[#111111]'>
      <main>
        <HeroBooking />
        <SocialProof />
        <Services />
        <Benefits />
        <LocationHours />
        <Faq />
        <FinalCta />
      </main>

      <MobileStickyBar />
    </div>
  );
}
