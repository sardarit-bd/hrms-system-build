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

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function GMCharts({ users, departments, projects, leaveRequests, payroll }) {
  // Department-wise employee data
  const deptData = departments.map(dept => ({
    name: dept.name.length > 10 ? dept.name.substring(0, 8) + "..." : dept.name,
    employees: users.filter(u => u.department === dept.name).length,
  })).filter(d => d.employees > 0).slice(0, 6);

  // Project status data
  const projectStatusData = [
    { name: "Ongoing", value: projects.filter(p => p.status === "ongoing").length },
    { name: "Delivered", value: projects.filter(p => p.status === "delivered").length },
    { name: "Cancelled", value: projects.filter(p => p.status === "cancelled").length },
  ].filter(d => d.value > 0);

  // Leave status data
  const leaveStatusData = [
    { name: "Pending PM", value: leaveRequests.filter(l => l.status === "pending_pm").length },
    { name: "Pending GM", value: leaveRequests.filter(l => l.status === "pending_gm").length },
    { name: "Approved", value: leaveRequests.filter(l => l.status === "approved").length },
    { name: "Rejected", value: leaveRequests.filter(l => l.status === "rejected").length },
  ].filter(d => d.value > 0);

  // Monthly payroll data
  const monthlyPayroll = {};
  payroll.forEach(p => {
    const month = p.payroll_month;
    if (month) {
      monthlyPayroll[month] = (monthlyPayroll[month] || 0) + (p.net_salary || 0);
    }
  });
  const payrollData = Object.entries(monthlyPayroll)
    .map(([month, total]) => ({ month: month.slice(0, 7), total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  const hasData = deptData.length > 0 || projectStatusData.length > 0 || leaveStatusData.length > 0 || payrollData.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 10 }} />
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
            <CardTitle className="text-sm sm:text-base font-medium">Project Status</CardTitle>
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

      {/* Payroll Overview Chart */}
      {payrollData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Payroll Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `৳${(value / 1000000).toFixed(1)}M`} />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}