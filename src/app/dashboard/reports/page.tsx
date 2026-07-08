import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = {
  title: "Reports | VIHAAN ID PRINT",
};

export default function ReportsPage() {
  return (
    <ComingSoon
      module="Reports & Analytics"
      description="Get deep insights into your ID card generation, print volumes, school-wise statistics, and student data trends — all in one place."
      features={[
        "School-wise generation reports",
        "Monthly print volume charts",
        "Student status breakdown",
        "Export to PDF / Excel",
        "Date range filtering",
        "Top schools dashboard",
      ]}
    />
  );
}
