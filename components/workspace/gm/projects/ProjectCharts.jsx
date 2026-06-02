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

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ProjectCharts({ projects, projectManagers }) {
  // Project status data
  const statusData = [
    { name: "Ongoing", value: projects.filter(p => p.status === "ongoing").length },
    { name: "Delivered", value: projects.filter(p => p.status === "delivered").length },
    { name: "Cancelled", value: projects.filter(p => p.status === "cancelled").length },
  ].filter(d => d.value > 0);

  // Projects by PM data
  const pmData = {};
  projects.forEach(project => {
    if (project.project_manager?.full_name) {
      const pmName = project.project_manager.full_name.split(" ")[0];
      pmData[pmName] = (pmData[pmName] || 0) + 1;
    }
  });
  const pmChartData = Object.entries(pmData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (statusData.length === 0 && pmChartData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Project Status Chart */}
      {statusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Project Status Distribution</CardTitle>
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

      {/* Projects by PM Chart */}
      {pmChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base font-medium">Projects by Project Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pmChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}