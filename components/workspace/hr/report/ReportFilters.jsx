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
import { Calendar, X, Filter } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ReportFilters({
  dateRange,
  setDateRange,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments,
  onReset,
}) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
          <Filter size={14} className="sm:w-4 sm:h-4 text-gray-500" />
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Date Range - From */}
          <div className="flex-1 space-y-1">
            <Label className="text-[10px] sm:text-xs">From Date</Label>
            <div className="relative">
              <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="pl-7 h-8 sm:h-9 text-xs sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Date Range - To */}
          <div className="flex-1 space-y-1">
            <Label className="text-[10px] sm:text-xs">To Date</Label>
            <div className="relative">
              <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="pl-7 h-8 sm:h-9 text-xs sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="w-full sm:w-48 space-y-1">
            <Label className="text-[10px] sm:text-xs">Department</Label>
            <Select value={departmentFilter || "all"} onValueChange={(v) => setDepartmentFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name} className="cursor-pointer text-xs sm:text-sm">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48 space-y-1">
            <Label className="text-[10px] sm:text-xs">Status</Label>
            <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-xs sm:text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm h-8 sm:h-9"
            >
              <X size={12} className="sm:w-3.5 sm:h-3.5" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}