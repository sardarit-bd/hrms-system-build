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

export default function AttendanceFilters({
  projectFilter,
  setProjectFilter,
  teamFilter,
  setTeamFilter,
  shiftFilter,
  setShiftFilter,
  employeeFilter,
  setEmployeeFilter,
  dateFilter,
  setDateFilter,
  projects,
  teams,
  shifts,
  teamMembers,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Project Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Project</Label>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="cursor-pointer text-xs sm:text-sm">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {project.name.length > 20 ? project.name.substring(0, 17) + "..." : project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Team</Label>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="cursor-pointer text-xs sm:text-sm">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shift Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Shift</Label>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Shifts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="cursor-pointer text-xs sm:text-sm">All Shifts</SelectItem>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {shift.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Employee</Label>
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="cursor-pointer text-xs sm:text-sm">All Employees</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()} className="cursor-pointer text-xs sm:text-sm">
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="space-y-1">
            <Label className="text-[10px] sm:text-xs">Date</Label>
            <div className="relative">
              <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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
              className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm h-8 sm:h-9 w-full"
            >
              <X size={12} className="sm:w-3.5 sm:h-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}