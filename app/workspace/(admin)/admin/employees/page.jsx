'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

function EmployeesContent() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error('[v0] Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !departmentFilter || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(employees.map((emp) => emp.department))];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
              Employees
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              Manage your organization&apos;s employees
            </p>
          </div>
          <Button variant="primary" className="w-full sm:w-auto">
            + Add Employee
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 sm:py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 sm:py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Employee Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground dark:text-gray-400">
                  Loading employees...
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border dark:border-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                          Designation
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="border-b border-border dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          onClick={() => (window.location.href = `/workspace/admin/employees/${employee.id}`)}
                        >
                          <td className="py-4 px-4 font-medium text-foreground dark:text-white">
                            {employee.name}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground dark:text-gray-400 text-sm">
                            {employee.email}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground dark:text-gray-400 text-sm">
                            {employee.designation}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground dark:text-gray-400 text-sm">
                            {employee.department}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                              ✓ {employee.status}
                            </span>
                          </td>
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <button className="text-accent hover:text-accent/80 text-sm font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => (window.location.href = `/employees/${employee.id}`)}
                      className="p-4 bg-secondary dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 hover:border-accent dark:hover:border-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground dark:text-white truncate">
                            {employee.name}
                          </h3>
                          <p className="text-xs text-muted-foreground dark:text-gray-400 mt-0.5 truncate">
                            {employee.email}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                              {employee.designation}
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded">
                              {employee.department}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                              ✓ {employee.status}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="flex-shrink-0 text-muted-foreground dark:text-gray-500 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground dark:text-gray-400">
                      No employees found matching your criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function EmployeesPage() {
  return (
    <ProtectedRoute>
      <EmployeesContent />
    </ProtectedRoute>
  );
}
