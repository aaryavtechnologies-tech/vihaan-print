import { StudentWizard } from "@/features/students/components/student-wizard";

import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "New Student | VIHAAN ID PRINT",
};

export default async function NewStudentPage() {
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Register Student</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            Enter student details to generate their ID card.
          </p>
        </div>
      </div>

      <StudentWizard schools={schools} />
    </div>
  );
}
