import { getTemplates } from "@/features/template-editor/server/template-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate, Edit, Settings2, Trash2, Copy } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Templates | VIHAAN ID PRINT",
};

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">ID Card Templates</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            View available ID card templates for your schools.
          </p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-2xl bg-white border-dashed shadow-sm">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <LayoutTemplate className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No templates available</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            There are currently no active templates in the system. Please contact the administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="group overflow-hidden flex flex-col transition-all duration-300 border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl bg-white hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center relative border-b border-slate-100 overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                ) : (
                  <LayoutTemplate className="h-16 w-16 text-slate-300" />
                )}
                
                {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" asChild className="shadow-md">
                    <Link href={`/dashboard/templates/${template.id}`}>
                      <LayoutTemplate className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
                
                <div className="absolute top-3 right-3">
                  <Badge variant={template.status === "PUBLISHED" ? "default" : "secondary"} className="shadow-sm">
                    ACTIVE
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3 flex-none">
                <CardTitle className="line-clamp-1 text-lg">{template.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {template.school?.schoolName || "Global Template"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4 text-xs text-muted-foreground flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span>Version {template.currentVersion?.version || 1}</span>
                  <span>{template.orientation === "portrait" ? "Portrait" : "Landscape"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Updated</span>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex gap-2 border-t bg-slate-50/50 px-4 py-3">
                <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600 font-medium" disabled>
                  <LayoutTemplate className="h-3.5 w-3.5 mr-1.5" />
                  Active Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
