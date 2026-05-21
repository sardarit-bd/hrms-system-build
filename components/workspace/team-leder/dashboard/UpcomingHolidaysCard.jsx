"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Calendar } from "lucide-react";

export default function UpcomingHolidaysCard({ holidays }) {
  if (holidays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Gift size={16} />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">No upcoming holidays</p>
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
        {holidays.slice(0, 4).map((holiday) => (
          <div key={holiday.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#C9A84C]" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{holiday.name}</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(holiday.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}