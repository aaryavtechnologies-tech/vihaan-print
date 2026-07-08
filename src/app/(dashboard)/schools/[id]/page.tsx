import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SchoolProfile } from "@/components/schools/school-profile";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const school = await prisma.school.findUnique({
    where: { id: params.id },
  });

  if (!school) return { title: "School Not Found | VIHAAN ID PRINT" };

  return {
    title: `${school.schoolName} | VIHAAN ID PRINT`,
    description: `Profile and statistics for ${school.schoolName}`,
  };
}

export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
  const school = await prisma.school.findUnique({
    where: { id: params.id },
  });

  if (!school) {
    notFound();
  }

  return (
    <div className="mx-auto">
      <SchoolProfile school={school} />
    </div>
  );
}
