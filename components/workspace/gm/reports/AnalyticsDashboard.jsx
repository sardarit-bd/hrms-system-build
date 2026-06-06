"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AnalyticsDashboard({ users, departments, projects, payroll, leaveRequests }) {
  // Department-wise employee distribution
  const deptData = departments.map(dept => ({
    name: dept.name.length > 10 ? dept.name.substring(0, 8) + "..." : dept.name,
    employees: users.filter(u => u.department === dept.name).length,
  })).filter(d => d.employees > 0);

  // Project status data
  const projectStatusData = [
    { name: "Ongoing", value: projects.filter(p => p.status === "ongoing").length },
    { name: "Delivered", value: projects.filter(p => p.status === "delivered").length },
    { name: "Cancelled", value: projects.filter(p => p.status === "cancelled").length },
  ].filter(d => d.value > 0);

  // Monthly payroll trend
  const monthlyPayroll = {};
  payroll.forEach(record => {
    const month = record.payroll_month;
    if (month) {
      monthlyPayroll[month] = (monthlyPayroll[month] || 0) + (record.net_salary || 0);
    }
  });
  const payrollTrendData = Object.entries(monthlyPayroll)
    .map(([month, total]) => ({ month: month.slice(0, 7), total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  // Leave status data
  const leaveStatusData = [
    { name: "Pending", value: leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length },
    { name: "Approved", value: leaveRequests.filter(l => l.status === "approved").length },
    { name: "Rejected", value: leaveRequests.filter(l => l.status === "rejected").length },
  ].filter(d => d.value > 0);

  // Employee growth (by joining date)
  const joinByMonth = {};
  users.forEach(user => {
    if (user.joining_date) {
      const month = user.joining_date.slice(0, 7);
      joinByMonth[month] = (joinByMonth[month] || 0) + 1;
    }
  });
  const employeeGrowthData = Object.entries(joinByMonth)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  const hasData = deptData.length > 0 || projectStatusData.length > 0 || payrollTrendData.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Department-wise Employees Chart */}
      {deptData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Status Chart */}
      {projectStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {projectStatusData.map((entry, index) => (
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

      {/* Payroll Trend Chart */}
      {payrollTrendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Payroll Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `৳${(value / 1000000).toFixed(1)}M`} />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Growth Chart */}
      {employeeGrowthData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Employee Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leave Status Chart */}
      {leaveStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Leave Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {leaveStatusData.map((entry, index) => (
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
    </div>
  );
}