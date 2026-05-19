"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Hourglass } from "lucide-react";
import Link from "next/link";

export default function HourLogsSummary({ hourLogs }) {
  const pendingLogs = hourLogs.filter((l) => l.status === "pending").length;
  const approvedLogs = hourLogs.filter((l) => l.status === "approved").length;
  const rejectedLogs = hourLogs.filter((l) => l.status === "rejected").length;
  const totalHours = hourLogs
    .filter((l) => l.status === "approved")
    .reduce((sum, l) => sum + (l.hours_logged || 0), 0);

  if (hourLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock size={16} />
            My Hour Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-4">No hour logs submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock size={16} />
          My Hour Logs
        </CardTitle>
        <Link
          href="/workspace/employee/hour-logs"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 mb-1">
              <Hourglass size={14} />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingLogs}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 mb-1">
              <CheckCircle size={14} />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{approvedLogs}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 mb-1">
              <XCircle size={14} />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{rejectedLogs}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 mb-1">
              <Clock size={14} />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalHours}</p>
            <p className="text-xs text-gray-500">Total Hrs</p>
          </div>
        </div>

        {/* Recent Logs */}
        {hourLogs.slice(0, 3).map((log) => (
          <div key={log.id} className="flex items-center justify-between text-sm border-t pt-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {log.project?.name || "Project"}
              </p>
              <p className="text-xs text-gray-500">
                {log.log_date} • {log.hours_logged} hours
              </p>
              {log.description && (
                <p className="text-xs text-gray-400 truncate max-w-[150px]">{log.description}</p>
              )}
            </div>
            <Badge
              className={
                log.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : log.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            >
              {log.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}