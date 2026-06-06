"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Sparkles, Eye } from "lucide-react";

export default function HolidayList({ holidays, selectedYear, onViewDetails }) {
  if (holidays.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Calendar size={32} className="sm:w-12 sm:h-12 text-gray-400" />
          <p className="text-sm sm:text-base text-gray-500">No holidays found for {selectedYear}</p>
          <p className="text-xs sm:text-sm text-gray-400">Holiday calendar will appear here.</p>
        </div>
      </div>
    );
  }

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by month
  let currentMonth = "";

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {sortedHolidays.map((holiday) => {
        const date = new Date(holiday.date);
        return (
          <div
            key={holiday.id}
            className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 cursor-pointer"
            onClick={() => onViewDetails(holiday)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-[#C9A84C]" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">{holiday.name}</p>
              </div>
              {holiday.is_recurring && (
                <Badge variant="outline" className="text-[10px]">
                  <Sparkles size={10} className="mr-1 inline" />
                  Recurring
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>{date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <div className="mt-2 flex justify-end">
              <Eye size={12} className="text-gray-400" />
            </div>
          </div>
        );
      })}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="cursor-default">Holiday Name</TableHead>
            <TableHead className="cursor-default">Date</TableHead>
            <TableHead className="cursor-default">Day</TableHead>
            <TableHead className="cursor-default">Type</TableHead>
            <TableHead className="text-right cursor-default">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHolidays.map((holiday) => {
            const date = new Date(holiday.date);
            const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
            const showMonthSeparator = currentMonth !== monthYear;
            currentMonth = monthYear;
            
            return (
              <>
                {showMonthSeparator && (
                  <TableRow className="bg-gray-100/50 dark:bg-gray-800/50">
                    <TableCell colSpan={5} className="py-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#C9A84C]" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {monthYear}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/30 cursor-pointer" onClick={() => onViewDetails(holiday)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Gift size={14} className="text-[#C9A84C]" />
                      {holiday.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {date.toLocaleDateString("en-US", { weekday: "long" })}
                  </TableCell>
                  <TableCell>
                    {holiday.is_recurring ? (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <Sparkles size={12} className="mr-1" />
                        Recurring
                      </Badge>
                    ) : (
                      <Badge variant="outline">One-time</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(holiday);
                      }}
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <DesktopTableView />
      <MobileCardView />
    </div>
  );
}