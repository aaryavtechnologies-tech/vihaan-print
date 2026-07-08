import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <MobileDrawer />
      <div className="flex flex-col w-full flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
