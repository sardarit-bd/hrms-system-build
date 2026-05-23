"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Clock } from "lucide-react";

export default function UpcomingHolidaysCard({ upcomingHolidays }) {
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
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Gift size={16} />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming holidays</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for holiday updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Gift size={16} />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingHolidays.map((holiday) => {
          const daysUntil = getDaysUntil(holiday.date);
          return (
            <div
              key={holiday.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                  <Calendar size={18} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {holiday.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {holiday.is_recurring && (
                      <Badge variant="outline" className="text-xs">
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${getDaysUntilColor(daysUntil)}`}>
                <Clock size={14} />
                <span>{daysUntil}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}