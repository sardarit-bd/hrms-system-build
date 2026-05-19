"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Timer, AlertCircle, Clock } from "lucide-react";

export default function CurrentPolicyCard({ currentPolicy }) {
  if (!currentPolicy || !currentPolicy.name) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Shield size={16} />
            Attendance Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Shield size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No attendance policy assigned</p>
            <p className="text-xs text-gray-400 mt-1">Please contact HR for policy assignment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Shield size={16} />
          Attendance Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Policy Name & Status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {currentPolicy.name}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default">
            Active
          </Badge>
        </div>

        {/* Policy Rules Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <Timer size={16} className="mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Grace Period</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentPolicy.grace_period_minutes} min
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <AlertCircle size={16} className="mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Late Threshold</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentPolicy.late_count_threshold} times
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <Clock size={16} className="mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Half Day Threshold</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentPolicy.half_day_threshold_hours} hrs
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <AlertCircle size={16} className="mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Absent Deduction</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentPolicy.absent_deduction_per_day} day(s)
            </p>
          </div>
        </div>

        {/* Late Deduction Info */}
        {currentPolicy.late_threshold_deduction_days > 0 && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ Exceeding late threshold will result in{" "}
              {currentPolicy.late_threshold_deduction_days} day deduction
            </p>
          </div>
        )}

        {/* Effective From */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Effective from: {currentPolicy.effective_from}
            {currentPolicy.effective_to && ` to ${currentPolicy.effective_to}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}