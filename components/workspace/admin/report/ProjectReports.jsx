"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectReports({ projects, selectedStatus, selectedProject }) {
  // Apply filters
  let filteredProjects = [...projects];
  
  if (selectedStatus) {
    filteredProjects = filteredProjects.filter((p) => p.status === selectedStatus);
  }
  if (selectedProject) {
    filteredProjects = filteredProjects.filter((p) => p.id.toString() === selectedProject);
  }

  const ongoingProjects = filteredProjects.filter((p) => p.status === "ongoing").length;
  const deliveredProjects = filteredProjects.filter((p) => p.status === "delivered").length;
  const cancelledProjects = filteredProjects.filter((p) => p.status === "cancelled").length;
  const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.total_budget || 0), 0);

  // Project Manager Summary
  const pmSummary = {};
  filteredProjects.forEach((project) => {
    const pmName = project.project_manager?.full_name || "Unassigned";
    if (!pmSummary[pmName]) {
      pmSummary[pmName] = { ongoing: 0, delivered: 0, cancelled: 0, total: 0 };
    }
    pmSummary[pmName][project.status]++;
    pmSummary[pmName].total++;
  });

  const statsCards = [
    { title: "Total Projects", value: filteredProjects.length, color: "bg-blue-100 text-blue-700" },
    { title: "Ongoing", value: ongoingProjects, color: "bg-green-100 text-green-700" },
    { title: "Delivered", value: deliveredProjects, color: "bg-purple-100 text-purple-700" },
    { title: "Cancelled", value: cancelledProjects, color: "bg-red-100 text-red-700" },
    { title: "Total Budget", value: `$${totalBudget.toLocaleString()}`, color: "bg-amber-100 text-amber-700" },
  ];

  if (filteredProjects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No project data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Manager Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Project Manager Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(pmSummary).map(([pm, data]) => (
              <div key={pm} className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3 min-w-[150px]">
                  <Badge variant="secondary" className="cursor-default">
                    {pm}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {data.total} projects
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700 cursor-default">
                    Ongoing: {data.ongoing}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 cursor-default">
                    Delivered: {data.delivered}
                  </Badge>
                  <Badge className="bg-red-100 text-red-700 cursor-default">
                    Cancelled: {data.cancelled}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}