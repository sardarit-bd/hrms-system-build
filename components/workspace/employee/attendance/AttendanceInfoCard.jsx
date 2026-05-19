"use client";

import { AlertCircle, Info } from "lucide-react";

export default function AttendanceInfoCard() {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Attendance Records API Information
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Daily check-in/out records API is not available yet. Currently connected: 
            Shifts, Roster assignments, Attendance policies, and history tracking.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
            ✅ You can view your current shift schedule, roster history, and attendance policies.
          </p>
        </div>
      </div>
    </div>
  );
}