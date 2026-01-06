// app/services/services-data.ts
export type ServiceItem = {
  slug: string;
  title: string;
  duration: string;
  desc: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  whatToExpect?: string[];
};

export const SERVICES: ServiceItem[] = [
  {
    slug: "cleaning",
    title: "Dental Cleaning",
    duration: "45 mins",
    desc: "Gentle deep cleaning to remove plaque and keep gums healthy.",
    bullets: ["Oral assessment", "Scaling + polishing", "After-care tips"],
    whatToExpect: [
      "We’ll check your gums and overall oral health first.",
      "Gentle scaling and polishing to remove plaque and stains.",
      "We’ll share after-care tips to keep your smile fresh longer.",
    ],
    imageSrc: "/images/services/cleaning.jpg",
    imageAlt: "Dental cleaning service",
  },
  {
    slug: "consultation",
    title: "Consultation",
    duration: "30 mins",
    desc: "Quick check-up to understand your concern and next best steps.",
    bullets: ["Dental exam", "Treatment plan", "Clear cost guidance"],
    whatToExpect: [
      "We’ll listen to your concern and check the affected area.",
      "You’ll get a clear plan and recommended next steps.",
      "We’ll guide you on options that fit your goal and budget.",
    ],
    imageSrc: "/images/services/consultation1.jpg",
    imageAlt: "Dental consultation service",
  },
  {
    slug: "whitening",
    title: "Teeth Whitening",
    duration: "60 mins",
    desc: "Brighten your smile safely with professional-grade care.",
    bullets: ["Shade assessment", "Whitening session", "Post-care guidance"],
    whatToExpect: [
      "We’ll assess current shade and sensitivity considerations.",
      "Whitening session is done with professional-grade products.",
      "We’ll give care tips to help maintain your new shade.",
    ],
    imageSrc: "/images/services/whitening.jpg",
    imageAlt: "Teeth whitening service",
  },
  {
    slug: "fillings",
    title: "Fillings",
    duration: "60 mins",
    desc: "Restore teeth comfortably with durable filling options.",
    bullets: ["Cavity removal", "Tooth restoration", "Bite check"],
    whatToExpect: [
      "We’ll remove decayed portion gently and safely.",
      "We’ll restore the tooth shape for normal function.",
      "Final bite check to ensure comfort when chewing.",
    ],
    imageSrc: "/images/services/fillings.jpg",
    imageAlt: "Dental fillings service",
  },
  {
    slug: "braces",
    title: "Braces Assessment",
    duration: "45 mins",
    desc: "Explore alignment options with a personalized evaluation.",
    bullets: ["Teeth alignment review", "Options discussion", "Next steps"],
    whatToExpect: [
      "We’ll assess alignment and spacing issues.",
      "We’ll explain the best orthodontic options for you.",
      "You’ll get a clear next-step plan for treatment.",
    ],
    imageSrc: "/images/services/braces.jpg",
    imageAlt: "Braces assessment service",
  },
  {
    slug: "emergency",
    title: "Pain / Emergency Care",
    duration: "Priority",
    desc: "For urgent discomfort, we’ll assess and relieve pain ASAP.",
    bullets: ["Rapid assessment", "Immediate care plan", "Follow-up guidance"],
    whatToExpect: [
      "We’ll prioritize pain relief and urgent evaluation.",
      "Immediate plan for treatment and next steps.",
      "Clear instructions for after-care and follow-up.",
    ],
    imageSrc: "/images/services/emergency.jpg",
    imageAlt: "Emergency dental care",
  },
];

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
