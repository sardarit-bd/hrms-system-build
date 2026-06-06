"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Timer, RefreshCw } from "lucide-react";

export default function ShiftInfo({ shifts, fixedShifts, rotatingShifts }) {
  if (shifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            Shifts
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No shifts found</p>
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
                  <h4 className="text-sm font-medium">{shift.name}</h4>
                  <Badge variant="outline" className="text-[10px]">{shift.working_hours} hrs</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                </p>
                <p className="text-[10px] text-gray-400 mt-2">
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
            <div className="space-y-2">
              {fixedShifts.map((shift) => (
                <div key={shift.id} className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium">{shift.name}</p>
                    <p className="text-xs text-gray-500">{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-[10px]">Fixed</Badge>
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
            <div className="space-y-2">
              {rotatingShifts.map((shift) => (
                <div key={shift.id} className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium">{shift.name}</p>
                    <p className="text-xs text-gray-500">{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 text-[10px]">Rotating</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}