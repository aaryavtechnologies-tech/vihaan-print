"use server";

import { prisma } from "@/lib/prisma";

export async function getPrintableCards(filters: { schoolId: string; templateId: string | null; className?: string; section?: string }) {
  try {
    const whereClause: any = {
      schoolId: filters.schoolId,
      status: "GENERATED", // Only fetch generated cards
    };

    if (filters.templateId) whereClause.templateId = filters.templateId;

    // Filter by student class/section if needed
    const studentFilter: any = {};
    if (filters.className) studentFilter.className = filters.className;
    if (filters.section) studentFilter.section = filters.section;
    
    if (Object.keys(studentFilter).length > 0) {
      whereClause.student = { is: studentFilter };
    }

    const cards = await prisma.generatedCard.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            fullName: true,
            studentId: true,
            admissionNo: true,
            className: true,
            section: true,
          }
        },
        template: true,
      },
      orderBy: { generatedAt: "desc" }
    });

    return { success: true, data: cards };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPrintJobRecord(data: any) {
  try {
    const job = await prisma.printJob.create({
      data: {
        schoolId: data.schoolId,
        templateId: data.templateId,
        jobName: data.jobName,
        layout: data.layout,
        paperSize: data.paperSize,
        orientation: data.orientation,
        dpi: data.dpi,
        copies: data.copies,
        totalCards: data.totalCards,
        status: "COMPLETED",
        queuedAt: new Date(),
        startedAt: new Date(),
        completedAt: new Date(),
        createdBy: data.userId, // Requires user session ID
      }
    });
    
    // Update the printed cards status to PRINTED
    await prisma.generatedCard.updateMany({
      where: {
        id: { in: data.cardIds }
      },
      data: {
        status: "PRINTED"
      }
    });

    return { success: true, jobId: job.id };
  } catch (error: any) {
    console.error("Failed to create print job record:", error);
    return { success: false, error: error.message };
  }
}
