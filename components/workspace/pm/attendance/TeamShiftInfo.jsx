"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Timer, RefreshCw } from "lucide-react";

export default function TeamShiftInfo({ shifts, fixedShifts, rotatingShifts }) {
  if (shifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            Team Shifts
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 sm:py-12 text-center">
          <Clock size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-500">No shifts found</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">No shifts have been configured yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* All Shifts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            All Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{shift.name}</h4>
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    {shift.working_hours} hrs
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                  {shift.is_fixed ? "Fixed Shift" : "Rotating Shift"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fixed Shifts */}
      {fixedShifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
              <Timer size={18} className="sm:w-5 sm:h-5" />
              Fixed Shifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {fixedShifts.map((shift) => (
                <div key={shift.id} className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{shift.name}</p>
                    <p className="text-xs text-gray-500">
                      {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs">Fixed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rotating Shifts */}
      {rotatingShifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
              <RefreshCw size={18} className="sm:w-5 sm:h-5" />
              Rotating Shifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {rotatingShifts.map((shift) => (
                <div key={shift.id} className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{shift.name}</p>
                    <p className="text-xs text-gray-500">
                      {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs">Rotating</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}