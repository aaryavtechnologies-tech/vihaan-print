import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  iconColorClass?: string;
}

interface ActivityTimelineProps {
  title?: string;
  activities: Activity[];
}

export function ActivityTimeline({ title = "Recent Activity", activities }: ActivityTimelineProps) {
  return (
    <Card className="h-full border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl bg-white overflow-hidden">
      <CardHeader className="border-b border-slate-100/50 bg-slate-50/30 px-6 py-5">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex">
                <div className="flex flex-col items-center mr-4 relative">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ring-4 ring-slate-50 bg-white shadow-sm ${activity.iconColorClass || "text-blue-600"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {index !== activities.length - 1 && (
                    <div className="w-px h-full bg-slate-100 mt-2" />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <p className="text-sm font-semibold text-slate-900 leading-none mb-1.5">{activity.title}</p>
                  <p className="text-sm text-slate-500 font-medium mb-1">{activity.description}</p>
                  <span className="text-xs text-slate-400 font-medium">{activity.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
