"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function ProjectSummaryCard({ summary }) {
  if (!summary) return null;

  const { total_approved_hours, pending_logs_count, total_pending_hours } = summary;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
          Project Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
              <CheckCircle size={12} className="sm:w-4 sm:h-4 text-green-600" />
              <p className="text-[10px] sm:text-xs text-gray-500">Approved Hours</p>
            </div>
            <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
              {total_approved_hours || 0} hrs
            </p>
          </div>
          <div className="text-center p-2">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
              <Clock size={12} className="sm:w-4 sm:h-4 text-yellow-600" />
              <p className="text-[10px] sm:text-xs text-gray-500">Pending Logs</p>
            </div>
            <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
              {pending_logs_count || 0}
            </p>
          </div>
          <div className="text-center p-2">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
              <AlertCircle size={12} className="sm:w-4 sm:h-4 text-orange-600" />
              <p className="text-[10px] sm:text-xs text-gray-500">Pending Hours</p>
            </div>
            <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
              {total_pending_hours || 0} hrs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}