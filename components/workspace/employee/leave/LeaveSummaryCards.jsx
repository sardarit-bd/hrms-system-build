"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

export default function LeaveSummaryCards({ leaveRequests }) {
  const totalLeaves = leaveRequests.length;
  const pendingLeaves = leaveRequests.filter(
    (l) => l.status === "pending_pm" || l.status === "pending_gm"
  ).length;
  const approvedLeaves = leaveRequests.filter((l) => l.status === "approved").length;
  const rejectedLeaves = leaveRequests.filter((l) => l.status === "rejected").length;
  
  const totalDaysUsed = leaveRequests
    .filter((l) => l.status === "approved")
    .reduce((sum, l) => sum + (l.total_days || 0), 0);

  const stats = [
    {
      title: "Total Requests",
      value: totalLeaves,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Pending",
      value: pendingLeaves,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      title: "Approved",
      value: approvedLeaves,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Days Used",
      value: totalDaysUsed,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
  ];

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