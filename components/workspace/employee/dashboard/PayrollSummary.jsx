"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function PayrollSummary({ payroll }) {
  const latestPayroll = payroll[0];
  const totalEarnings = payroll.reduce((sum, p) => sum + (p.net_salary || 0), 0);
  const averageSalary = payroll.length > 0 ? totalEarnings / payroll.length : 0;

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-yellow-100 text-yellow-700",
      approved: "bg-blue-100 text-blue-700",
      paid: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (payroll.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <DollarSign size={16} />
            My Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-4">No payroll records found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <DollarSign size={16} />
          My Payroll
        </CardTitle>
        <Link
          href="/workspace/employee/payroll"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Month */}
        {latestPayroll && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-[#1B2B4B]/5 to-[#C9A84C]/5 dark:from-[#1B2B4B]/10 dark:to-[#C9A84C]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Latest Month</span>
              <Badge className={getStatusColor(latestPayroll.payroll_status)}>
                {latestPayroll.payroll_status?.charAt(0).toUpperCase() + latestPayroll.payroll_status?.slice(1)}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ৳{latestPayroll.net_salary?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {latestPayroll.payroll_month} • Basic: ৳{latestPayroll.basic_salary?.toLocaleString()}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Total Earnings</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ৳{totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Average Salary</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ৳{Math.round(averageSalary).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Payrolls */}
        {payroll.slice(0, 3).map((record) => (
          <div key={record.id} className="flex items-center justify-between text-sm border-t pt-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {record.payroll_month}
              </p>
              <p className="text-xs text-gray-500">
                Net: ৳{record.net_salary?.toLocaleString()}
              </p>
            </div>
            <Badge className={getStatusColor(record.payroll_status)}>
              {record.payroll_status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}