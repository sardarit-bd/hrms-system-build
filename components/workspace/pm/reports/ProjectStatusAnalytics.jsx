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

export default function ProjectStatusAnalytics({ projects, hourLogs, leaveRequests }) {
  // Project status data
  const projectStatusData = [
    { name: "Ongoing", value: projects.filter(p => p.status === "ongoing").length },
    { name: "Delivered", value: projects.filter(p => p.status === "delivered").length },
    { name: "Cancelled", value: projects.filter(p => p.status === "cancelled").length },
  ].filter(d => d.value > 0);

  // Hour logs by project data
  const hoursByProject = {};
  hourLogs.forEach(log => {
    if (log.status === "approved") {
      const projectName = log.project?.name || `Project ${log.project_id}`;
      hoursByProject[projectName] = (hoursByProject[projectName] || 0) + (log.hours_logged || 0);
    }
  });
  
  const projectHoursData = Object.entries(hoursByProject)
    .map(([name, hours]) => ({ name: name.length > 15 ? name.substring(0, 12) + "..." : name, hours }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 6);

  // Leave status data
  const leaveStatusData = [
    { name: "Pending", value: leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length },
    { name: "Approved", value: leaveRequests.filter(l => l.status === "approved").length },
    { name: "Rejected", value: leaveRequests.filter(l => l.status === "rejected").length },
  ].filter(d => d.value > 0);

  const hasData = projectStatusData.length > 0 || projectHoursData.length > 0 || leaveStatusData.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center">
          <p className="text-gray-500 text-sm sm:text-base">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

      {/* Hours by Project Chart */}
      {projectHoursData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Hours by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectHoursData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `${value} hours`} />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
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