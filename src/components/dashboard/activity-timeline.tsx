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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex">
                <div className="flex flex-col items-center mr-4 relative">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-background ring-4 ring-muted bg-background ${activity.iconColorClass || "text-primary"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {index !== activities.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8 pt-1">
                  <p className="text-sm font-medium leading-none mb-1">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
