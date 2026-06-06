"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Building2, Users } from "lucide-react";

export default function DepartmentReports({ departments, users }) {
  const departmentStats = departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    count: users.filter(u => u.department === dept.name).length,
    activeCount: users.filter(u => u.department === dept.name && u.status === "active").length,
    inactiveCount: users.filter(u => u.department === dept.name && u.status !== "active").length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  const totalEmployees = users.length;

  if (departmentStats.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No department data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Building2 size={18} className="sm:w-5 sm:h-5" />
          Department Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Total Employees</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Inactive</TableHead>
                <TableHead>% of Workforce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentStats.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.count}</TableCell>
                  <TableCell className="text-green-600">{dept.activeCount}</TableCell>
                  <TableCell className="text-gray-500">{dept.inactiveCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(dept.count / totalEmployees) * 100} className="h-1.5 w-20" />
                      <span className="text-xs">{Math.round((dept.count / totalEmployees) * 100)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}