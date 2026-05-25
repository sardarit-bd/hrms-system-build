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
import { Filter, X, Calendar } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pending_pm", label: "Pending PM" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ReportFilters({
  projectFilter,
  setProjectFilter,
  teamFilter,
  setTeamFilter,
  employeeFilter,
  setEmployeeFilter,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  projects,
  teamMembers,
  onReset,
}) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-1 sm:mb-4 sm:gap-2">
          <Filter size={14} className="text-gray-500 sm:h-4 sm:w-4" />

          <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {/* Project Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Project</Label>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-8 cursor-pointer text-xs sm:h-9 sm:text-sm">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="all"
                  className="cursor-pointer text-xs sm:text-sm"
                >
                  All Projects
                </SelectItem>

                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id.toString()}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {project.name.length > 25
                      ? `${project.name.substring(0, 22)}...`
                      : project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Employee</Label>

            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="h-8 cursor-pointer text-xs sm:h-9 sm:text-sm">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="all"
                  className="cursor-pointer text-xs sm:text-sm"
                >
                  All Employees
                </SelectItem>

                {teamMembers.map((member) => (
                  <SelectItem
                    key={member.id}
                    value={member.id.toString()}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Status</Label>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 cursor-pointer text-xs sm:h-9 sm:text-sm">
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

          {/* Date Range - From */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">From Date</Label>

            <div className="relative">
              <Calendar
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="h-8 cursor-pointer pl-7 text-xs sm:h-9 sm:text-sm"
              />
            </div>
          </div>

          {/* Date Range - To */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">To Date</Label>

            <div className="relative">
              <Calendar
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="h-8 cursor-pointer pl-7 text-xs sm:h-9 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-3 flex justify-end sm:mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 cursor-pointer text-xs sm:h-9 sm:gap-2 sm:text-sm"
          >
            <X size={12} className="sm:h-3.5 sm:w-3.5" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}