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
  { value: "", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
];

const QUARTER_OPTIONS = [
  { value: "", label: "All Quarters" },
  { value: "1", label: "Q1 (Jan-Mar)" },
  { value: "2", label: "Q2 (Apr-Jun)" },
  { value: "3", label: "Q3 (Jul-Sep)" },
  { value: "4", label: "Q4 (Oct-Dec)" },
];

const YEARS = ["2023", "2024", "2025", "2026"];

export default function PayrollFilters({
  employeeFilter,
  setEmployeeFilter,
  monthFilter,
  setMonthFilter,
  statusFilter,
  setStatusFilter,
  yearFilter,
  setYearFilter,
  quarterFilter,
  setQuarterFilter,
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
                    {emp.full_name} ({emp.employee_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="w-full sm:w-36 space-y-1">
            <Label className="text-[10px] sm:text-xs">Month</Label>
            <Input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40 space-y-1">
            <Label className="text-[10px] sm:text-xs">Status</Label>
            <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Status</SelectItem>
                {STATUS_OPTIONS.filter(opt => opt.value).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-xs sm:text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="w-full sm:w-28 space-y-1">
            <Label className="text-[10px] sm:text-xs">Year</Label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year} className="cursor-pointer text-xs sm:text-sm">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quarter Filter */}
          <div className="w-full sm:w-36 space-y-1">
            <Label className="text-[10px] sm:text-xs">Quarter</Label>
            <Select value={quarterFilter || "all"} onValueChange={(v) => setQuarterFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Quarters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Quarters</SelectItem>
                {QUARTER_OPTIONS.filter(opt => opt.value).map((opt) => (
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