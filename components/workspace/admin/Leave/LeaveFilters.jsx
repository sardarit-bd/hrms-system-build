"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending_pm", label: "Pending PM" },
  { value: "pending_gm", label: "Pending GM" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function LeaveFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  leaveTypeFilter,
  setLeaveTypeFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  leaveTypes,
  onReset,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search by employee name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 cursor-text border border-gray-200"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="cursor-pointer border border-gray-200">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
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

        {/* Leave Type Filter */}
        <Select
          value={leaveTypeFilter || "all"}
          onValueChange={(value) =>
            setLeaveTypeFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="cursor-pointer border border-gray-200">
            <SelectValue placeholder="All Leave Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All Leave Types
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

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 cursor-pointer border border-gray-200"
        >
          <X size={14} />
          Reset Filters
        </Button>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          placeholder="From Date"
          className="cursor-pointer border border-gray-200"
        />
        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          placeholder="To Date"
          className="cursor-pointer border border-gray-200"
        />
      </div>
    </div>
  );
}
