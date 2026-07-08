"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { schoolSchema, SchoolFormValues } from "@/validators/school";
import { SchoolStatus } from "@/types/school";

export async function createSchool(data: SchoolFormValues) {
  try {
    const validatedData = schoolSchema.parse(data);

    // Check unique constraints manually if preferred, or let Prisma throw
    const existingSchoolCode = await prisma.school.findUnique({
      where: { schoolCode: validatedData.schoolCode },
    });
    
    if (existingSchoolCode) {
      return { success: false, error: "School code is already in use." };
    }

    const existingEmail = await prisma.school.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return { success: false, error: "Email is already in use." };
    }

    const school = await prisma.school.create({
      data: validatedData,
    });

    revalidatePath("/dashboard/schools");
    return { success: true, schoolId: school.id };
  } catch (error: any) {
    console.error("Create school error:", error);
    return { success: false, error: error.message || "Failed to create school" };
  }
}

export async function updateSchool(id: string, data: SchoolFormValues) {
  try {
    const validatedData = schoolSchema.parse(data);

    // Validate existence
    const existingSchool = await prisma.school.findUnique({
      where: { id },
    });

    if (!existingSchool) {
      return { success: false, error: "School not found." };
    }

    // Check unique constraints except self
    const duplicateCode = await prisma.school.findFirst({
      where: { schoolCode: validatedData.schoolCode, id: { not: id } },
    });

    if (duplicateCode) return { success: false, error: "School code already in use." };

    const duplicateEmail = await prisma.school.findFirst({
      where: { email: validatedData.email, id: { not: id } },
    });

    if (duplicateEmail) return { success: false, error: "Email already in use." };

    await prisma.school.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/dashboard/schools");
    revalidatePath(`/dashboard/schools/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Update school error:", error);
    return { success: false, error: error.message || "Failed to update school" };
  }
}

export async function deleteSchool(id: string) {
  try {
    // Soft delete
    await prisma.school.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: SchoolStatus.INACTIVE,
      },
    });

    revalidatePath("/dashboard/schools");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to delete school" };
  }
}

export async function archiveSchool(id: string) {
  try {
    await prisma.school.update({
      where: { id },
      data: {
        status: SchoolStatus.ARCHIVED,
      },
    });

    revalidatePath("/dashboard/schools");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to archive school" };
  }
}

export async function restoreSchool(id: string) {
  try {
    await prisma.school.update({
      where: { id },
      data: {
        deletedAt: null,
        status: SchoolStatus.ACTIVE,
      },
    });

    revalidatePath("/dashboard/schools");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to restore school" };
  }
}

export async function bulkDeleteSchools(ids: string[]) {
  try {
    await prisma.school.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: new Date(),
        status: SchoolStatus.INACTIVE,
      },
    });
    revalidatePath("/dashboard/schools");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to delete schools" };
  }
}

export async function bulkArchiveSchools(ids: string[]) {
  try {
    await prisma.school.updateMany({
      where: { id: { in: ids } },
      data: {
        status: SchoolStatus.ARCHIVED,
      },
    });
    revalidatePath("/dashboard/schools");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to archive schools" };
  }
}
