"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck } from "lucide-react";

const STATUS_COLORS = {
  pending_pm: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  pending_gm: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = {
  pending_pm: "Pending PM",
  pending_gm: "Pending GM",
  approved: "Approved",
  rejected: "Rejected",
};

export default function LeaveApprovalReports({ leaveRequests }) {
  if (leaveRequests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center">
          <CalendarCheck size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">No leave approval data available</p>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length;
  const approvedCount = leaveRequests.filter(l => l.status === "approved").length;
  const rejectedCount = leaveRequests.filter(l => l.status === "rejected").length;
  const totalDays = leaveRequests.reduce((sum, l) => sum + (l.total_days || 0), 0);

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {leaveRequests.slice(0, 10).map((request) => (
        <div key={request.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{request.user?.full_name || "N/A"}</p>
            <Badge className={STATUS_COLORS[request.status]}>
              {STATUS_LABELS[request.status] || request.status}
            </Badge>
          </div>
          <div className="space-y-1 text-xs">
            <p>Type: {request.leave_type?.name}</p>
            <p>Duration: {request.from_date} to {request.to_date}</p>
            <p>Days: {request.total_days} day(s)</p>
            {request.reason && <p className="truncate">Reason: {request.reason}</p>}
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
            <TableHead>Leave Type</TableHead>
            <TableHead>From Date</TableHead>
            <TableHead>To Date</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.slice(0, 50).map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.user?.full_name || "N/A"}</TableCell>
              <TableCell>{request.leave_type?.name || "N/A"}</TableCell>
              <TableCell>{request.from_date}</TableCell>
              <TableCell>{request.to_date}</TableCell>
              <TableCell>{request.total_days}</TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[request.status]}>
                  {STATUS_LABELS[request.status] || request.status}
                </Badge>
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
          <CalendarCheck size={18} className="sm:w-5 sm:h-5" />
          Leave Approval Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
            <p className="text-[10px] sm:text-xs text-gray-500">Pending</p>
            <p className="text-base sm:text-xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
            <p className="text-[10px] sm:text-xs text-gray-500">Approved</p>
            <p className="text-base sm:text-xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
            <p className="text-[10px] sm:text-xs text-gray-500">Rejected</p>
            <p className="text-base sm:text-xl font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>
        <DesktopTableView />
        <MobileCardView />
        {leaveRequests.length > 50 && (
          <p className="text-center text-xs text-gray-500">Showing 50 of {leaveRequests.length} entries</p>
        )}
      </CardContent>
    </Card>
  );
}