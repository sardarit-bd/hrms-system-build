"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Shield, Timer } from "lucide-react";

export default function RosterPolicyCard({ roster, attendancePolicy }) {
  const hasRoster = roster && roster.shift;
  const hasPolicy = attendancePolicy && attendancePolicy.name;

  if (!hasRoster && !hasPolicy) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">My Schedule & Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No roster or policy assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">My Schedule & Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Roster Info */}
        {hasRoster && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <Clock size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Current Shift</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {roster.shift?.name} ({roster.shift?.start_time} - {roster.shift?.end_time})
              </p>
              {roster.weekend_days && (
                <p className="text-xs text-gray-500 mt-1">
                  Weekend: {roster.weekend_days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Effective from: {roster.effective_from}
              </p>
            </div>
            <Badge variant="outline" className="cursor-default">Active</Badge>
          </div>
        )}

        {/* Attendance Policy Info */}
        {hasPolicy && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <Shield size={18} className="text-purple-600 dark:text-purple-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Attendance Policy</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{attendancePolicy.name}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-xs text-gray-500">
                  Grace Period: {attendancePolicy.grace_period_minutes} min
                </span>
                <span className="text-xs text-gray-500">
                  Half Day: {attendancePolicy.half_day_threshold_hours} hrs
                </span>
              </div>
            </div>
            <Badge variant="outline" className="cursor-default">Active</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}