"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, UserX, UserCog, TrendingUp } from "lucide-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  terminated: "bg-red-100 text-red-700",
};

export default function EmployeeReports({ users, departments }) {
  const activeCount = users.filter(u => u.status === "active").length;
  const inactiveCount = users.filter(u => u.status === "inactive").length;
  const pendingCount = users.filter(u => u.status === "pending").length;
  const total = users.length;
  const activeRate = total > 0 ? (activeCount / total) * 100 : 0;

  // Role distribution
  const roleStats = {};
  users.forEach(user => {
    roleStats[user.role] = (roleStats[user.role] || 0) + 1;
  });

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No employee data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
          <UserCheck size={16} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{activeCount}</p>
          <p className="text-[10px] text-gray-500">Active</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
          <UserX size={16} className="mx-auto mb-1 text-gray-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{inactiveCount}</p>
          <p className="text-[10px] text-gray-500">Inactive</p>
        </div>
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center">
          <UserCog size={16} className="mx-auto mb-1 text-yellow-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingCount}</p>
          <p className="text-[10px] text-gray-500">Pending</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{activeRate.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-500">Active Rate</p>
        </div>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(roleStats).map(([role, count]) => (
              <div key={role} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium capitalize">{role.replace(/_/g, " ")}</span>
                  <span className="text-gray-500">{count} employees ({Math.round((count / total) * 100)}%)</span>
                </div>
                <Progress value={(count / total) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joining Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 20).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department || "—"}</TableCell>
                    <TableCell className="capitalize">{user.role?.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[user.status]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joining_date || "—"}</TableCell>
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