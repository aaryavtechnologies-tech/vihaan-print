"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function uploadStudentPhoto(studentId: string, schoolId: string, fileDataUrl: string, filename: string) {
  try {
    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileDataUrl, {
      folder: `vihaan/schools/${schoolId}/students`,
      // Target aspect ratio 1.2x1.5 = 0.8 width/height, let's say 400x500
      transformation: [
        { width: 400, height: 500, crop: "fill", gravity: "face" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    // 2. Update Student Record
    const student = await prisma.student.updateMany({
      where: { schoolId, studentId },
      data: {
        photo: result.secure_url
      }
    });

    if (student.count === 0) {
      return { success: false, error: "Student not found in DB" };
    }

    // 3. Mark PhotoMapping as matched
    await prisma.photoMapping.upsert({
      where: {
        schoolId_filename: { schoolId, filename }
      },
      update: {
        studentId,
        isMatched: true
      },
      create: {
        schoolId,
        filename,
        studentId,
        isMatched: true
      }
    });

    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("Failed to upload photo:", error);
    return { success: false, error: error.message };
  }
}
