import { prisma } from "@/lib/prisma";
import { SchoolListClient } from "@/components/schools/school-list-client";
import { PageHeader } from "@/components/dashboard/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Schools | VIHAAN ID PRINT",
  description: "Manage all educational institutions in the system",
};

export default async function SchoolsPage() {
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Schools" 
        description="Manage educational institutions, update branding, and handle contacts."
        action={
          <Link href="/dashboard/schools/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all font-semibold rounded-xl px-5 h-10">
              <Plus className="mr-2 h-4 w-4" /> Add School
            </Button>
          </Link>
        }
      />
      
      <SchoolListClient initialSchools={schools} />
    </div>
  );
}
