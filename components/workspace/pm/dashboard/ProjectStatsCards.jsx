"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function ProjectStatsCards({ stats }) {
  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: Clock,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Team Members",
      value: stats.teamMembersCount,
      icon: Users,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      title: "Completed Projects",
      value: stats.completedProjects,
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: "Team Leads",
      value: stats.totalTeamLeads,
      icon: TrendingUp,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => (
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