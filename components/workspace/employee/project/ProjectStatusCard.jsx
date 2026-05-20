"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ProjectStatusCard({ projects }) {
  const ongoingProjects = projects.filter(p => p.status === "ongoing").length;
  const deliveredProjects = projects.filter(p => p.status === "delivered").length;
  const cancelledProjects = projects.filter(p => p.status === "cancelled").length;
  const overdueProjects = projects.filter(p => p.is_overdue || (new Date(p.deadline) < new Date() && p.status === "ongoing")).length;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: Briefcase,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Ongoing",
      value: ongoingProjects,
      icon: Clock,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Delivered",
      value: deliveredProjects,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Overdue",
      value: overdueProjects,
      icon: AlertCircle,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}