"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Gift, Sparkles, Clock } from "lucide-react";

export default function HolidayDetailsModal({ open, onOpenChange, holiday }) {
  if (!holiday) return null;

  const getFormattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = new Date(holiday.date) > new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
              <Gift size={20} className="sm:w-6 sm:h-6 text-[#C9A84C]" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">{holiday.name}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Holiday Details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Date Info */}
          <div className="p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Calendar size={14} className="sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm font-medium">Date</span>
            </div>
            <p className="text-sm sm:text-base text-gray-900 dark:text-white">
              {getFormattedDate(holiday.date)}
            </p>
          </div>

          <Separator />

          {/* Holiday Type */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Type</span>
            </div>
            {holiday.is_recurring ? (
              <Badge className="bg-purple-100 text-purple-700 text-xs sm:text-sm">
                Recurring (Every Year)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs sm:text-sm">One-time Holiday</Badge>
            )}
          </div>

          {/* Year Info for recurring */}
          {holiday.is_recurring && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="sm:w-4 sm:h-4 text-gray-500" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Observance</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Celebrated annually on this date
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Status</span>
            </div>
            <Badge className={isUpcoming ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {isUpcoming ? "Upcoming" : "Passed"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}