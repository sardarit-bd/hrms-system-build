"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepartmentReports({ departments, users }) {
  const departmentStats = departments.map((dept) => {
    const deptUsers = users.filter((u) => u.department === dept.name);
    const activeUsers = deptUsers.filter((u) => u.status === "active").length;
    const inactiveUsers = deptUsers.filter((u) => u.status !== "active").length;
    
    return {
      id: dept.id,
      name: dept.name,
      total: deptUsers.length,
      active: activeUsers,
      inactive: inactiveUsers,
    };
  }).filter((d) => d.total > 0);

  const totalEmployees = users.filter((u) => u.status === "active").length;
  const departmentsWithEmployees = departmentStats.length;

  if (departmentStats.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No department data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Departments</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {departmentsWithEmployees}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Active Employees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalEmployees}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Department</th>
                  <th className="text-center py-2 font-medium text-gray-500">Total</th>
                  <th className="text-center py-2 font-medium text-gray-500">Active</th>
                  <th className="text-center py-2 font-medium text-gray-500">Inactive</th>
                  <th className="text-right py-2 font-medium text-gray-500">% of Workforce</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept) => (
                  <tr key={dept.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{dept.name}</td>
                    <td className="py-2 text-center">{dept.total}</td>
                    <td className="py-2 text-center text-green-600">{dept.active}</td>
                    <td className="py-2 text-center text-gray-500">{dept.inactive}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1D3A88] rounded-full"
                            style={{ width: `${(dept.total / totalEmployees) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 min-w-[45px]">
                          {Math.round((dept.total / totalEmployees) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}