"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, Gift, Sparkles } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function HolidayList({ holidays, selectedYear, onViewDetails, onEditHoliday }) {
  const { apiRequest } = useAuth();

  const handleDeleteHoliday = async (holiday) => {
    if (!confirm(`Are you sure you want to delete holiday "${holiday.name}"?`)) return;

    try {
      const response = await apiRequest(`/holidays/${holiday.id}`, { method: "DELETE" });
      if (response.status) {
        gooeyToast.success("Holiday Deleted", {
          description: `${holiday.name} has been removed.`,
        });
        window.location.reload();
      }
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    }
  };

  if (holidays.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <Calendar size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No holidays found for {selectedYear}</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Click "Add Holiday" to create one.</p>
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
            <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditHoliday(holiday);
                }}
                className="flex-1 cursor-pointer text-xs h-8"
              >
                <Edit size={12} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteHoliday(holiday);
                }}
                className="flex-1 cursor-pointer text-red-600 hover:text-red-700 text-xs h-8"
              >
                <Trash2 size={12} className="mr-1" />
                Delete
              </Button>
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
            <TableHead>Holiday Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewDetails(holiday)}>
                          <Eye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditHoliday(holiday)}>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteHoliday(holiday)} className="text-red-600">
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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