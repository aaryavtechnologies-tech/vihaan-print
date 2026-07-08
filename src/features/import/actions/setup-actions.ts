"use server";

import { prisma } from "@/lib/prisma";

export async function getSetupData() {
  const schools = await prisma.school.findMany({
    select: { id: true, schoolName: true, schoolCode: true },
    orderBy: { schoolName: "asc" }
  });

  const templates = await prisma.template.findMany({
    select: { id: true, name: true, schoolId: true },
    orderBy: { name: "asc" }
  });

  return { schools, templates };
}
