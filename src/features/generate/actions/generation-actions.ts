"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GenerationStatus, CardStatus } from "@prisma/client";

export async function createGenerationJob(schoolId: string, totalRecords: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");

    const job = await prisma.generationJob.create({
      data: {
        schoolId,
        userId: session.user.id,
        totalRecords,
        status: "PROCESSING",
        startedAt: new Date(),
      }
    });

    return { success: true, jobId: job.id };
  } catch (error: any) {
    console.error("Failed to create generation job:", error);
    return { success: false, error: error.message };
  }
}

export async function completeGenerationJob(jobId: string, status: GenerationStatus) {
  try {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status,
        completedAt: new Date()
      }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveGeneratedCardsChunk(jobId: string, cards: any[]) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");

    let successCount = 0;
    let failCount = 0;

    for (const card of cards) {
      try {
        // Upload Front to Cloudinary
        const frontUpload = await cloudinary.uploader.upload(card.frontDataUrl, {
          folder: `vihaan/schools/${card.schoolId}/generated_cards`,
          format: 'png',
        });

        // Upload Back to Cloudinary
        let backUrl = null;
        if (card.backDataUrl) {
          const backUpload = await cloudinary.uploader.upload(card.backDataUrl, {
            folder: `vihaan/schools/${card.schoolId}/generated_cards`,
            format: 'png',
          });
          backUrl = backUpload.secure_url;
        }

        // Upsert into DB (to prevent multiple active cards for same student+template)
        await prisma.generatedCard.upsert({
          where: {
            studentId_templateId: {
              studentId: card.studentId,
              templateId: card.templateId,
            }
          },
          update: {
            frontImage: frontUpload.secure_url,
            backImage: backUrl,
            thumbnail: frontUpload.secure_url,
            generatedAt: new Date(),
            generatedBy: session.user.id,
            status: "GENERATED"
          },
          create: {
            studentId: card.studentId,
            schoolId: card.schoolId,
            templateId: card.templateId,
            frontImage: frontUpload.secure_url,
            backImage: backUrl,
            thumbnail: frontUpload.secure_url,
            generatedBy: session.user.id,
            status: "GENERATED"
          }
        });

        // Update student status to ACTIVE if it was pending
        await prisma.student.update({
          where: { id: card.studentId },
          data: { status: "ACTIVE" }
        });

        successCount++;
      } catch (err) {
        console.error(`Failed to save card for student ${card.studentId}:`, err);
        failCount++;
      }
    }

    // Update job progress
    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        completedCount: { increment: successCount },
        failedCount: { increment: failCount },
      }
    });

    return { success: true, successCount, failCount };
  } catch (error: any) {
    console.error("Failed to save generated cards chunk:", error);
    return { success: false, error: error.message };
  }
}
