"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Eye, History, Plus } from "lucide-react";

export default function AttendancePolicies({ policies, employees, onViewEmployeeDetails, onViewPolicyHistory, onAssignPolicy }) {
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
          <p className="text-gray-500">No attendance policies found</p>
          <Button onClick={onAssignPolicy} className="mt-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm">
            <Plus size={14} className="mr-2" />
            Assign Policy
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {policies.map((policy) => (
        <div key={policy.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{policy.name}</p>
            <Badge className={policy.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {policy.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Grace: {policy.grace_period_minutes} min</p>
            <p>Late Threshold: {policy.late_count_threshold}</p>
            <p>Half Day: {policy.half_day_threshold_hours} hrs</p>
          </div>
        </div>
      ))}
      <Button onClick={onAssignPolicy} className="w-full bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm mt-2">
        <Plus size={14} className="mr-2" />
        Assign Policy
      </Button>
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
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
      <div className="mt-4 flex justify-end">
        <Button onClick={onAssignPolicy} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm">
          <Plus size={14} className="mr-2" />
          Assign Policy to Employee
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Shield size={18} className="sm:w-5 sm:h-5" />
          Attendance Policies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DesktopTableView />
        <MobileCardView />
      </CardContent>
    </Card>
  );
}