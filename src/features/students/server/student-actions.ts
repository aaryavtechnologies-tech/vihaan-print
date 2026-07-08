"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { StudentStatus } from "@prisma/client";

export async function getStudents(schoolId?: string) {
  try {
    const students = await prisma.student.findMany({
      where: schoolId ? { schoolId } : undefined,
      include: {
        school: { select: { schoolName: true, schoolCode: true } },
        template: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return students;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return [];
  }
}

export async function getStudentById(id: string) {
  try {
    return await prisma.student.findUnique({
      where: { id },
      include: {
        school: true,
        template: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch student:", error);
    return null;
  }
}

export async function createStudent(data: any) {
  try {
    // Generate full name automatically
    const fullNameParts = [data.firstName, data.middleName, data.lastName].filter(Boolean);
    const fullName = fullNameParts.join(" ").trim().toUpperCase();

    let finalSchoolId = data.schoolId;

    if (!finalSchoolId) {
      // Find default school if not provided (for public form)
      let defaultSchool = await prisma.school.findFirst({
        orderBy: { createdAt: 'asc' }
      });
      
      if (!defaultSchool) {
        // Create a default school if none exists
        defaultSchool = await prisma.school.create({
          data: {
            schoolName: "Vihaan Global School",
            schoolCode: "VGS",
            email: "admin@vihaanprint.com",
            phone: "0000000000",
            addressLine1: "Head Office",
            city: "Default City",
            state: "Default State",
            postalCode: "000000"
          }
        });
      }
      
      finalSchoolId = defaultSchool.id;
    }

    // Generate a studentId if not provided (for public form)
    const finalStudentId = data.studentId && data.studentId.trim() !== "" 
      ? data.studentId 
      : `PUB-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Check for duplicates (only if they actually provided an ID manually)
    if (data.studentId || data.admissionNo) {
      const existing = await prisma.student.findFirst({
        where: {
          schoolId: finalSchoolId,
          OR: [
            { studentId: data.studentId ? data.studentId : undefined },
            { admissionNo: data.admissionNo ? data.admissionNo : undefined },
          ].filter((c): c is any => c !== undefined && Object.values(c)[0] !== undefined)
        }
      });

      if (existing) {
        return { success: false, error: "A student with this ID or Admission Number already exists in the selected school." };
      }
    }

    const student = await prisma.student.create({
      data: {
        studentId: finalStudentId,
        schoolId: finalSchoolId,
        firstName: data.firstName.toUpperCase(),
        middleName: data.middleName ? data.middleName.toUpperCase() : null,
        lastName: data.lastName ? data.lastName.toUpperCase() : null,
        fullName,
        gender: data.gender,
        dateOfBirth: data.dob ? new Date(data.dob) : null,
        
        className: data.className,
        section: data.section,
        rollNo: data.rollNo,
        
        fatherName: data.fatherName ? data.fatherName.toUpperCase() : null,
        motherName: data.motherName ? data.motherName.toUpperCase() : null,
        
        studentMobile: data.mobile,
        studentEmail: data.email,
        addressLine1: data.addressLine1 ? data.addressLine1.toUpperCase() : null,
        addressLine2: data.addressLine2,
        city: data.city ? data.city.toUpperCase() : null,
        state: data.state,
        postalCode: data.pincode,
        
        photo: data.photoUrl,
        signature: data.signatureUrl,
        
        status: "PENDING"
      }
    });

    revalidatePath("/dashboard/students");
    return { success: true, studentId: student.id };
  } catch (error: any) {
    console.error("Failed to create student:", error);
    return { success: false, error: error.message || "Failed to create student" };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function bulkDeleteStudents(ids: string[]) {
  try {
    await prisma.student.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/dashboard/students");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Failed to bulk delete students:", error);
    return { success: false, error: "Failed to delete students" };
  }
}
