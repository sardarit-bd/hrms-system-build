"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users } from "lucide-react";

export default function ShiftRosterSummary({ rosters, shifts }) {
  const activeRosters = rosters.filter(r => r.is_active).length;
  const totalRosters = rosters.length;

  if (shifts.length === 0 && totalRosters === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            Shift & Roster Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500 text-sm">No shift or roster data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Clock size={18} className="sm:w-5 sm:h-5" />
          Shift & Roster Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Shift Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <Clock size={16} className="mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{shifts.length}</p>
            <p className="text-[10px] text-gray-500">Total Shifts</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
            <Calendar size={16} className="mx-auto mb-1 text-green-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{activeRosters}</p>
            <p className="text-[10px] text-gray-500">Active Rosters</p>
          </div>
        </div>

        {/* Shifts List */}
        {shifts.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Available Shifts</h4>
            <div className="space-y-2">
              {shifts.slice(0, 4).map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium">{shift.name}</p>
                    <p className="text-xs text-gray-500">{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{shift.working_hours} hrs</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}