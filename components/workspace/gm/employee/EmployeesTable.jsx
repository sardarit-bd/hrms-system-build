"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, ChevronLeft, ChevronRight, Users } from "lucide-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  terminated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  general_manager: "General Manager",
  hr_manager: "HR Manager",
  project_manager: "Project Manager",
  team_leader: "Team Leader",
  employee: "Employee",
};

export default function EmployeesTable({
  employees,
  currentPage,
  setCurrentPage,
  total,
  perPage,
  totalPages,
  departments,
  onViewDetails,
}) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default text-[10px] sm:text-xs`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department?.name || "—";
  };

  if (employees.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Users size={32} className="text-gray-400" />
          <p className="text-sm sm:text-base text-gray-500">No employees found</p>
          <p className="text-xs sm:text-sm text-gray-400">Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {employees.map((employee) => (
        <div key={employee.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium">{employee.full_name}</p>
              <p className="text-xs text-gray-500">{employee.employee_code || "—"}</p>
            </div>
            {getStatusBadge(employee.status)}
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>{employee.email}</p>
            <p>{getDepartmentName(employee.department_id)}</p>
            <p>{ROLE_LABELS[employee.role] || employee.role}</p>
            <p>Joined: {employee.joining_date || "—"}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(employee)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="cursor-default text-xs sm:text-sm">Employee Code</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Full Name</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Email</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Department</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Role</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Status</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Joining Date</TableHead>
            <TableHead className="text-right cursor-default text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <TableCell className="font-mono text-xs cursor-default">{employee.employee_code || "—"}</TableCell>
              <TableCell className="font-medium cursor-default text-xs sm:text-sm">{employee.full_name}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{employee.email}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{getDepartmentName(employee.department_id)}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{ROLE_LABELS[employee.role] || employee.role}</TableCell>
              <TableCell className="cursor-default">{getStatusBadge(employee.status)}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{employee.joining_date || "—"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
                      <MoreHorizontal size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 sm:w-48">
                    <DropdownMenuLabel className="cursor-default text-xs sm:text-sm">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-xs sm:text-sm"
                      onClick={() => onViewDetails(employee)}
                    >
                      <Eye size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <DesktopTableView />
        <MobileCardView />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 border-t">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} employees
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer h-7 sm:h-8 text-xs"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer h-7 sm:h-8 text-xs"
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}