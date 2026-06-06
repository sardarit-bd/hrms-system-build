"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Clock } from "lucide-react";

export default function ProjectReports({ projects, projectSummaries }) {
  const getStatusColor = (status) => {
    const colors = {
      ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center">
          <p className="text-gray-500 text-sm sm:text-base">No project data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {projects.map((project) => {
        const summary = projectSummaries[project.id];
        const progress = project.progress || 0;
        
        return (
          <Card key={project.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{project.client_name || "No client"}</p>
                </div>
                <Badge className={`${getStatusColor(project.status)} text-xs sm:text-sm`}>
                  {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Budget</p>
                    <p className="text-xs sm:text-sm font-medium">
                      {project.total_budget?.toLocaleString()} {project.currency}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Deadline</p>
                    <p className="text-xs sm:text-sm font-medium">{project.deadline}</p>
                  </div>
                </div>
                {summary && (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Total Hours</p>
                        <p className="text-xs sm:text-sm font-medium">{summary.total_approved_hours || 0} hrs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Pending Hours</p>
                        <p className="text-xs sm:text-sm font-medium text-orange-600">
                          {summary.total_pending_hours || 0} hrs
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}