"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, FileText, CheckCircle, CreditCard, TrendingDown, TrendingUp } from "lucide-react";

export default function PayrollStatsCards({ stats }) {
  const statCards = [
    {
      title: "Total Records",
      value: stats.totalRecords,
      icon: FileText,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Draft",
      value: stats.draftCount,
      icon: FileText,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      title: "Approved",
      value: stats.approvedCount,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Paid",
      value: stats.paidCount,
      icon: CreditCard,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Total Net Salary",
      value: `৳${(stats.totalNetSalary / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: "Total Deductions",
      value: `৳${(stats.totalDeductions / 1000000).toFixed(1)}M`,
      icon: TrendingDown,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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