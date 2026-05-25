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

const CHART_COLORS = ["#f59e0b", "#10b981", "#ef4444"];

export default function HourLogsCharts({ hourLogs, projects }) {
  // Status distribution data
  const statusData = [
    { name: "Pending", value: hourLogs.filter(l => l.status === "pending").length },
    { name: "Approved", value: hourLogs.filter(l => l.status === "approved").length },
    { name: "Rejected", value: hourLogs.filter(l => l.status === "rejected").length },
  ].filter(d => d.value > 0);

  // Hours by project data
  const hoursByProject = {};
  hourLogs.forEach(log => {
    if (log.status === "approved") {
      const projectName = log.project?.name || "Unknown";
      hoursByProject[projectName] = (hoursByProject[projectName] || 0) + (log.hours_logged || 0);
    }
  });
  
  const projectData = Object.entries(hoursByProject)
    .map(([name, hours]) => ({ name: name.length > 15 ? name.substring(0, 12) + "..." : name, hours }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  if (statusData.length === 0 && projectData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Status Distribution Chart */}
      {statusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Hour Log Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
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

      {/* Hours by Project Chart */}
      {projectData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Hours by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData} layout="vertical">
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
    </div>
  );
}