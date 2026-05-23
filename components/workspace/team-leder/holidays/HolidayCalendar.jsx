"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Gift } from "lucide-react";

export default function HolidayCalendar({ holidays, selectedYear }) {
  // Group holidays by month
  const holidaysByMonth = {};
  
  holidays.forEach((holiday) => {
    const date = new Date(holiday.date);
    const month = date.toLocaleString("default", { month: "long" });
    const monthIndex = date.getMonth();
    
    if (!holidaysByMonth[monthIndex]) {
      holidaysByMonth[monthIndex] = { name: month, holidays: [] };
    }
    holidaysByMonth[monthIndex].holidays.push(holiday);
  });

  // Sort months
  const sortedMonths = Object.keys(holidaysByMonth)
    .map(Number)
    .sort((a, b) => a - b);

  if (holidays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CalendarIcon size={16} />
            Holiday Calendar - {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <CalendarIcon size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No holidays found for {selectedYear}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarIcon size={16} />
          Holiday Calendar - {selectedYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedMonths.map((monthIndex) => {
            const monthData = holidaysByMonth[monthIndex];
            return (
              <div key={monthIndex}>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
                  {monthData.name}
                </h4>
                <div className="space-y-2">
                  {monthData.holidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                          <Gift size={14} className="text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {holiday.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(holiday.date).toLocaleDateString("en-US", {
                              day: "numeric",
                              weekday: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      {holiday.is_recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}