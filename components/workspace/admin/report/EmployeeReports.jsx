"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, UserPlus, TrendingUp } from "lucide-react";

export default function EmployeeReports({ users, departments, selectedDepartment }) {
  // Filter users by department
  const filteredUsers = selectedDepartment
    ? users.filter((u) => u.department === selectedDepartment)
    : users;

  const activeEmployees = filteredUsers.filter((u) => u.status === "active").length;
  const inactiveEmployees = filteredUsers.filter((u) => u.status === "inactive").length;
  const terminatedEmployees = filteredUsers.filter((u) => u.status === "terminated").length;
  
  // Department-wise employees
  const departmentStats = departments.map((dept) => ({
    name: dept.name,
    count: users.filter((u) => u.department === dept.name).length,
  })).filter((d) => d.count > 0);

  // Role-wise employees
  const roleStats = {};
  filteredUsers.forEach((user) => {
    roleStats[user.role] = (roleStats[user.role] || 0) + 1;
  });

  // New joiners (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newJoiners = filteredUsers.filter((u) => {
    if (!u.joining_date) return false;
    return new Date(u.joining_date) >= thirtyDaysAgo;
  }).length;

  const statsCards = [
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      change: "+12%",
    },
    {
      title: "Inactive Employees",
      value: inactiveEmployees,
      icon: UserX,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      change: "-5%",
    },
    {
      title: "Terminated",
      value: terminatedEmployees,
      icon: Users,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      change: "+2%",
    },
    {
      title: "New Joiners (30d)",
      value: newJoiners,
      icon: UserPlus,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      change: "+8",
    },
  ];

  if (filteredUsers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No employee data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department-wise Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Department-wise Employees</CardTitle>
        </CardHeader>
        <CardContent>
          {departmentStats.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No department data available</p>
          ) : (
            <div className="space-y-3">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dept.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1D3A88] rounded-full"
                        style={{
                          width: `${(dept.count / filteredUsers.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                      {dept.count} ({Math.round((dept.count / filteredUsers.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role-wise Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Role-wise Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(roleStats).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {role.replace(/_/g, " ")}
                </p>
                <Badge variant="secondary" className="cursor-default">
                  {count} employees
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}