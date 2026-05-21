"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, CheckCircle, XCircle, Calendar, TrendingUp } from "lucide-react";

export default function ProjectStatusCard({ projects }) {
  // Calculate statistics from real projects data
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter(p => p.status === "ongoing").length;
  const deliveredProjects = projects.filter(p => p.status === "delivered").length;
  const cancelledProjects = projects.filter(p => p.status === "cancelled").length;
  
  // Calculate overdue projects (deadline passed but still ongoing)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueProjects = projects.filter(p => {
    if (p.status !== "ongoing") return false;
    const deadline = new Date(p.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  }).length;
  
  // Calculate completion rate
  const completionRate = totalProjects > 0 
    ? Math.round((deliveredProjects / totalProjects) * 100) 
    : 0;
  
  // Calculate average project duration (if start_date and deadline exist)
  let totalDuration = 0;
  let projectsWithDates = 0;
  projects.forEach(project => {
    if (project.start_date && project.deadline) {
      const start = new Date(project.start_date);
      const end = new Date(project.deadline);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        totalDuration += days;
        projectsWithDates++;
      }
    }
  });
  const avgDuration = projectsWithDates > 0 ? Math.round(totalDuration / projectsWithDates) : 0;

  const statusCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: Briefcase,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      description: "All assigned projects",
    },
    {
      title: "Ongoing",
      value: ongoingProjects,
      icon: Clock,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      description: "Active projects",
    },
    {
      title: "Delivered",
      value: deliveredProjects,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      description: "Successfully completed",
    },
    {
      title: "Overdue",
      value: overdueProjects,
      icon: XCircle,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      description: "Past deadline",
    },
  ];

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp size={16} />
            Project Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Briefcase size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No project data available</p>
          <p className="text-xs text-gray-400 mt-1">Projects will appear here once assigned.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <TrendingUp size={16} />
          Project Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statusCards.map((card) => (
            <div key={card.title} className="text-center">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-2`}>
                <card.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Project Completion Rate</span>
            <span className="font-semibold text-gray-900 dark:text-white">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-gray-500">
            {deliveredProjects} out of {totalProjects} projects completed
          </p>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Cancelled Projects</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{cancelledProjects}</p>
            </div>
          </div>
          {avgDuration > 0 && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Avg. Project Duration</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{avgDuration} days</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Distribution Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {ongoingProjects > 0 && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 cursor-default">
              {ongoingProjects} Ongoing
            </Badge>
          )}
          {deliveredProjects > 0 && (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-default">
              {deliveredProjects} Delivered
            </Badge>
          )}
          {cancelledProjects > 0 && (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 cursor-default">
              {cancelledProjects} Cancelled
            </Badge>
          )}
          {overdueProjects > 0 && (
            <Badge variant="outline" className="text-red-600 border-red-600 cursor-default">
              {overdueProjects} Overdue
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}