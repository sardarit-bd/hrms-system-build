"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function PayrollSummary({ payroll }) {
  const totalPayroll = payroll.reduce((sum, p) => sum + (p.net_salary || 0), 0);
  const averageSalary = payroll.length > 0 ? totalPayroll / payroll.length : 0;
  const thisMonthPayroll = payroll.find(p => p.payroll_month === new Date().toISOString().slice(0, 7));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <DollarSign size={18} className="sm:w-5 sm:h-5" />
          Payroll Summary
        </CardTitle>
        <Link href="/workspace/gm/payroll" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
          View Details →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
            <DollarSign size={16} className="mx-auto mb-1 text-green-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ৳{(totalPayroll / 1000000).toFixed(1)}M
            </p>
            <p className="text-[10px] text-gray-500">Total Payroll</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
            <TrendingUp size={16} className="mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ৳{Math.round(averageSalary).toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">Average Salary</p>
          </div>
        </div>
        {thisMonthPayroll && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">This Month's Payroll</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ৳{thisMonthPayroll.net_salary?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{thisMonthPayroll.payroll_month}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}