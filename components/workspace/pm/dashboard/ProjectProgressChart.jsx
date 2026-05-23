"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export default function ProjectProgressChart({ projects }) {
  const ongoingProjects = projects.filter(p => p.status === "ongoing");
  
  if (ongoingProjects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <TrendingUp size={16} />
          Project Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ongoingProjects.slice(0, 4).map((project) => {
          // Calculate progress based on deadline or use provided progress field
          let progress = project.progress || 0;
          if (!progress && project.start_date && project.deadline) {
            const start = new Date(project.start_date);
            const end = new Date(project.deadline);
            const today = new Date();
            const total = end - start;
            const elapsed = today - start;
            if (total > 0) {
              progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
            }
          }
          
          return (
            <div key={project.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-500">{project.client_name || "No client"}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {progress}%
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}