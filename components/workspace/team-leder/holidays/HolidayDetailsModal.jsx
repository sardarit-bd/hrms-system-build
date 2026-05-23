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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
              <Gift size={24} className="text-[#C9A84C]" />
            </div>
            <div>
              <DialogTitle className="text-lg">{holiday.name}</DialogTitle>
              <DialogDescription>
                Holiday Details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Info */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Date</span>
            </div>
            <p className="text-gray-900 dark:text-white">
              {getFormattedDate(holiday.date)}
            </p>
          </div>

          <Separator />

          {/* Holiday Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
            </div>
            {holiday.is_recurring ? (
              <Badge className="bg-purple-100 text-purple-700">
                Recurring (Every Year)
              </Badge>
            ) : (
              <Badge variant="outline">One-time Holiday</Badge>
            )}
          </div>

          {/* Year Info for recurring */}
          {holiday.is_recurring && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Observance</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Celebrated annually on this date
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            </div>
            <Badge className="bg-green-100 text-green-700">
              {new Date(holiday.date) > new Date() ? "Upcoming" : "Passed"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}