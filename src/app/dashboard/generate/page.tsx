import { GenerationWizard } from "@/features/generate/components/generation-wizard";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Generate ID Cards | VIHAAN ID PRINT",
};

export default async function GeneratePage() {
  const activeJobs = await prisma.generationJob.count({
    where: { status: "PROCESSING" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">ID Generation Center</h1>
            {activeJobs > 0 && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 animate-pulse">
                {activeJobs} Active Jobs
              </Badge>
            )}
          </div>
          <p className="text-slate-500 font-medium mt-1.5">
            Select students, apply a template, and batch render high-quality ID cards.
          </p>
        </div>
      </div>
      
      <GenerationWizard />
    </div>
  );
}
