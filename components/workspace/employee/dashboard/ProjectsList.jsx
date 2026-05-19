"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ProjectsList({ projects }) {
  const getStatusColor = (status) => {
    const colors = {
      ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  const getTypeLabel = (type) => {
    const labels = {
      single: "Single Payment",
      milestone: "Milestone Based",
      hourly: "Hourly",
    };
    return labels[type] || type;
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Briefcase size={16} />
            My Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-4">No projects assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Briefcase size={16} />
          My Projects
        </CardTitle>
        <Link
          href="/workspace/employee/projects"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{project.client_name || "No client"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs cursor-default">
                    {getTypeLabel(project.type)}
                  </Badge>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Deadline: {project.deadline}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                Budget: {project.total_budget?.toLocaleString()} {project.currency}
              </span>
              {project.progress && (
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  Progress: {project.progress}%
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}