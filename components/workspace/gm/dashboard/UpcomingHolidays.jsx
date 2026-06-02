"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift } from "lucide-react";

export default function UpcomingHolidays({ holidays }) {
  if (holidays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Gift size={18} className="sm:w-5 sm:h-5" />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-sm text-gray-500">No upcoming holidays</p>
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
      <CardContent className="space-y-3">
        {holidays.map((holiday) => (
          <div key={holiday.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#C9A84C]" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{holiday.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(holiday.date).toLocaleDateString()}
              </span>
              {holiday.is_recurring && (
                <Badge variant="outline" className="text-[10px]">Recurring</Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}