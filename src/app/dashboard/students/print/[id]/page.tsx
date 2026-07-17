import { getStudentById } from "@/features/students/server/student-actions";
import { notFound } from "next/navigation";
import { StJohnTemplatePreview } from "@/features/students/components/st-john-template-preview";
import { PrintController } from "@/features/students/components/print-controller";
import { format } from "date-fns";

export const metadata = {
  title: "Print ID Card | VIHAAN ID PRINT",
};

export default async function PrintStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  const studentData = {
    studentName: student.fullName,
    fatherName: student.fatherName || "",
    className: student.className || "",
    dob: student.dateOfBirth ? format(student.dateOfBirth, "dd/MM/yyyy") : "",
    mobile: student.studentMobile || "",
    address: student.addressLine1 || "",
    photoUrl: student.photo || "",
    schoolId: student.school.schoolCode,
  };

  return (
    <PrintController studentId={student.id}>
      <StJohnTemplatePreview data={studentData} zoom={0.32} />
    </PrintController>
  );
}
