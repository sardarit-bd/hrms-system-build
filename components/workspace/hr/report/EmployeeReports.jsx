"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, UserX, UserCog } from "lucide-react";

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
  const terminatedCount = users.filter(u => u.status === "terminated").length;

  // Department-wise employee count
  const departmentStats = departments.map(dept => ({
    name: dept.name,
    count: users.filter(u => u.department === dept.name).length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  const totalEmployees = users.length;

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
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
          <Users size={16} className="mx-auto mb-1 text-red-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{terminatedCount}</p>
          <p className="text-[10px] text-gray-500">Terminated</p>
        </div>
      </div>

      {/* Department-wise Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Employees by Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departmentStats.map((dept) => (
            <div key={dept.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{dept.name}</span>
                <span className="text-gray-500">{dept.count} employees ({Math.round((dept.count / totalEmployees) * 100)}%)</span>
              </div>
              <Progress value={(dept.count / totalEmployees) * 100} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Recent Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 10).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department || "—"}</TableCell>
                    <TableCell>{user.joining_date || "—"}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[user.status]}>
                        {user.status}
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