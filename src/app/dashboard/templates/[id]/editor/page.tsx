import { getTemplateForEditor } from "@/features/template-editor/server/template-actions";
import { EditorLayout } from "@/features/template-editor/components/editor/editor-layout";
import { EditorInitializer } from "./components/editor-initializer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Editor | VIHAAN ID PRINT",
  description: "Design and customize ID card templates.",
};

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const templateId = resolvedParams.id;
  
  let template;
  try {
    template = await getTemplateForEditor(templateId);
  } catch (error) {
    notFound();
  }

  return (
    // The editor takes full screen by default, bypassing dashboard container styles
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950">
      <EditorInitializer template={template} />
      <EditorLayout />
    </div>
  );
}
