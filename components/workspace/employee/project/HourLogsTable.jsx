"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function HourLogsTable({ hourLogs, projects, hideProjectColumn = false }) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "N/A";
  };

  if (hourLogs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <Clock size={32} className="text-gray-400" />
          <p className="text-gray-500">No hour logs found</p>
          <p className="text-sm text-gray-400">Submit your first hour log to track your work.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              {!hideProjectColumn && <TableHead className="cursor-default">Project</TableHead>}
              <TableHead className="cursor-default">Date</TableHead>
              <TableHead className="cursor-default">Hours Worked</TableHead>
              <TableHead className="cursor-default">Description</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hourLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                {!hideProjectColumn && (
                  <TableCell className="font-medium cursor-default">
                    {getProjectName(log.project_id)}
                  </TableCell>
                )}
                <TableCell className="cursor-default">{log.log_date}</TableCell>
                <TableCell className="cursor-default font-semibold">
                  {log.hours_logged} hrs
                </TableCell>
                <TableCell className="cursor-default max-w-[250px] truncate">
                  {log.description || "—"}
                </TableCell>
                <TableCell className="cursor-default">{getStatusBadge(log.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}