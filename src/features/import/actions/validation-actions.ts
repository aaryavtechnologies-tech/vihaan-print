"use server";

import { prisma } from "@/lib/prisma";
import { ImportStatus } from "@prisma/client";

export async function validateImportChunk(chunkData: any[], schoolId: string) {
  try {
    const studentIds = chunkData.map(row => row.studentId).filter(Boolean);
    const admissionNos = chunkData.map(row => row.admissionNo).filter(Boolean);

    // Fetch existing records in one query to check for duplicates
    const existingStudents = await prisma.student.findMany({
      where: {
        schoolId,
        OR: [
          { studentId: { in: studentIds } },
          { admissionNo: { in: admissionNos } }
        ]
      },
      select: { studentId: true, admissionNo: true }
    });

    const existingStudentIds = new Set(existingStudents.map(s => s.studentId));
    const existingAdmissionNos = new Set(existingStudents.map(s => s.admissionNo).filter(Boolean));

    const validatedChunk = chunkData.map((row, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Validate Required Fields
      if (!row.firstName) errors.push("First Name is required");
      if (!row.studentId) errors.push("Student ID is required");

      // Validate Duplicates in DB
      if (row.studentId && existingStudentIds.has(row.studentId)) {
        errors.push(`Student ID '${row.studentId}' already exists`);
      }
      if (row.admissionNo && existingAdmissionNos.has(row.admissionNo)) {
        errors.push(`Admission No '${row.admissionNo}' already exists`);
      }

      // Format validations
      if (row.mobile && !/^\d{10}$/.test(row.mobile.replace(/\D/g, ''))) {
        warnings.push("Mobile number format seems incorrect");
      }

      return {
        ...row,
        _status: errors.length > 0 ? "ERROR" : warnings.length > 0 ? "WARNING" : "VALID",
        _errors: errors,
        _warnings: warnings
      };
    });

    return { success: true, data: validatedChunk };
  } catch (error: any) {
    console.error("Validation error:", error);
    return { success: false, error: error.message || "Failed to validate chunk" };
  }
}
