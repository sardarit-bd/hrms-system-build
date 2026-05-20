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
import { Calendar, Gift, Sparkles } from "lucide-react";

export default function HolidayList({ holidays }) {
  if (holidays.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Calendar size={48} className="text-gray-400" />
          <p className="text-gray-500">No holidays found</p>
          <p className="text-sm text-gray-400">Holiday calendar will appear here.</p>
        </div>
      </div>
    );
  }

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by month for visual separation
  let currentMonth = "";

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="cursor-default">Holiday Name</TableHead>
              <TableHead className="cursor-default">Date</TableHead>
              <TableHead className="cursor-default">Day</TableHead>
              <TableHead className="cursor-default">Type</TableHead>
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
                      <TableCell colSpan={4} className="py-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#C9A84C]" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {monthYear}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <TableCell className="font-medium cursor-default">
                      <div className="flex items-center gap-2">
                        <Gift size={14} className="text-[#C9A84C]" />
                        {holiday.name}
                      </div>
                    </TableCell>
                    <TableCell className="cursor-default">
                      {date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="cursor-default">
                      {date.toLocaleDateString("en-US", { weekday: "long" })}
                    </TableCell>
                    <TableCell className="cursor-default">
                      {holiday.is_recurring ? (
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 cursor-default">
                          <Sparkles size={12} className="mr-1" />
                          Recurring
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="cursor-default">
                          One-time
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}