import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Print History | VIHAAN ID PRINT",
};

export default async function PrintHistoryPage() {
  const jobs = await prisma.printJob.findMany({
    orderBy: { queuedAt: "desc" },
    include: {
      school: true,
      template: true,
      user: true,
    },
    take: 50
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Print History</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            Log of all PDF compilations and print batches.
          </p>
        </div>
        <Link href="/dashboard/print">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md h-11 px-6">
            New Print Job
          </Button>
        </Link>
      </div>
      
      <div className="border border-slate-100 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600">School</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Template</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Layout</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Cards</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Copies</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No print history found.
                </td>
              </tr>
            ) : jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{job.id.slice(-8)}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{job.school.schoolName}</td>
                <td className="px-6 py-4 text-slate-600">{job.template.name}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">
                    {job.layout.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-emerald-600 font-medium">{job.totalCards}</td>
                <td className="px-6 py-4 text-slate-600">{job.copies}</td>
                <td className="px-6 py-4 text-slate-500">
                  {formatDistanceToNow(new Date(job.queuedAt!), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
