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

export default function HourLogsFilters({
  searchTerm,
  setSearchTerm,
  projectFilter,
  setProjectFilter,
  employeeFilter,
  setEmployeeFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  projects,
  employees,
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
          {/* Search */}
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-[10px] sm:text-xs">
              Search Employee
            </Label>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 sm:left-3 sm:h-4 sm:w-4" />

              <Input
                placeholder="Name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 cursor-text pl-7 text-xs sm:h-9 sm:pl-9 sm:text-sm"
              />
            </div>
          </div>

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
                    {project.name.length > 20
                      ? `${project.name.substring(0, 20)}...`
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

                {employees.map((employee) => (
                  <SelectItem
                    key={employee.id}
                    value={employee.id.toString()}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">From Date</Label>

            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-8 cursor-pointer text-xs sm:h-9 sm:text-sm"
            />
          </div>

          {/* To Date */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">To Date</Label>

            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-8 cursor-pointer text-xs sm:h-9 sm:text-sm"
            />
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