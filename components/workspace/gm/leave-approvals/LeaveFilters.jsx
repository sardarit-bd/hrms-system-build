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
import { Search, X, Filter, Calendar } from "lucide-react";

export default function LeaveFilters({
  searchTerm,
  setSearchTerm,
  projectFilter,
  setProjectFilter,
  leaveTypeFilter,
  setLeaveTypeFilter,
  employeeFilter,
  setEmployeeFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  projects,
  leaveTypes,
  employees,
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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] space-y-1">
            <Label className="text-[10px] sm:text-xs">Search Employee</Label>
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <Input
                placeholder="Name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm cursor-text"
              />
            </div>
          </div>

          {/* Project Filter */}
          <div className="w-full sm:w-40 space-y-1">
            <Label className="text-[10px] sm:text-xs">Project</Label>
            <Select value={projectFilter || "all"} onValueChange={(v) => setProjectFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {project.name.length > 25 ? project.name.substring(0, 22) + "..." : project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Leave Type Filter */}
          <div className="w-full sm:w-40 space-y-1">
            <Label className="text-[10px] sm:text-xs">Leave Type</Label>
            <Select value={leaveTypeFilter || "all"} onValueChange={(v) => setLeaveTypeFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Types</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Filter */}
          <div className="w-full sm:w-48 space-y-1">
            <Label className="text-[10px] sm:text-xs">Employee</Label>
            <Select value={employeeFilter || "all"} onValueChange={(v) => setEmployeeFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {emp.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div className="w-full sm:w-36 space-y-1">
            <Label className="text-[10px] sm:text-xs">From Date</Label>
            <div className="relative">
              <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pl-7 h-8 sm:h-9 text-xs sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="w-full sm:w-36 space-y-1">
            <Label className="text-[10px] sm:text-xs">To Date</Label>
            <div className="relative">
              <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pl-7 h-8 sm:h-9 text-xs sm:text-sm cursor-pointer"
              />
            </div>
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