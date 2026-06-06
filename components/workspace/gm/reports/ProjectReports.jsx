"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";

const STATUS_COLORS = {
  ongoing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ProjectReports({ projects }) {
  const ongoingCount = projects.filter(p => p.status === "ongoing").length;
  const deliveredCount = projects.filter(p => p.status === "delivered").length;
  const cancelledCount = projects.filter(p => p.status === "cancelled").length;
  const total = projects.length;
  const completionRate = total > 0 ? (deliveredCount / total) * 100 : 0;

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No project data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
          <Briefcase size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{total}</p>
          <p className="text-[10px] text-gray-500">Total Projects</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
          <Clock size={16} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{ongoingCount}</p>
          <p className="text-[10px] text-gray-500">Ongoing</p>
        </div>
        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
          <CheckCircle size={16} className="mx-auto mb-1 text-purple-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{deliveredCount}</p>
          <p className="text-[10px] text-gray-500">Delivered</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{completionRate.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-500">Completion Rate</p>
        </div>
      </div>

      {/* Project List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.client_name || "—"}</TableCell>
                    <TableCell className="capitalize">{project.type}</TableCell>
                    <TableCell>{project.total_budget?.toLocaleString()} {project.currency}</TableCell>
                    <TableCell className={project.is_overdue ? "text-red-600" : ""}>{project.deadline}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[project.status]}>
                        {project.status}
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

// Import TrendingUp
import { TrendingUp } from "lucide-react";