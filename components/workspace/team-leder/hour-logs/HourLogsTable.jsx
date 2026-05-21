"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function HourLogsTable({ hourLogs, onViewDetails, onApprove, onReject, statusFilter }) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  if (hourLogs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Clock size={48} className="text-gray-400" />
          <p className="text-gray-500">No hour logs found</p>
          <p className="text-sm text-gray-400">
            {statusFilter === "pending" 
              ? "No pending hour logs require approval."
              : statusFilter === "approved"
              ? "No approved hour logs found."
              : "No rejected hour logs found."}
          </p>
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
              <TableHead className="cursor-default">Employee</TableHead>
              <TableHead className="cursor-default">Project</TableHead>
              <TableHead className="cursor-default">Log Date</TableHead>
              <TableHead className="cursor-default">Hours Logged</TableHead>
              <TableHead className="cursor-default">Description</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
              <TableHead className="text-right cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hourLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {log.user?.full_name || "N/A"}
                  <br />
                  <span className="text-xs text-gray-500">{log.user?.employee_code || ""}</span>
                </TableCell>
                <TableCell className="cursor-default">
                  {log.project?.name || "N/A"}
                </TableCell>
                <TableCell className="cursor-default">{log.log_date}</TableCell>
                <TableCell className="cursor-default font-semibold">
                  {log.hours_logged} hrs
                </TableCell>
                <TableCell className="cursor-default max-w-[250px] truncate">
                  {log.description || "—"}
                </TableCell>
                <TableCell className="cursor-default">{getStatusBadge(log.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="cursor-default">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewDetails(log)}
                      >
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {log.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-green-600 focus:text-green-600"
                            onClick={() => onApprove(log.id)}
                          >
                            <CheckCircle size={14} className="mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => onReject(log.id)}
                          >
                            <XCircle size={14} className="mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}