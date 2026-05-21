"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Briefcase, Users } from "lucide-react";

const activityIcons = {
  leave: { icon: Calendar, color: "text-orange-600 bg-orange-50" },
  hourlog: { icon: Clock, color: "text-purple-600 bg-purple-50" },
  project: { icon: Briefcase, color: "text-blue-600 bg-blue-50" },
  team: { icon: Users, color: "text-green-600 bg-green-50" },
  default: { icon: FileText, color: "text-gray-600 bg-gray-50" },
};

export default function RecentActivity({ activities }) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const activityConfig = activityIcons[activity.type] || activityIcons.default;
          const Icon = activityConfig.icon;
          
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${activityConfig.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {activity.time}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}