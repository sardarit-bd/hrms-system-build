"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Timer } from "lucide-react";

export default function PolicyHistoryTable({ policyHistory }) {
  if (!policyHistory || policyHistory.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Shield size={48} className="text-gray-400" />
          <p className="text-gray-500">No policy history found</p>
          <p className="text-sm text-gray-400">Your previous attendance policies will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="cursor-default">Policy Name</TableHead>
              <TableHead className="cursor-default">Grace Period</TableHead>
              <TableHead className="cursor-default">Late Threshold</TableHead>
              <TableHead className="cursor-default">Half Day Threshold</TableHead>
              <TableHead className="cursor-default">Effective From</TableHead>
              <TableHead className="cursor-default">Effective To</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policyHistory.map((policy) => (
              <TableRow key={policy.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {policy.name}
                </TableCell>
                <TableCell className="cursor-default">
                  <div className="flex items-center gap-1">
                    <Timer size={12} className="text-gray-400" />
                    <span>{policy.grace_period_minutes} min</span>
                  </div>
                </TableCell>
                <TableCell className="cursor-default">{policy.late_count_threshold} times</TableCell>
                <TableCell className="cursor-default">{policy.half_day_threshold_hours} hrs</TableCell>
                <TableCell className="cursor-default">{policy.effective_from || "—"}</TableCell>
                <TableCell className="cursor-default">{policy.effective_to || "Current"}</TableCell>
                <TableCell className="cursor-default">
                  {policy.is_active ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="cursor-default">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}