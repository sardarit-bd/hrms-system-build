"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";

export default function DepartmentOverview({ departments, users }) {
  const departmentStats = departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    count: users.filter(u => u.department === dept.name).length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  const totalEmployees = users.length;

  if (departmentStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Building2 size={18} className="sm:w-5 sm:h-5" />
            Department Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500 text-sm">No department data available</p>
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
      <CardContent className="space-y-3 sm:space-y-4">
        {departmentStats.map((dept) => (
          <div key={dept.id} className="space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{dept.name}</span>
              <span className="text-gray-500">{dept.count} employees</span>
            </div>
            <Progress value={(dept.count / totalEmployees) * 100} className="h-1.5 sm:h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}