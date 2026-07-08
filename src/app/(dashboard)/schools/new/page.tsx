import { SchoolForm } from "@/components/schools/school-form";

export const metadata = {
  title: "Create School | VIHAAN ID PRINT",
  description: "Add a new school to the system",
};

export default function NewSchoolPage() {
  return (
    <div className="max-w-5xl mx-auto py-6">
      <SchoolForm />
    </div>
  );
}
