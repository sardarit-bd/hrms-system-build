"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Clock, Eye } from "lucide-react";

export default function UpcomingHolidaysCard({ upcomingHolidays, onViewDetails }) {
  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Passed";
    return `${diffDays} days left`;
  };

  const getDaysUntilColor = (daysUntil) => {
    if (daysUntil === "Today") return "text-red-600";
    if (daysUntil === "Tomorrow") return "text-orange-600";
    if (daysUntil === "Passed") return "text-gray-400";
    return "text-green-600";
  };

  if (upcomingHolidays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Gift size={18} className="sm:w-5 sm:h-5" />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 sm:py-12 text-center">
          <Calendar size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-500">No upcoming holidays</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Add holidays to see them here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Gift size={18} className="sm:w-5 sm:h-5" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {upcomingHolidays.map((holiday) => {
          const daysUntil = getDaysUntil(holiday.date);
          return (
            <div
              key={holiday.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              onClick={() => onViewDetails(holiday)}
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {holiday.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {holiday.is_recurring && (
                      <Badge variant="outline" className="text-[10px] sm:text-xs">
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${getDaysUntilColor(daysUntil)}`}>
                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{daysUntil}</span>
                <Eye size={12} className="ml-2 sm:ml-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}