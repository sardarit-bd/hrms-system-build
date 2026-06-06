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

export default function LeaveRequestFilters({
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
      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
          <div className="space-y-1 lg:col-span-2">
            <Label className="text-xs">Search Employee</Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <Input
                placeholder="Name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 cursor-text pl-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Project</Label>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-9 cursor-pointer">
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

          <div className="space-y-1">
            <Label className="text-xs">Leave Type</Label>
            <Select
              value={leaveTypeFilter}
              onValueChange={setLeaveTypeFilter}
            >
              <SelectTrigger className="h-9 cursor-pointer">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Types
                </SelectItem>

                {leaveTypes.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id.toString()}
                    className="cursor-pointer"
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Employee</Label>
            <Select
              value={employeeFilter}
              onValueChange={setEmployeeFilter}
            >
              <SelectTrigger className="h-9 cursor-pointer">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Employees
                </SelectItem>

                {employees.map((employee) => (
                  <SelectItem
                    key={employee.id}
                    value={employee.id.toString()}
                    className="cursor-pointer"
                  >
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 cursor-pointer"
            />
          </div>
        </div>

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