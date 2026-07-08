import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SchoolForm } from "@/components/schools/school-form";

export const metadata = {
  title: "Edit School | VIHAAN ID PRINT",
};

export default async function EditSchoolPage({ params }: { params: { id: string } }) {
  const school = await prisma.school.findUnique({
    where: { id: params.id },
  });

  if (!school) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <SchoolForm initialData={school} isEdit />
    </div>
  );
}
