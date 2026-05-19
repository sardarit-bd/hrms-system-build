"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LeaveReports({ leaveRequests, dateRange, selectedStatus }) {
  // Filter by date range
  let filteredLeaves = [...leaveRequests];
  
  if (dateRange.from) {
    filteredLeaves = filteredLeaves.filter((l) => l.from_date >= dateRange.from);
  }
  if (dateRange.to) {
    filteredLeaves = filteredLeaves.filter((l) => l.to_date <= dateRange.to);
  }
  if (selectedStatus) {
    filteredLeaves = filteredLeaves.filter((l) => l.status === selectedStatus);
  }

  const approvedLeaves = filteredLeaves.filter((l) => l.status === "approved").length;
  const pendingLeaves = filteredLeaves.filter((l) => l.status === "pending_pm" || l.status === "pending_gm").length;
  const rejectedLeaves = filteredLeaves.filter((l) => l.status === "rejected").length;
  const totalLeaves = filteredLeaves.length;
  const totalDays = filteredLeaves.reduce((sum, l) => sum + (l.total_days || 0), 0);

  // Leave type summary
  const leaveTypeStats = {};
  filteredLeaves.forEach((leave) => {
    const typeName = leave.leave_type?.name || "Unknown";
    if (!leaveTypeStats[typeName]) {
      leaveTypeStats[typeName] = { count: 0, days: 0 };
    }
    leaveTypeStats[typeName].count++;
    leaveTypeStats[typeName].days += leave.total_days || 0;
  });

  const statsCards = [
    { title: "Total Requests", value: totalLeaves, color: "bg-blue-100 text-blue-700" },
    { title: "Approved", value: approvedLeaves, color: "bg-green-100 text-green-700" },
    { title: "Pending", value: pendingLeaves, color: "bg-yellow-100 text-yellow-700" },
    { title: "Rejected", value: rejectedLeaves, color: "bg-red-100 text-red-700" },
    { title: "Total Days", value: totalDays, color: "bg-purple-100 text-purple-700" },
  ];

  if (filteredLeaves.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No leave request data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave Type Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Leave Type Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(leaveTypeStats).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="cursor-default">
                    {type}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {data.count} requests • {data.days} days
                  </span>
                </div>
                <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1D3A88] rounded-full"
                    style={{ width: `${(data.count / totalLeaves) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 min-w-[60px]">
                  {Math.round((data.count / totalLeaves) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}