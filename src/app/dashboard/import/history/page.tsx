import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Import History | VIHAAN ID PRINT",
};

export default async function ImportHistoryPage() {
  const jobs = await prisma.importJob.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      school: true,
      user: true,
    },
    take: 50
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Import History</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            View the status and logs of your recent bulk imports.
          </p>
        </div>
      </div>
      
      <div className="border border-slate-100 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">File Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600">School</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Imported</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Failed</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No import history found.
                </td>
              </tr>
            ) : jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">{job.fileName || "N/A"}</td>
                <td className="px-6 py-4 text-slate-600">{job.school.schoolName}</td>
                <td className="px-6 py-4">
                  <Badge variant={
                    job.status === "COMPLETED" ? "default" :
                    job.status === "FAILED" ? "destructive" : "secondary"
                  }>
                    {job.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-emerald-600 font-medium">{job.importedCount}</td>
                <td className="px-6 py-4 text-red-600 font-medium">{job.failedCount}</td>
                <td className="px-6 py-4 text-slate-500">
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
