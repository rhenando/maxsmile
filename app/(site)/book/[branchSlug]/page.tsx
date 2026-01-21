// app/book/[branchSlug]/page.tsx
import BookingPageClient from "@/components/dental/booking-page";
import { BRANCHES, BranchSlug } from "@/lib/branches";
import { notFound } from "next/navigation";

type Params = { branchSlug: string };

export default async function Page({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { branchSlug } = await params;

  const slug = decodeURIComponent(branchSlug).toLowerCase() as BranchSlug;

  if (!(slug in BRANCHES)) return notFound();

  return <BookingPageClient branchSlug={slug} />;
}
