"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEmptyTemplate(name: string) {
  try {
    const newTemplate = await prisma.template.create({
      data: {
        name,
        description: "New template design",
        status: "DRAFT",
        orientation: "portrait",
        width: 54,
        height: 86,
        dpi: 300,
        canvasWidth: 638,
        canvasHeight: 1016,
      }
    });

    const newVersion = await prisma.templateVersion.create({
      data: {
        templateId: newTemplate.id,
        version: 1,
        jsonData: { elements: [], canvasPosition: { x: 50, y: 50 }, zoomLevel: 100 },
        published: false,
        changeLog: "Initial creation",
      }
    });

    await prisma.template.update({
      where: { id: newTemplate.id },
      data: { currentVersionId: newVersion.id }
    });

    revalidatePath("/dashboard/templates");
    return { success: true, templateId: newTemplate.id };
  } catch (error) {
    console.error("Failed to create template:", error);
    throw new Error("Failed to create template");
  }
}

export async function getTemplates() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        school: {
          select: { schoolName: true }
        },
        currentVersion: {
          select: { version: true }
        }
      }
    });
    return templates;
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    throw new Error("Failed to fetch templates");
  }
}

export async function getTemplateForEditor(templateId: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        currentVersion: true
      }
    });
    
    if (!template) {
      throw new Error("Template not found");
    }
    
    return template;
  } catch (error) {
    console.error("Failed to fetch template:", error);
    throw new Error("Failed to fetch template");
  }
}

export async function saveTemplateDraft(templateId: string, jsonData: any) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { currentVersion: true }
    });

    if (!template) {
      throw new Error("Template not found");
    }

    // Determine new version number (current + 1, or 1)
    const newVersionNum = template.currentVersion ? template.currentVersion.version + 1 : 1;

    // Create a new template version
    const newVersion = await prisma.templateVersion.create({
      data: {
        templateId,
        version: newVersionNum,
        jsonData,
        published: false,
        changeLog: "Auto-saved draft",
      }
    });

    // Update template to point to the new version
    await prisma.template.update({
      where: { id: templateId },
      data: { 
        currentVersionId: newVersion.id,
        status: "DRAFT"
      }
    });

    revalidatePath("/dashboard/templates");
    return { success: true, versionId: newVersion.id };
  } catch (error) {
    console.error("Failed to save template draft:", error);
    throw new Error("Failed to save draft");
  }
}

export async function publishTemplate(templateId: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId }
    });

    if (!template || !template.currentVersionId) {
      throw new Error("Template or current version not found");
    }

    // Mark current version as published
    await prisma.templateVersion.update({
      where: { id: template.currentVersionId },
      data: { published: true }
    });

    // Update template status
    await prisma.template.update({
      where: { id: templateId },
      data: { status: "PUBLISHED" }
    });

    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (error) {
    console.error("Failed to publish template:", error);
    throw new Error("Failed to publish");
  }
}

export async function duplicateTemplate(templateId: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { currentVersion: true }
    });

    if (!template || !template.currentVersion) {
      throw new Error("Template not found or has no content");
    }

    const newTemplate = await prisma.template.create({
      data: {
        name: `${template.name} (Copy)`,
        description: template.description,
        schoolId: template.schoolId,
        status: "DRAFT",
        orientation: template.orientation,
        width: template.width,
        height: template.height,
        dpi: template.dpi,
        canvasWidth: template.canvasWidth,
        canvasHeight: template.canvasHeight,
        backgroundImage: template.backgroundImage,
      }
    });

    const newVersion = await prisma.templateVersion.create({
      data: {
        templateId: newTemplate.id,
        version: 1,
        jsonData: template.currentVersion.jsonData as any,
        published: false,
        changeLog: "Initial duplicate creation",
      }
    });

    await prisma.template.update({
      where: { id: newTemplate.id },
      data: { currentVersionId: newVersion.id }
    });

    revalidatePath("/dashboard/templates");
    return { success: true, newTemplateId: newTemplate.id };
  } catch (error) {
    console.error("Failed to duplicate template:", error);
    throw new Error("Failed to duplicate template");
  }
}

export async function getTemplateHistory(templateId: string) {
  try {
    const history = await prisma.templateVersion.findMany({
      where: { templateId },
      orderBy: { version: 'desc' }
    });
    return history;
  } catch (error) {
    console.error("Failed to fetch template history:", error);
    throw new Error("Failed to fetch history");
  }
}

export async function restoreVersion(templateId: string, versionId: string) {
  try {
    const targetVersion = await prisma.templateVersion.findUnique({
      where: { id: versionId }
    });

    if (!targetVersion || targetVersion.templateId !== templateId) {
      throw new Error("Target version not found");
    }

    // We create a new version with the old data rather than just rolling back pointers,
    // to maintain a linear history.
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { currentVersion: true }
    });

    const newVersionNum = template?.currentVersion ? template.currentVersion.version + 1 : targetVersion.version + 1;

    const newVersion = await prisma.templateVersion.create({
      data: {
        templateId,
        version: newVersionNum,
        jsonData: targetVersion.jsonData as any,
        published: false,
        changeLog: `Restored from version ${targetVersion.version}`,
      }
    });

    await prisma.template.update({
      where: { id: templateId },
      data: { 
        currentVersionId: newVersion.id,
        status: "DRAFT" 
      }
    });

    revalidatePath("/dashboard/templates");
    return { success: true, newVersionId: newVersion.id, jsonData: targetVersion.jsonData };
  } catch (error) {
    console.error("Failed to restore version:", error);
    throw new Error("Failed to restore version");
  }
}
