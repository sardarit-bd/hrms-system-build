"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, UserX, UserCog } from "lucide-react";
import Link from "next/link";

export default function EmployeeSummary({ users }) {
  const activeCount = users.filter(u => u.status === "active").length;
  const inactiveCount = users.filter(u => u.status === "inactive").length;
  const pendingCount = users.filter(u => u.status === "pending").length;
  const total = users.length;

  const activePercentage = total > 0 ? (activeCount / total) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Users size={18} className="sm:w-5 sm:h-5" />
          Employee Summary
        </CardTitle>
        <Link href="/workspace/gm/employees" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
          View All →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Distribution */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
            <UserCheck size={16} className="mx-auto mb-1 text-green-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{activeCount}</p>
            <p className="text-[10px] text-gray-500">Active</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <UserX size={16} className="mx-auto mb-1 text-gray-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{inactiveCount}</p>
            <p className="text-[10px] text-gray-500">Inactive</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
            <UserCog size={16} className="mx-auto mb-1 text-yellow-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            <p className="text-[10px] text-gray-500">Pending</p>
          </div>
        </div>

        {/* Active Rate Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Active Employee Rate</span>
            <span className="font-medium text-gray-900 dark:text-white">{activePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={activePercentage} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}