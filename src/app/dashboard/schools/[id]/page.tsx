import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SchoolProfile } from "@/components/schools/school-profile";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const school = await prisma.school.findUnique({
    where: { id },
  });

  if (!school) return { title: "School Not Found | VIHAAN ID PRINT" };

  return {
    title: `${school.schoolName} | VIHAAN ID PRINT`,
    description: `Profile and statistics for ${school.schoolName}`,
  };
}

export default async function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const school = await prisma.school.findUnique({
    where: { id },
  });

  if (!school) {
    notFound();
  }
  
  const students = await prisma.student.findMany({
    where: { schoolId: school.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto">
      <SchoolProfile school={school} students={students} />
    </div>
  );
}
