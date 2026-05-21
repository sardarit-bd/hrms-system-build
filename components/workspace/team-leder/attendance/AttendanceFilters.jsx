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

export default function AttendanceFilters({
  searchTerm,
  setSearchTerm,
  shiftFilter,
  setShiftFilter,
  employeeFilter,
  setEmployeeFilter,
  shifts = [],
  teamMembers = [],
  onReset,
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
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
                className="pl-9 h-9 cursor-text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Shift</Label>
            <Select
              value={shiftFilter || "all-shifts"}
              onValueChange={(value) =>
                setShiftFilter(value === "all-shifts" ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-9">
                <SelectValue placeholder="All Shifts" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all-shifts" className="cursor-pointer">
                  All Shifts
                </SelectItem>

                {shifts.map((shift) => (
                  <SelectItem
                    key={shift.id}
                    value={shift.id.toString()}
                    className="cursor-pointer"
                  >
                    {shift.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Employee</Label>
            <Select
              value={employeeFilter || "all-employees"}
              onValueChange={(value) =>
                setEmployeeFilter(value === "all-employees" ? "" : value)
              }
            >
              <SelectTrigger className="cursor-pointer h-9">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all-employees" className="cursor-pointer">
                  All Employees
                </SelectItem>

                {teamMembers.map((member) => (
                  <SelectItem
                    key={member.id}
                    value={member.id.toString()}
                    className="cursor-pointer"
                  >
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2 cursor-pointer h-9"
            >
              <X size={14} />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}