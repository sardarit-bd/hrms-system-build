"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Timer, RefreshCw, Calendar, Users } from "lucide-react";

export default function RosterStatsCards({ stats }) {
  const statCards = [
    {
      title: "Total Shifts",
      value: stats.totalShifts,
      icon: Clock,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Fixed Shifts",
      value: stats.fixedShifts,
      icon: Timer,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Rotating Shifts",
      value: stats.rotatingShifts,
      icon: RefreshCw,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Total Rosters",
      value: stats.totalRosters,
      icon: Calendar,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
    {
      title: "Active Rosters",
      value: stats.activeRosters,
      icon: Users,
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
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