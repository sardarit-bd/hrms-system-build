"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, CalendarDays } from "lucide-react";

export default function LeaveStatsCards({ stats }) {
  const statCards = [
    {
      title: "Pending Requests",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      title: "Total Days",
      value: stats.totalDays,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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