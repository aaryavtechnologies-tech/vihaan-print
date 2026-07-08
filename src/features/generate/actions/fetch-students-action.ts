"use server";

import { prisma } from "@/lib/prisma";

export async function getFilteredStudents(filters: { schoolId: string; academicYear?: string; className?: string; section?: string }) {
  try {
    const whereClause: any = {
      schoolId: filters.schoolId,
    };

    if (filters.academicYear) whereClause.academicYear = { contains: filters.academicYear, mode: 'insensitive' };
    if (filters.className) whereClause.className = { contains: filters.className, mode: 'insensitive' };
    if (filters.section) whereClause.section = { contains: filters.section, mode: 'insensitive' };

    const students = await prisma.student.findMany({
      where: whereClause,
      select: {
        id: true,
        studentId: true,
        admissionNo: true,
        fullName: true,
        className: true,
        section: true,
        photo: true,
        status: true,
        // Include any other fields needed for template rendering
        fatherName: true,
        motherName: true,
        dateOfBirth: true,
        bloodGroup: true,
        studentMobile: true,
        addressLine1: true,
      },
      orderBy: { firstName: "asc" }
    });

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
