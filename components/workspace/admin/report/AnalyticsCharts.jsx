"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AnalyticsCharts({ users, departments, projects, leaveRequests, payroll }) {
  // Department distribution data
  const departmentData = departments.map((dept) => ({
    name: dept.name,
    employees: users.filter((u) => u.department === dept.name).length,
  })).filter((d) => d.employees > 0);

  // Project status data
  const projectStatusData = [
    { name: "Ongoing", value: projects.filter((p) => p.status === "ongoing").length },
    { name: "Delivered", value: projects.filter((p) => p.status === "delivered").length },
    { name: "Cancelled", value: projects.filter((p) => p.status === "cancelled").length },
  ].filter((d) => d.value > 0);

  // Leave status data
  const leaveStatusData = [
    { name: "Approved", value: leaveRequests.filter((l) => l.status === "approved").length },
    { name: "Pending", value: leaveRequests.filter((l) => l.status === "pending_pm" || l.status === "pending_gm").length },
    { name: "Rejected", value: leaveRequests.filter((l) => l.status === "rejected").length },
  ].filter((d) => d.value > 0);

  // Payroll overview (monthly)
  const monthlyPayroll = {};
  payroll.forEach((p) => {
    const month = p.payroll_month;
    if (month) {
      monthlyPayroll[month] = (monthlyPayroll[month] || 0) + (p.net_salary || 0);
    }
  });
  
  const payrollData = Object.entries(monthlyPayroll)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Department Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Employees by Department</CardTitle>
        </CardHeader>
        <CardContent>
          {departmentData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No department data available</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Project Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {projectStatusData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No project data available</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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
          )}
        </CardContent>
      </Card>

      {/* Leave Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Leave Request Status</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveStatusData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leave request data available</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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
          )}
        </CardContent>
      </Card>

      {/* Payroll Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Payroll Overview (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          {payrollData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No payroll data available</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}