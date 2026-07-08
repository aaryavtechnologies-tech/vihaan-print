import { ImportWizard } from "@/features/import/components/import-wizard";

export const metadata = {
  title: "Bulk Import | VIHAAN ID PRINT",
};

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Bulk Import</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            Import thousands of students via CSV/Excel and match them with their photos.
          </p>
        </div>
      </div>
      
      <ImportWizard />
    </div>
  );
}
