import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="light flex min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="print:hidden h-full">
        <Sidebar />
      </div>
      <div className="print:hidden">
        <MobileDrawer />
      </div>
      <div className="flex flex-col w-full flex-1 min-w-0">
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full print:p-0 print:m-0 print:max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
