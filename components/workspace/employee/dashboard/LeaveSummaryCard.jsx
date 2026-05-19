"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LeaveSummaryCard({ leaveRequests }) {
  // Calculate statistics
  const pendingLeaves = leaveRequests.filter(
    (l) => l.status === "pending_pm" || l.status === "pending_gm"
  ).length;
  
  const approvedLeaves = leaveRequests.filter((l) => l.status === "approved").length;
  const rejectedLeaves = leaveRequests.filter((l) => l.status === "rejected").length;
  const totalLeaves = leaveRequests.length;
  
  // Calculate total days (if total_days field exists)
  const totalDays = leaveRequests.reduce((sum, l) => sum + (l.total_days || 0), 0);
  const approvedDays = leaveRequests
    .filter((l) => l.status === "approved")
    .reduce((sum, l) => sum + (l.total_days || 0), 0);

  const stats = [
    { 
      label: "Pending", 
      value: pendingLeaves, 
      icon: Clock, 
      color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
      badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    },
    { 
      label: "Approved", 
      value: approvedLeaves, 
      icon: CheckCircle, 
      color: "text-green-600 bg-green-50 dark:bg-green-950/30",
      badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    },
    { 
      label: "Rejected", 
      value: rejectedLeaves, 
      icon: XCircle, 
      color: "text-red-600 bg-red-50 dark:bg-red-950/30",
      badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "pending_pm":
      case "pending_gm":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending_pm":
        return "Pending PM";
      case "pending_gm":
        return "Pending GM";
      default:
        return status;
    }
  };

  if (leaveRequests.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CalendarDays size={16} />
            My Leave Requests
          </CardTitle>
          <Link
            href="/workspace/employee/leave"
            className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
          >
            Apply Leave
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <CalendarDays size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No leave requests found</p>
            <Link
              href="/workspace/employee/leave"
              className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 mt-2 cursor-pointer"
            >
              Apply for leave
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarDays size={16} />
          My Leave Requests
        </CardTitle>
        <Link
          href="/workspace/employee/leave"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer flex items-center gap-1"
        >
          Apply Leave
          <span className="text-xs">→</span>
        </Link>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.color} mb-2`}>
                <stat.icon size={14} />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Total Days Summary */}
        {totalDays > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Days Taken</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{approvedDays}</span>
              <span className="text-sm text-gray-500"> / {totalDays} days</span>
            </div>
          </div>
        )}

        {/* Recent Leave Requests */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Requests</p>
          {leaveRequests.slice(0, 3).map((leave) => (
            <div 
              key={leave.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {leave.leave_type?.name || "Leave Request"}
                  </p>
                  <Badge className={getStatusBadge(leave.status)}>
                    {getStatusLabel(leave.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-gray-500">
                    {leave.from_date} → {leave.to_date}
                  </p>
                  <span className="text-xs text-gray-400">
                    {leave.total_days} day{leave.total_days !== 1 ? "s" : ""}
                  </span>
                </div>
                {leave.reason && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{leave.reason}</p>
                )}
              </div>
              {leave.status === "pending_pm" || leave.status === "pending_gm" ? (
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              ) : leave.status === "approved" ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : leave.status === "rejected" ? (
                <XCircle size={14} className="text-red-500" />
              ) : null}
            </div>
          ))}
        </div>

        {/* View All Link */}
        {leaveRequests.length > 3 && (
          <div className="text-center pt-2">
            <Link
              href="/workspace/employee/leave"
              className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
            >
              View all {leaveRequests.length} requests →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}