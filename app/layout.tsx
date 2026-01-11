import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Set this in Vercel/Env: NEXT_PUBLIC_SITE_URL=https://your-domain.com
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://example.com";

const SITE_NAME = "MaxSmile Dental Clinic";
const DEFAULT_TITLE = `${SITE_NAME} | Dentist in Manila, Philippines`;
const DESCRIPTION =
  "MaxSmile Dental Clinic in Manila, Philippines. Book a dental appointment for cleaning, consultation, fillings, whitening, and more.";

const OG_IMAGE = new URL("/og.jpg", SITE_URL); // put /public/og.jpg (1200x630 recommended)

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#B19552",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,

  alternates: {
    canonical: "/",
  },

  keywords: [
    "dental clinic Manila",
    "dentist in Manila",
    "teeth cleaning Manila",
    "oral prophylaxis Manila",
    "tooth restoration Manila",
    "dental consultation Manila",
    "whitening Manila",
    "fillings Manila",
    "book dental appointment",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_PH",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Dental Clinic in Manila`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  // Optional: add /public/site.webmanifest if you have one
  // manifest: "/site.webmanifest",

  // Optional: set in env: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxx
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: SITE_NAME,
    url: SITE_URL,
    description: DESCRIPTION,
    areaServed: "Manila, Philippines",
    // If you have these, add them for better local SEO:
    // telephone: "+63XXXXXXXXXX",
    // address: { "@type": "PostalAddress", streetAddress: "...", addressLocality: "Manila", addressCountry: "PH" },
    // openingHours: ["Mo-Sa 09:00-18:00"],
  };

  return (
    <html lang='en-PH'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Local Business JSON-LD (good for SEO) */}
        <Script
          id='ld-json-dentist'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
