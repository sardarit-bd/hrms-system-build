"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export default function AttendancePolicyReports({ policies }) {
  const activePolicies = policies.filter(p => p.is_active).length;
  const inactivePolicies = policies.filter(p => !p.is_active).length;

  if (policies.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No attendance policy data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
          <CheckCircle size={16} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{activePolicies}</p>
          <p className="text-[10px] text-gray-500">Active Policies</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
          <XCircle size={16} className="mx-auto mb-1 text-gray-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{inactivePolicies}</p>
          <p className="text-[10px] text-gray-500">Inactive Policies</p>
        </div>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Shield size={18} />
            Attendance Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Grace Period</TableHead>
                  <TableHead>Late Threshold</TableHead>
                  <TableHead>Half Day Threshold</TableHead>
                  <TableHead>Effective From</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.name}</TableCell>
                    <TableCell>{policy.grace_period_minutes} min</TableCell>
                    <TableCell>{policy.late_count_threshold} times</TableCell>
                    <TableCell>{policy.half_day_threshold_hours} hrs</TableCell>
                    <TableCell>{policy.effective_from}</TableCell>
                    <TableCell>
                      <Badge className={policy.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {policy.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}