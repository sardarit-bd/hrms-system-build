"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift } from "lucide-react";

export default function UpcomingHolidays({ holidays }) {
  if (holidays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Gift size={16} />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-4">No upcoming holidays.</p>
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
      <CardContent className="space-y-3">
        {holidays.map((holiday) => (
          <div key={holiday.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                <Calendar size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{holiday.name}</p>
                <p className="text-xs text-gray-500">{holiday.date}</p>
              </div>
            </div>
            {holiday.is_recurring && (
              <span className="text-xs text-gray-400">Recurring</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}