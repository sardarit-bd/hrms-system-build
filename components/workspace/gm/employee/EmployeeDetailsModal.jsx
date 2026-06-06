"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  User,
} from "lucide-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  terminated: "bg-red-100 text-red-700",
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

export default function EmployeeDetailsModal({
  open,
  onOpenChange,
  employee,
  departments,
}) {
  if (!employee) return null;

  const getInitials = () => {
    return employee.full_name?.charAt(0).toUpperCase() || "U";
  };

  const getDepartmentName = () => {
    const dept = departments.find((d) => d.id === employee.department_id);
    return dept?.name || employee.department || "—";
  };

  const getRoleLabel = () => {
    return ROLE_LABELS[employee.role] || employee.role;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-base sm:text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-base sm:text-lg">
                {employee.full_name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {employee.employee_code || "No employee code"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Email</p>
                <p className="text-xs sm:text-sm">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Phone</p>
                <p className="text-xs sm:text-sm">{employee.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Department</p>
                <p className="text-xs sm:text-sm">{getDepartmentName()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Designation</p>
                <p className="text-xs sm:text-sm">
                  {employee.designation || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Role</p>
                <p className="text-xs sm:text-sm">{getRoleLabel()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Joining Date</p>
                <p className="text-xs sm:text-sm">
                  {employee.joining_date || "—"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Account Status
              </span>
            </div>
            <Badge className={STATUS_COLORS[employee.status]}>
              {employee.status?.charAt(0).toUpperCase() +
                employee.status?.slice(1)}
            </Badge>
          </div>

          {/* Employee Code */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Employee Code
              </span>
            </div>
            <span className="text-xs font-mono">
              {employee.employee_code || "—"}
            </span>
          </div>

          {/* Created At */}
          {employee.created_at && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Created At
                </span>
              </div>

              <span className="text-xs">
                {new Date(employee.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
