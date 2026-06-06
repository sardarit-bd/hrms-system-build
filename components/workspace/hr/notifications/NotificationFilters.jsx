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

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "leave", label: "Leave" },
  { value: "payroll", label: "Payroll" },
  { value: "project", label: "Project" },
  { value: "approval", label: "Approval" },
  { value: "attendance", label: "Attendance" },
  { value: "employee", label: "Employee" },
  { value: "policy", label: "Policy" },
];

export default function NotificationFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
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
          {/* Search */}
          <div className="flex-1 space-y-1">
            <Label className="text-[10px] sm:text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <Input
                placeholder="Search by title or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm cursor-text"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-48 space-y-1">
            <Label className="text-[10px] sm:text-xs">Type</Label>
            <Select value={typeFilter || "all"} onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs sm:text-sm">All Types</SelectItem>
                {TYPE_OPTIONS.filter(opt => opt.value).map((opt) => (
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