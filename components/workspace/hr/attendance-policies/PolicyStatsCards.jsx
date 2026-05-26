"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export default function PolicyStatsCards({ stats }) {
  const statCards = [
    {
      title: "Total Policies",
      value: stats.totalPolicies,
      icon: Shield,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Active Policies",
      value: stats.activePolicies,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Inactive Policies",
      value: stats.inactivePolicies,
      icon: XCircle,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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