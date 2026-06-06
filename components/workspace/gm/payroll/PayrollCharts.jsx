"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#f59e0b", "#8b5cf6", "#10b981"];

export default function PayrollCharts({ payrollRecords }) {
  // Status distribution data
  const statusData = [
    { name: "Draft", value: payrollRecords.filter(p => p.payroll_status === "draft").length },
    { name: "Approved", value: payrollRecords.filter(p => p.payroll_status === "approved").length },
    { name: "Paid", value: payrollRecords.filter(p => p.payroll_status === "paid").length },
  ].filter(d => d.value > 0);

  // Monthly payroll summary
  const monthlyPayroll = {};
  payrollRecords.forEach(record => {
    const month = record.payroll_month;
    if (month) {
      monthlyPayroll[month] = (monthlyPayroll[month] || 0) + (record.net_salary || 0);
    }
  });
  const monthlyData = Object.entries(monthlyPayroll)
    .map(([month, total]) => ({ month: month.slice(0, 7), total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  const hasData = statusData.length > 0 || monthlyData.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Status Distribution Chart */}
      {statusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Payroll Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Payroll Chart */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Monthly Payroll Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `৳${(value / 1000000).toFixed(1)}M`} />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}