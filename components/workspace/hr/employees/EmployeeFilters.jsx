"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";

const ALL_VALUE = "all";

const STATUS_OPTIONS = [
  { value: ALL_VALUE, label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "terminated", label: "Terminated" },
];

export default function EmployeeFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  departmentFilter,
  setDepartmentFilter,
  departments = [],
  roles = [],
  onReset,
}) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="space-y-1 lg:col-span-2">
            <Label className="text-[10px] sm:text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Name, email or employee code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm cursor-text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Status</Label>
            <Select
              value={statusFilter || ALL_VALUE}
              onValueChange={(value) =>
                setStatusFilter(value === ALL_VALUE ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Role</Label>
            <Select
              value={roleFilter || ALL_VALUE}
              onValueChange={(value) =>
                setRoleFilter(value === ALL_VALUE ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE} className="cursor-pointer text-xs sm:text-sm">
                  All Roles
                </SelectItem>

                {roles.map((role) => (
                  <SelectItem
                    key={role.id}
                    value={role.name}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {role.name
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Department</Label>
            <Select
              value={departmentFilter || ALL_VALUE}
              onValueChange={(value) =>
                setDepartmentFilter(value === ALL_VALUE ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE} className="cursor-pointer text-xs sm:text-sm">
                  All Departments
                </SelectItem>

                {departments.map((dept) => (
                  <SelectItem
                    key={dept.id}
                    value={dept.name}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-3 sm:mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm h-8 sm:h-9"
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}