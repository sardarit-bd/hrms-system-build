"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Timer, CheckCircle } from "lucide-react";

export default function AttendancePolicySummary({ policies }) {
  const activePolicies = policies.filter(p => p.is_active).length;

  if (policies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Shield size={18} className="sm:w-5 sm:h-5" />
            Attendance Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500 text-sm">No attendance policies available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Shield size={18} className="sm:w-5 sm:h-5" />
          Attendance Policies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <Shield size={16} className="mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{policies.length}</p>
            <p className="text-[10px] text-gray-500">Total Policies</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
            <CheckCircle size={16} className="mx-auto mb-1 text-green-600" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{activePolicies}</p>
            <p className="text-[10px] text-gray-500">Active Policies</p>
          </div>
        </div>

        {/* Policy List */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Active Policies</h4>
          <div className="space-y-2">
            {policies.filter(p => p.is_active).slice(0, 3).map((policy) => (
              <div key={policy.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{policy.name}</p>
                  <Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Timer size={10} /> Grace: {policy.grace_period_minutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}