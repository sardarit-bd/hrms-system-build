"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function HourLogsReports({ hourLogs, projects }) {
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "N/A";
  };

  if (hourLogs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center">
          <Clock size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">No hour log data available</p>
        </CardContent>
      </Card>
    );
  }

  const totalApprovedHours = hourLogs.filter(l => l.status === "approved").reduce((sum, l) => sum + (l.hours_logged || 0), 0);
  const totalPendingHours = hourLogs.filter(l => l.status === "pending").reduce((sum, l) => sum + (l.hours_logged || 0), 0);
  const totalRejectedHours = hourLogs.filter(l => l.status === "rejected").reduce((sum, l) => sum + (l.hours_logged || 0), 0);

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {hourLogs.slice(0, 10).map((log) => (
        <div key={log.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{log.user?.full_name || "N/A"}</p>
            <Badge className={STATUS_COLORS[log.status]}>{log.status}</Badge>
          </div>
          <div className="space-y-1 text-xs">
            <p>Project: {getProjectName(log.project_id)}</p>
            <p>Date: {log.log_date}</p>
            <p>Hours: <span className="font-semibold">{log.hours_logged} hrs</span></p>
            {log.description && <p className="truncate">Desc: {log.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hourLogs.slice(0, 50).map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.user?.full_name || "N/A"}</TableCell>
              <TableCell>{getProjectName(log.project_id)}</TableCell>
              <TableCell>{log.log_date}</TableCell>
              <TableCell>{log.hours_logged} hrs</TableCell>
              <TableCell className="max-w-[200px] truncate">{log.description || "—"}</TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[log.status]}>{log.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Clock size={18} className="sm:w-5 sm:h-5" />
          Hour Logs Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
            <p className="text-[10px] sm:text-xs text-gray-500">Approved Hours</p>
            <p className="text-base sm:text-xl font-bold text-green-600">{totalApprovedHours} hrs</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
            <p className="text-[10px] sm:text-xs text-gray-500">Pending Hours</p>
            <p className="text-base sm:text-xl font-bold text-yellow-600">{totalPendingHours} hrs</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
            <p className="text-[10px] sm:text-xs text-gray-500">Rejected Hours</p>
            <p className="text-base sm:text-xl font-bold text-red-600">{totalRejectedHours} hrs</p>
          </div>
        </div>
        <DesktopTableView />
        <MobileCardView />
        {hourLogs.length > 50 && (
          <p className="text-center text-xs text-gray-500">Showing 50 of {hourLogs.length} entries</p>
        )}
      </CardContent>
    </Card>
  );
}