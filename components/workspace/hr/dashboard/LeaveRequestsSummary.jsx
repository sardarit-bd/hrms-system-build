"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function LeaveRequestsSummary({ leaveRequests }) {
  const pendingCount = leaveRequests.filter(l => l.status === "pending_pm" || l.status === "pending_gm").length;
  const approvedCount = leaveRequests.filter(l => l.status === "approved").length;
  const rejectedCount = leaveRequests.filter(l => l.status === "rejected").length;

  // Recent leave requests
  const recentRequests = [...leaveRequests]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Calendar size={18} className="sm:w-5 sm:h-5" />
          Leave Requests Summary
        </CardTitle>
        <Link href="/workspace/hr/leave" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
          Manage →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
            <Clock size={14} className="mx-auto mb-1 text-yellow-600" />
            <p className="text-base font-bold">{pendingCount}</p>
            <p className="text-[10px] text-gray-500">Pending</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
            <CheckCircle size={14} className="mx-auto mb-1 text-green-600" />
            <p className="text-base font-bold">{approvedCount}</p>
            <p className="text-[10px] text-gray-500">Approved</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
            <XCircle size={14} className="mx-auto mb-1 text-red-600" />
            <p className="text-base font-bold">{rejectedCount}</p>
            <p className="text-[10px] text-gray-500">Rejected</p>
          </div>
        </div>

        {/* Recent Requests */}
        {recentRequests.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Requests</h4>
            <div className="space-y-2">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium">{request.user?.full_name || "Employee"}</p>
                    <p className="text-xs text-gray-500">{request.leave_type?.name} • {request.total_days} days</p>
                  </div>
                  <Badge className={
                    request.status === "approved" ? "bg-green-100 text-green-700" :
                    request.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }>
                    {request.status === "pending_pm" || request.status === "pending_gm" ? "Pending" : request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}