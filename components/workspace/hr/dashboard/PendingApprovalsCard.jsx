"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function PendingApprovalsCard({ pendingUsers, pendingLeaves, onRefresh }) {
  const totalPending = pendingUsers.length + pendingLeaves.length;

  if (totalPending === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <UserCheck size={18} className="sm:w-5 sm:h-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-gray-500">No pending approvals</p>
          <p className="text-xs text-gray-400 mt-1">All requests have been processed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <UserCheck size={18} className="sm:w-5 sm:h-5" />
          Pending Approvals
          <Badge className="ml-2 bg-yellow-100 text-yellow-700">{totalPending}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pending Users */}
        {pendingUsers.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Users size={12} /> Employee Approvals ({pendingUsers.length})
            </p>
            <div className="space-y-2">
              {pendingUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link href={`/workspace/hr/employees/${user.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Leaves */}
        {pendingLeaves.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Calendar size={12} /> Leave Requests ({pendingLeaves.length})
            </p>
            <div className="space-y-2">
              {pendingLeaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium">{leave.user?.full_name || "Employee"}</p>
                    <p className="text-xs text-gray-500">{leave.leave_type?.name}</p>
                  </div>
                  <Link href={`/workspace/hr/leave/${leave.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPending > 3 && (
          <Link href="/workspace/hr/approvals">
            <Button variant="link" size="sm" className="w-full text-[#C9A84C] cursor-pointer">
              View all pending requests →
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}