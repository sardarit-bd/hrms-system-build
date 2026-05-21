"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";

export default function HourLogsFilters({
  searchTerm,
  setSearchTerm,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
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
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <Input
                placeholder="Employee or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 cursor-text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="cursor-pointer h-9"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="cursor-pointer h-9"
            />
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