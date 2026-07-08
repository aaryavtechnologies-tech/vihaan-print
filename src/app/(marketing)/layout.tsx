import { PublicNavbar } from "@/components/marketing/public-navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
