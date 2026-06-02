"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
};

export default function PayrollReports({ payroll, users }) {
  const totalNetSalary = payroll.reduce((sum, p) => sum + (p.net_salary || 0), 0);
  const totalDeductions = payroll.reduce((sum, p) => sum + (p.total_deductions || 0), 0);
  const averageSalary = payroll.length > 0 ? totalNetSalary / payroll.length : 0;
  const paidCount = payroll.filter(p => p.payroll_status === "paid").length;
  const approvedCount = payroll.filter(p => p.payroll_status === "approved").length;
  const draftCount = payroll.filter(p => p.payroll_status === "draft").length;

  const getEmployeeName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || "N/A";
  };

  if (payroll.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No payroll data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
          <DollarSign size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">৳{(totalNetSalary / 1000000).toFixed(1)}M</p>
          <p className="text-[10px] text-gray-500">Total Net Salary</p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
          <TrendingDown size={16} className="mx-auto mb-1 text-red-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">৳{(totalDeductions / 1000000).toFixed(1)}M</p>
          <p className="text-[10px] text-gray-500">Total Deductions</p>
        </div>
        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-purple-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">৳{Math.round(averageSalary).toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Average Salary</p>
        </div>
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{draftCount}</p>
          <p className="text-[10px] text-gray-500">Draft</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{paidCount}</p>
          <p className="text-[10px] text-gray-500">Paid</p>
        </div>
      </div>

      {/* Payroll Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payroll.slice(0, 20).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{getEmployeeName(record.user_id)}</TableCell>
                    <TableCell>{record.payroll_month}</TableCell>
                    <TableCell>৳{record.gross_salary?.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">৳{record.net_salary?.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">৳{record.total_deductions?.toLocaleString()}</TableCell>
                    <TableCell>{record.days_present || "—"}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[record.payroll_status]}>
                        {record.payroll_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}