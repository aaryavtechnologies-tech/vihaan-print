import { getStudents } from "@/features/students/server/student-actions";
import { Button } from "@/components/ui/button";
import { Plus, Users, Printer } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Students | VIHAAN ID PRINT",
};

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Students</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            Manage student records and generated ID cards.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/students/new">
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Link>
        </Button>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-2xl bg-white border-dashed shadow-sm">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No students found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by adding your first student to generate an ID card.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/students/new">
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-600">Student ID</th>
                <th className="px-6 py-4 font-medium text-slate-600">Name</th>
                <th className="px-6 py-4 font-medium text-slate-600">Class</th>
                <th className="px-6 py-4 font-medium text-slate-600">School</th>
                <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                <th className="px-6 py-4 font-medium text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{student.studentId}</td>
                  <td className="px-6 py-4">{student.fullName}</td>
                  <td className="px-6 py-4">{student.className} {student.section}</td>
                  <td className="px-6 py-4 text-slate-500">{student.school.schoolName}</td>
                  <td className="px-6 py-4">
                    <Badge variant={student.status === "ACTIVE" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild variant="outline" size="sm" className="text-slate-600 hover:text-slate-900">
                      <Link href={`/dashboard/students/print/${student.id}`} target="_blank">
                        <Printer className="w-4 h-4 mr-2" /> Print Card
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
