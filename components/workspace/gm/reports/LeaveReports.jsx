"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

const STATUS_COLORS = {
  pending_pm: "bg-yellow-100 text-yellow-700",
  pending_gm: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function LeaveReports({ leaveRequests, users }) {
  const pendingCount = leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length;
  const approvedCount = leaveRequests.filter(l => l.status === "approved").length;
  const rejectedCount = leaveRequests.filter(l => l.status === "rejected").length;
  const totalDays = leaveRequests.reduce((sum, l) => sum + (l.total_days || 0), 0);

  const getEmployeeName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || "N/A";
  };

  if (leaveRequests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No leave request data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center">
          <Clock size={16} className="mx-auto mb-1 text-yellow-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingCount}</p>
          <p className="text-[10px] text-gray-500">Pending</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
          <CheckCircle size={16} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{approvedCount}</p>
          <p className="text-[10px] text-gray-500">Approved</p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
          <XCircle size={16} className="mx-auto mb-1 text-red-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{rejectedCount}</p>
          <p className="text-[10px] text-gray-500">Rejected</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
          <Calendar size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalDays}</p>
          <p className="text-[10px] text-gray-500">Total Days</p>
        </div>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {leaveRequests.slice(0, 20).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{getEmployeeName(request.user_id)}</TableCell>
                    <TableCell>{request.leave_type?.name || "N/A"}</TableCell>
                    <TableCell>{request.from_date}</TableCell>
                    <TableCell>{request.to_date}</TableCell>
                    <TableCell>{request.total_days}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[request.status]}>
                        {request.status === "pending_pm" ? "Pending PM" :
                         request.status === "pending_gm" ? "Pending GM" :
                         request.status}
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