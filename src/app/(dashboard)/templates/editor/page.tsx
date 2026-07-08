import { EditorLayout } from "@/features/template-editor/components/editor/editor-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Editor | VIHAAN ID PRINT",
  description: "Design and customize ID card templates.",
};

export default function TemplateEditorPage() {
  return (
    // The editor takes full screen by default, bypassing dashboard container styles if necessary
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950">
      <EditorLayout />
    </div>
  );
}
