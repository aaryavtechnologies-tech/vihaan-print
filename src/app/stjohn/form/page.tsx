import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sparkles, GraduationCap } from "lucide-react";
import { StJohnWizard } from "@/features/students/components/st-john-wizard";

export const metadata = {
  title: "St. John ID Registration | VIHAAN ID PRINT",
};

export default async function StJohnFormPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("stjohn_auth")?.value === "true";
  const schoolId = cookieStore.get("stjohn_school_id")?.value || "STJOHN-9780";

  if (!isAuthenticated) {
    redirect("/stjohn/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-x-hidden flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic Background Elements - Light Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-100/50"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-emerald-100/40"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 mb-6 shadow-sm group cursor-default">
            <GraduationCap className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform duration-500 ease-out" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3">
            St. John Student ID Registration <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Please enter the student details accurately. The information provided here will be printed directly onto the official Smart ID Card.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white text-slate-900 rounded-[2rem] shadow-2xl shadow-blue-900/5 p-6 md:p-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-1000 delay-200 fill-mode-both ring-1 ring-slate-200/50">
          <div className="relative z-10">
            <StJohnWizard schoolId={schoolId} />
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-12 text-center text-slate-400 font-medium text-sm animate-in fade-in duration-1000 delay-500">
          <p>Protected by Enterprise Grade Security • VIHAAN ID PRINT © 2026</p>
        </div>
      </div>
    </div>
  );
}
