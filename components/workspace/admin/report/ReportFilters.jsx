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
import { Filter, X } from "lucide-react";

export default function ReportFilters({
  dateRange,
  setDateRange,
  selectedDepartment,
  setSelectedDepartment,
  selectedEmployee,
  setSelectedEmployee,
  selectedStatus,
  setSelectedStatus,
  selectedProject,
  setSelectedProject,
  departments,
  users,
  projects,
  onReset,
}) {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "ongoing", label: "Ongoing" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Date Range - From */}
          <div className="space-y-1">
            <Label className="text-xs">From Date</Label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="cursor-pointer h-9"
            />
          </div>

          {/* Date Range - To */}
          <div className="space-y-1">
            <Label className="text-xs">To Date</Label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="cursor-pointer h-9"
            />
          </div>

          {/* Department Filter */}
          <div className="space-y-1">
            <Label className="text-xs">Department</Label>
            <Select
              value={selectedDepartment || "all"}
              onValueChange={(value) =>
                setSelectedDepartment(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-9">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Departments
                </SelectItem>
                {departments.map((dept) => (
                  <SelectItem
                    key={dept.id}
                    value={dept.name}
                    className="cursor-pointer"
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Filter */}
          <div className="space-y-1">
            <Label className="text-xs">Employee</Label>
            <Select
              value={selectedEmployee || "all"}
              onValueChange={(value) =>
                setSelectedEmployee(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-9">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Employees
                </SelectItem>
                {users.slice(0, 50).map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id.toString()}
                    className="cursor-pointer"
                  >
                    {user.full_name} ({user.employee_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) =>
                setSelectedStatus(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Filter */}
          <div className="space-y-1">
            <Label className="text-xs">Project</Label>
            <Select
              value={selectedProject || "all"}
              onValueChange={(value) =>
                setSelectedProject(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-9">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Projects
                </SelectItem>
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id.toString()}
                    className="cursor-pointer"
                  >
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2 cursor-pointer"
          >
            <X size={14} />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
