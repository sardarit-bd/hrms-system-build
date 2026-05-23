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
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardCharts({ projects, hourLogs, leaveRequests }) {
  // Project status data
  const projectStatusData = [
    { name: "Ongoing", value: projects.filter(p => p.status === "ongoing").length },
    { name: "Delivered", value: projects.filter(p => p.status === "delivered").length },
    { name: "Cancelled", value: projects.filter(p => p.status === "cancelled").length },
  ].filter(d => d.value > 0);

  // Hour logs status (pending vs approved vs rejected)
  const hourLogsData = [
    { name: "Pending", value: hourLogs.filter(l => l.status === "pending").length },
    { name: "Approved", value: hourLogs.filter(l => l.status === "approved").length },
    { name: "Rejected", value: hourLogs.filter(l => l.status === "rejected").length },
  ].filter(d => d.value > 0);

  // Leave request status
  const leaveStatusData = [
    { name: "Pending PM", value: leaveRequests.filter(l => l.status === "pending_pm").length },
    { name: "Pending GM", value: leaveRequests.filter(l => l.status === "pending_gm").length },
  ].filter(d => d.value > 0);

  if (projectStatusData.length === 0 && hourLogsData.length === 0 && leaveStatusData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Status Chart */}
      {projectStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
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

      {/* Hour Logs Chart */}
      {hourLogsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hour Logs Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hourLogsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {hourLogsData.map((entry, index) => (
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

      {/* Leave Request Status Chart */}
      {leaveStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Leave Requests Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
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