"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, UserCog } from "lucide-react";
import Link from "next/link";

export default function EmployeeSummary({ users, departments }) {
  const activeCount = users.filter(u => u.status === "active").length;
  const inactiveCount = users.filter(u => u.status === "inactive").length;
  const pendingCount = users.filter(u => u.status === "pending").length;

  // Recent employees (last 5 by joining date)
  const recentEmployees = [...users]
    .sort((a, b) => new Date(b.joining_date) - new Date(a.joining_date))
    .slice(0, 5);

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {recentEmployees.map((employee) => (
        <div key={employee.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{employee.full_name}</p>
            <Badge className={employee.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {employee.status}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>{employee.email}</p>
            <p>{employee.department || "—"}</p>
            <p>Joined: {employee.joining_date || "—"}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Users size={18} className="sm:w-5 sm:h-5" />
          Employee Summary
        </CardTitle>
        <Link href="/workspace/hr/employees" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
          View All Employees →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Status Summary */}
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

        {/* Recent Employees Table */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Joiners</h4>
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
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
                {recentEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.full_name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department || "—"}</TableCell>
                    <TableCell>{employee.joining_date || "—"}</TableCell>
                    <TableCell>
                      <Badge className={employee.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <MobileCardView />
        </div>
      </CardContent>
    </Card>
  );
}