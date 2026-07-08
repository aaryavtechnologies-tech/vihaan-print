import { PrintWizard } from "@/features/print/components/print-wizard";

export const metadata = {
  title: "Print Center | VIHAAN ID PRINT",
};

export default function PrintPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Enterprise Print Center</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            Compile generated ID cards into high-resolution PDFs for A4 Sheets or PVC Printers.
          </p>
        </div>
      </div>
      
      <PrintWizard />
    </div>
  );
}
