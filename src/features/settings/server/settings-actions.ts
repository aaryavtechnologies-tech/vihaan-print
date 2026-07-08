"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createAdminUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Use Better Auth's admin API to create user with hashed password
    const result = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    if (!result) {
      return { success: false, error: "Failed to create user" };
    }

    // Update the role to ADMIN in DB
    await prisma.user.update({
      where: { email: data.email },
      data: { role: "ADMIN" },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create admin:", error);
    if (error?.message?.includes("already exists") || error?.code === "P2002") {
      return { success: false, error: "A user with this email already exists." };
    }
    return { success: false, error: error?.message || "Failed to create admin user" };
  }
}

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Failed to get admin users:", error);
    return [];
  }
}

export async function deleteAdminUser(userId: string) {
  try {
    // Prevent deleting super admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === "SUPER_ADMIN") {
      return { success: false, error: "Cannot delete a super admin." };
    }
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete admin user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

export async function updateSchoolBranding(
  schoolId: string,
  data: { logo?: string; principalSignature?: string }
) {
  try {
    await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.principalSignature !== undefined && {
          principalSignature: data.principalSignature,
        }),
      },
    });
    revalidatePath("/dashboard/templates");
    revalidatePath("/dashboard/schools");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update school branding:", error);
    return { success: false, error: "Failed to update branding." };
  }
}
