"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Timer, AlertCircle, Clock } from "lucide-react";

export default function AttendancePolicyInfo({ teamMembers, attendancePolicies }) {
  const assignedPolicies = Object.keys(attendancePolicies).length;
  const activePolicies = Object.values(attendancePolicies).filter(p => p.is_active).length;

  // Group policies by name
  const policyGroups = {};
  Object.values(attendancePolicies).forEach(policy => {
    if (!policyGroups[policy.name]) {
      policyGroups[policy.name] = [];
    }
    policyGroups[policy.name].push(policy);
  });

  if (assignedPolicies === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Shield size={16} />
            Attendance Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Shield size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No attendance policies assigned</p>
          <p className="text-xs text-gray-400 mt-1">No team members have attendance policies assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Policies Assigned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignedPolicies}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Shield size={18} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePolicies}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <AlertCircle size={18} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Timer size={16} />
            Policy Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(policyGroups).map(([policyName, policies]) => (
            <div key={policyName} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{policyName}</h4>
                <Badge variant="outline">{policies.length} members</Badge>
              </div>
              {policies[0] && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Grace Period</p>
                    <p className="font-medium">{policies[0].grace_period_minutes} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Late Threshold</p>
                    <p className="font-medium">{policies[0].late_count_threshold} times</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Half Day Threshold</p>
                    <p className="font-medium">{policies[0].half_day_threshold_hours} hrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Absent Deduction</p>
                    <p className="font-medium">{policies[0].absent_deduction_per_day} day(s)</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}