// app/services/services-data.ts

import { SERVICES as SERVICE_OPTIONS } from "@/lib/services";
import type { ServiceValue } from "@/lib/services";

export type ServiceItem = {
  slug: ServiceValue;
  title: string;
  duration: string;
  desc: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  whatToExpect?: string[];
};

const PPE_NOTE =
  "Note: Additional ₱150 disposable PPE fee may apply (for your safety).";

const SERVICE_DETAILS: Record<
  ServiceValue,
  Omit<ServiceItem, "slug" | "title">
> = {
  braces: {
    duration: "45–60 mins",
    desc: "Low down payment braces packages with freebies included.",
    bullets: [
      "Down payment starts at ₱4,000",
      "Monthly adjustment starts at ₱1,000",
      "Freebies included (pasta, bunot, cleaning, ortho kit)",
    ],
    whatToExpect: [
      "Metal Braces: DP ₱4,000 • Monthly Adjustment ₱1,000 • Freebies: 1 pasta, 1 bunot, 1 cleaning session, ortho kit.",
      "Ceramic Braces: DP ₱8,000 • Monthly Adjustment ₱1,500 • Freebies: 1 pasta, 1 bunot, 1 cleaning session.",
      "Sapphire Braces: DP ₱12,000 • Monthly Adjustment ₱2,000 • Freebies: 1 pasta, 1 bunot, 1 cleaning session.",
      "Self-ligating: DP ₱20,000 • Adjustment ₱3,000 (every 2–3 months) • Freebies: 1 pasta, 1 bunot, 1 cleaning session.",
      "Note: X-ray not included.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/braces.jpg",
    imageAlt: "Braces service",
  },

  dentures_pustiso: {
    duration: "60–90 mins",
    desc: "Partial and complete dentures with material options for your comfort and fit.",
    bullets: [
      "Partial denture starts at ₱3,000 (1–3 units)",
      "Complete denture starts at ₱6,500 per arch",
      "Options: Plastic, Flexite/Metal Cast, Ivocap",
    ],
    whatToExpect: [
      "Partial Denture (Plastic/Ordinary): 1–3 units/tooth — ₱3,000",
      "Partial Denture (Flexite or Metal Cast): 1–3 units/tooth — ₱8,000 • 3–6 units/tooth — ₱10,000 • 6–10 units/tooth — ₱13,000",
      "Partial Denture (Ivocap): 1–3 units/tooth — ₱8,000 • 3–6 units/tooth — ₱12,000 • 6–10 units/tooth — ₱15,000",
      "Complete Denture (Plastic/Ordinary): ₱6,500 per arch",
      "Complete Denture (Flexite or Metal Cast): ₱15,000 per arch",
      "Complete Denture (Ivocap): ₱17,000 per arch",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/dentures.jpg",
    imageAlt: "Dentures service",
  },

  fixed_bridge: {
    duration: "60–90 mins",
    desc: "Fixed bridge options available in different materials depending on your needs and budget.",
    bullets: [
      "Starts at ₱3,500 per tooth/unit",
      "Options: PFM, Tilite, Ceramage, Emax, Zirconia",
      "Price varies by material",
    ],
    whatToExpect: [
      "Porcelain fused to metal (PFM): ₱3,500 per tooth/unit (reg. ₱5,000)",
      "Tilite: ₱6,500 per tooth/unit (from ₱10,000)",
      "Ceramage: ₱8,000 per tooth/unit (from ₱12,000)",
      "Emax: ₱12,000 per tooth/unit (from ₱20,000)",
      "Zirconia: ₱13,000 per tooth/unit (from ₱25,000)",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/bridge.jpg",
    imageAlt: "Fixed bridge service",
  },

  implants: {
    duration: "90+ mins",
    desc: "All-in implant package with complete components included (assessment required).",
    bullets: [
      "All-in package: ₱150,000–₱180,000",
      "Includes implant + abutment + crown",
      "May include bone grafting/sinus lifting as needed",
    ],
    whatToExpect: [
      "Implant package range: ₱150,000–₱180,000 (ALL IN).",
      "Includes: Implant, Abutment, Crown, Bone Grafting, Sinus Lifting (as needed).",
      "We’ll evaluate your case first and guide you on the best treatment plan.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/implants1.jpg",
    imageAlt: "Dental implants service",
  },

  jacket_crown: {
    duration: "60–90 mins",
    desc: "Crown options available in multiple materials to restore strength and appearance.",
    bullets: [
      "Starts at ₱3,500 per tooth/unit",
      "Options: PFM, Tilite, Ceramage, Emax, Zirconia",
      "Price varies by material",
    ],
    whatToExpect: [
      "Porcelain fused to metal (PFM): ₱3,500 per tooth/unit (reg. ₱5,000)",
      "Tilite: ₱6,500 per tooth/unit (from ₱10,000)",
      "Ceramage: ₱8,000 per tooth/unit (from ₱12,000)",
      "Emax: ₱12,000 per tooth/unit (from ₱20,000)",
      "Zirconia: ₱13,000 per tooth/unit (from ₱25,000)",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/crown.jpg",
    imageAlt: "Jacket crown service",
  },

  laser_gum_contouring: {
    duration: "30–60 mins",
    desc: "Laser gum contouring for a cleaner, more balanced gum line and smile.",
    bullets: ["₱1,500 per unit", "₱10,000 per arch", "Precise laser shaping"],
    whatToExpect: [
      "Rate: ₱1,500 per unit",
      "Rate: ₱10,000 per arch",
      "We’ll assess your gum line first, then proceed with precise contouring.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/contouring.jpg",
    imageAlt: "Laser gum contouring service",
  },

  oral_prophylaxis_cleaning: {
    duration: "45 mins",
    desc: "Professional oral prophylaxis (cleaning) to remove plaque and keep gums healthy.",
    bullets: ["Minimum price ₱500", "Scaling + polishing", "After-care tips"],
    whatToExpect: [
      "Minimum price: ₱500",
      "We’ll do an oral assessment, then proceed with scaling and polishing.",
      "You’ll get after-care tips to keep your smile fresh longer.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/cleaning.jpg",
    imageAlt: "Oral prophylaxis (cleaning) service",
  },

  panoramic_x_ray: {
    duration: "10–15 mins",
    desc: "Panoramic X-ray for a full-mouth view of teeth and jaw (available in Pateros branch only).",
    bullets: ["₱1,000", "Full-mouth X-ray scan", "Pateros branch only"],
    whatToExpect: [
      "Rate: ₱1,000",
      "Availability: Pateros branch only.",
      "We’ll guide you through a quick scan and explain the results after.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/panoramic.jpg",
    imageAlt: "Panoramic X-ray service",
  },

  periapical_x_ray: {
    duration: "10–15 mins",
    desc: "Focused X-ray for a specific tooth/root area to help guide treatment decisions.",
    bullets: ["₱700 per shot", "₱1,000 unli X-ray", "Targeted diagnostic scan"],
    whatToExpect: [
      "Rate: ₱700 per shot",
      "Unli X-ray option: ₱1,000",
      "We’ll take a targeted scan and your dentist will explain the findings.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/periapical1.jpg",
    imageAlt: "Periapical X-ray service",
  },

  retainers: {
    duration: "30–45 mins",
    desc: "Retainers to help maintain alignment after braces or orthodontic correction.",
    bullets: [
      "Metal: ₱5,000 (up & down)",
      "Clear: ₱10,000 (up & down)",
      "Care + wear guidance",
    ],
    whatToExpect: [
      "Metal Retainers: ₱5,000 up & down",
      "Clear Retainers: ₱10,000 up & down",
      "We’ll guide you on proper wear schedule and cleaning to keep it hygienic.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/retainers.jpg",
    imageAlt: "Retainers service",
  },

  root_canal_treatment: {
    duration: "60–120 mins",
    desc: "Root canal treatment to relieve pain and help save an infected tooth.",
    bullets: [
      "₱4,000 per canal",
      "From ₱5,000",
      "Assessment + treatment guidance",
    ],
    whatToExpect: [
      "Rate: ₱4,000 per canal (from ₱5,000)",
      "We’ll assess the tooth (X-ray may be required) and explain the full plan.",
      "Treatment includes cleaning, disinfection, and sealing of the canal.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/canal.jpg",
    imageAlt: "Root canal treatment service",
  },

  surgery: {
    duration: "60–120 mins",
    desc: "Dental surgery services including wisdom tooth removal (case assessment required).",
    bullets: [
      "₱3,000 minimum (wisdom tooth removal)",
      "₱8,000–₱10,000 (impacted wisdom tooth surgery)",
      "After-care + follow-up guidance",
    ],
    whatToExpect: [
      "Wisdom tooth removal: ₱3,000 minimum",
      "Impacted wisdom tooth surgery: ₱8,000–₱10,000",
      "We’ll assess complexity first, then explain steps, recovery, and after-care.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/surgery.jpg",
    imageAlt: "Dental surgery service",
  },

  teeth_whitening: {
    duration: "60 mins",
    desc: "Professional whitening cycles to safely brighten your smile.",
    bullets: [
      "1 cycle ₱2,500",
      "2 cycles ₱5,000",
      "3 cycles ₱7,000 (15 mins/cycle)",
    ],
    whatToExpect: [
      "1 Cycle — ₱2,500",
      "2 Cycles — ₱5,000",
      "3 Cycles — ₱7,000",
      "Timing: 15 minutes per cycle",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/whitening.jpg",
    imageAlt: "Teeth whitening service",
  },

  tooth_extraction_bunot: {
    duration: "30–60 mins",
    desc: "Safe tooth extraction with proper after-care instructions.",
    bullets: ["Minimum price ₱500", "Assessment first", "After-care guidance"],
    whatToExpect: [
      "Minimum price: ₱500",
      "We’ll assess the tooth first and explain what to expect before extraction.",
      "You’ll receive after-care instructions to support healing.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/extraction.jpg",
    imageAlt: "Tooth extraction service",
  },

  tooth_restoration_pasta: {
    duration: "45–60 mins",
    desc: "Tooth restoration (pasta) to repair cavities and restore function comfortably.",
    bullets: [
      "Minimum price ₱500",
      "Tooth restoration",
      "Bite check + finishing",
    ],
    whatToExpect: [
      "Minimum price: ₱500",
      "We’ll remove decay (if present) then restore the tooth shape and strength.",
      "Final bite check for comfort when chewing.",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/restoration.jpg",
    imageAlt: "Tooth restoration (pasta) service",
  },

  veneers: {
    duration: "60–90 mins",
    desc: "Veneers to enhance smile shape and color—direct and indirect options available.",
    bullets: [
      "Direct veneers: ₱3,500 per tooth",
      "Indirect: Ceramage ₱8,000 • Emax ₱12,000 • Zirconia ₱13,000",
      "Price depends on veneer type",
    ],
    whatToExpect: [
      "Direct Veneers: ₱3,500 per tooth (from ₱7,000)",
      "Indirect Veneers (Ceramage): ₱8,000 per tooth (from ₱12,000)",
      "Indirect Veneers (Emax): ₱12,000 per tooth (from ₱20,000)",
      "Indirect Veneers (Zirconia): ₱13,000 per tooth (from ₱25,000)",
      PPE_NOTE,
    ],
    imageSrc: "/images/services/veneers.jpg",
    imageAlt: "Veneers service",
  },
};

export const SERVICES: ServiceItem[] = SERVICE_OPTIONS.map(
  ({ value, label }) => ({
    slug: value,
    title: label,
    ...SERVICE_DETAILS[value],
  }),
);

export const SERVICE_FAQS = [
  {
    q: "Do I need to choose a time slot?",
    a: "No. Booking is first come, first served. Your booking is recorded the moment you submit.",
  },
  {
    q: "What if I’m unable to come?",
    a: "If you’re unable to come, your slot may be released to other patients.",
  },
  {
    q: "Can I book for someone else?",
    a: "Yes. Use their full name and mobile number so we can contact the right person if needed.",
  },
];
