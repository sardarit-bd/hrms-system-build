"use client";

import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function ApprovalsContent() {
  const { user } = useAuth();
  const [pendingLeaves, setPendingLeaves] = useState([
    {
      id: "1",
      employeeName: "John Doe",
      type: "Sick Leave",
      fromDate: "2024-05-15",
      toDate: "2024-05-15",
      reason: "Not feeling well",
      appliedOn: "2024-05-13",
      status: "pending",
    },
    {
      id: "2",
      employeeName: "Sarah Smith",
      type: "Casual Leave",
      fromDate: "2024-05-20",
      toDate: "2024-05-22",
      reason: "Family event",
      appliedOn: "2024-05-10",
      status: "pending",
    },
  ]);

  const handleApprove = async (leaveId) => {
    try {
      const response = await fetch(`/api/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          approvedBy: user.id,
        }),
      });

      if (response.ok) {
        setPendingLeaves(pendingLeaves.filter((leave) => leave.id !== leaveId));
      }
    } catch (error) {
      console.error("[v0] Failed to approve leave:", error);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const response = await fetch(`/api/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          approvedBy: user.id,
        }),
      });

      if (response.ok) {
        setPendingLeaves(pendingLeaves.filter((leave) => leave.id !== leaveId));
      }
    } catch (error) {
      console.error("[v0] Failed to reject leave:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">
            Approvals
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            Review and approve leave requests and other submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Pending Approvals
              </p>
              <p className="text-4xl font-bold text-primary dark:text-white">
                {pendingLeaves.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Approved This Month
              </p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                12
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Rejected This Month
              </p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                2
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground dark:text-gray-400">
                  No pending leave requests
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="border border-border dark:border-slate-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-foreground dark:text-white mb-1">
                          {leave.employeeName}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          {leave.type} • {leave.fromDate} to {leave.toDate}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full">
                        Pending
                      </span>
                    </div>

                    <div className="bg-secondary dark:bg-slate-800 rounded p-3 mb-4">
                      <p className="text-sm text-foreground dark:text-white">
                        Reason: {leave.reason}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(leave.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(leave.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function ApprovalsPage() {
  return (
    // <ProtectedRoute requiredRole="admin">
      <ApprovalsContent />
    // </ProtectedRoute>
  );
}