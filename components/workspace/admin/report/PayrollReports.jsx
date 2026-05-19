"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PayrollReports({ payroll, users, dateRange }) {
  // Filter by date range (payroll_month)
  let filteredPayroll = [...payroll];
  
  if (dateRange.from) {
    filteredPayroll = filteredPayroll.filter((p) => p.payroll_month >= dateRange.from);
  }
  if (dateRange.to) {
    filteredPayroll = filteredPayroll.filter((p) => p.payroll_month <= dateRange.to);
  }

  const totalPayroll = filteredPayroll.reduce((sum, p) => sum + (p.net_salary || 0), 0);
  const draftCount = filteredPayroll.filter((p) => p.payroll_status === "draft").length;
  const approvedCount = filteredPayroll.filter((p) => p.payroll_status === "approved").length;
  const paidCount = filteredPayroll.filter((p) => p.payroll_status === "paid").length;
  const avgSalary = filteredPayroll.length > 0 ? totalPayroll / filteredPayroll.length : 0;

  // Monthly summary
  const monthlySummary = {};
  filteredPayroll.forEach((p) => {
    const month = p.payroll_month;
    if (!monthlySummary[month]) {
      monthlySummary[month] = { total: 0, count: 0 };
    }
    monthlySummary[month].total += p.net_salary || 0;
    monthlySummary[month].count++;
  });

  const statsCards = [
    { title: "Total Payroll", value: `৳${totalPayroll.toLocaleString()}`, color: "bg-green-100 text-green-700" },
    { title: "Average Salary", value: `৳${Math.round(avgSalary).toLocaleString()}`, color: "bg-blue-100 text-blue-700" },
    { title: "Draft", value: draftCount, color: "bg-yellow-100 text-yellow-700" },
    { title: "Approved", value: approvedCount, color: "bg-purple-100 text-purple-700" },
    { title: "Paid", value: paidCount, color: "bg-green-100 text-green-700" },
  ];

  if (filteredPayroll.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No payroll data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Month</th>
                  <th className="text-right py-2 font-medium text-gray-500">Employees</th>
                  <th className="text-right py-2 font-medium text-gray-500">Total Amount</th>
                  <th className="text-right py-2 font-medium text-gray-500">Average</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(monthlySummary)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([month, data]) => (
                    <tr key={month} className="border-b last:border-0">
                      <td className="py-2">{month}</td>
                      <td className="py-2 text-right">{data.count}</td>
                      <td className="py-2 text-right">৳{data.total.toLocaleString()}</td>
                      <td className="py-2 text-right">৳{Math.round(data.total / data.count).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}