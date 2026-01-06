import SiteHeader from "@/components/dental/site-header";
import SiteFooter from "@/components/dental/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
