"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users, Briefcase } from "lucide-react";

export default function CurrentShiftCard({ currentRoster, shifts, fixedShifts, rotatingShifts }) {
  const hasRoster = currentRoster && currentRoster.shift;
  const shift = currentRoster?.shift;

  // Get weekend days display
  const getWeekendDisplay = (weekendDays) => {
    if (!weekendDays || weekendDays.length === 0) return "No weekend assigned";
    return weekendDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ");
  };

  // Get shift type
  const getShiftType = (shiftId) => {
    if (fixedShifts.some(s => s.id === shiftId)) return "Fixed Shift";
    if (rotatingShifts.some(s => s.id === shiftId)) return "Rotating Shift";
    return "Regular Shift";
  };

  if (!hasRoster) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock size={16} />
            Current Shift
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Clock size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No shift assigned yet</p>
            <p className="text-xs text-gray-400 mt-1">Please contact HR for shift assignment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock size={16} />
          Current Shift
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shift Name & Type */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {shift.name}
            </p>
            <Badge variant="outline" className="mt-1 cursor-default">
              {getShiftType(shift.id)}
            </Badge>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default">
            Active
          </Badge>
        </div>

        {/* Shift Timing */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div>
            <p className="text-xs text-gray-500">Start Time</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {shift.start_time?.slice(0, 5)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">End Time</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {shift.end_time?.slice(0, 5)}
            </p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-center gap-3 text-sm">
          <Briefcase size={14} className="text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Working Hours: <strong>{shift.working_hours} hours</strong>
          </span>
        </div>

        {/* Weekend Days */}
        <div className="flex items-start gap-3 text-sm">
          <Calendar size={14} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-gray-600 dark:text-gray-400">Weekend Days</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentRoster.weekend_days?.map((day) => (
                <Badge key={day} variant="secondary" className="cursor-default">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Effective From */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Effective from: {currentRoster.effective_from}
            {currentRoster.effective_to && ` to ${currentRoster.effective_to}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}