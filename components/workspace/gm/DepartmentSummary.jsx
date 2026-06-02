"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";
import Link from "next/link";

export default function DepartmentSummary({ departments, users }) {
  const departmentStats = departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    count: users.filter(u => u.department === dept.name).length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);

  if (departmentStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Building2 size={18} className="sm:w-5 sm:h-5" />
            Top Departments
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No department data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Building2 size={18} className="sm:w-5 sm:h-5" />
          Top Departments
        </CardTitle>
        <Link href="/workspace/gm/departments" className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
          View All →
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {departmentStats.map((dept, index) => (
          <div key={dept.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">#{index + 1}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{dept.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{dept.count} employees</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}