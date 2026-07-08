import { getStudents } from "@/features/students/server/student-actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StudentListClient } from "@/components/students/student-list-client";

export const metadata = {
  title: "Students | VIHAAN ID PRINT",
};

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Students</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            Manage student records, search, filter, and generate ID cards.
          </p>
        </div>
        <Button asChild className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all font-semibold">
          <Link href="/dashboard/students/new">
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Link>
        </Button>
      </div>

      <StudentListClient students={students as any} />
    </div>
  );
}
