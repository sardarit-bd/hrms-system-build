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
import { CalendarDays, Clock } from "lucide-react";

export default function RosterHistoryTable({ rosterHistory }) {
  if (!rosterHistory || rosterHistory.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <CalendarDays size={48} className="text-gray-400" />
          <p className="text-gray-500">No roster history found</p>
          <p className="text-sm text-gray-400">Your previous roster assignments will appear here.</p>
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
              <TableHead className="cursor-default">Shift Name</TableHead>
              <TableHead className="cursor-default">Timing</TableHead>
              <TableHead className="cursor-default">Weekend Days</TableHead>
              <TableHead className="cursor-default">Effective From</TableHead>
              <TableHead className="cursor-default">Effective To</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rosterHistory.map((roster) => (
              <TableRow key={roster.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {roster.shift?.name || "N/A"}
                </TableCell>
                <TableCell className="cursor-default">
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-sm">
                      {roster.shift?.start_time?.slice(0, 5)} - {roster.shift?.end_time?.slice(0, 5)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="cursor-default">
                  <div className="flex flex-wrap gap-1">
                    {roster.weekend_days?.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs cursor-default">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="cursor-default">{roster.effective_from || "—"}</TableCell>
                <TableCell className="cursor-default">{roster.effective_to || "Current"}</TableCell>
                <TableCell className="cursor-default">
                  {roster.is_active ? (
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