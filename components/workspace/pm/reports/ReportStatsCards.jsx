"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, Users, CalendarCheck } from "lucide-react";

export default function ReportStatsCards({ stats }) {
  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Ongoing Projects",
      value: stats.ongoingProjects,
      icon: Clock,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Team Members",
      value: stats.totalTeamMembers,
      icon: Users,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Total Hours Logged",
      value: `${stats.totalHoursLogged} hrs`,
      icon: CalendarCheck,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">{stat.title}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}