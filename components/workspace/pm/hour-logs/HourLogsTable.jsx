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
import { Eye, MoreHorizontal, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

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
      <Badge className={`${STATUS_COLORS[status]} cursor-default text-[10px] sm:text-xs`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  if (hourLogs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-12 text-center">
        <Clock size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No hour logs found</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          {statusFilter === "pending" 
            ? "No pending hour logs require approval."
            : statusFilter === "approved"
            ? "No approved hour logs found."
            : "No rejected hour logs found."}
        </p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {hourLogs.map((log) => (
        <div key={log.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xs font-semibold">
                  {log.user?.full_name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.user?.full_name || "N/A"}
                </p>
                <p className="text-xs text-gray-500">{log.project?.name || "N/A"}</p>
              </div>
            </div>
            {getStatusBadge(log.status)}
          </div>
          <div className="space-y-1 text-xs text-gray-500 mb-3">
            <p>Date: {log.log_date}</p>
            <p>Hours: <span className="font-semibold text-gray-900 dark:text-white">{log.hours_logged} hrs</span></p>
            {log.description && <p className="truncate">Desc: {log.description}</p>}
          </div>
          <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(log)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
            {log.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove(log.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-xs h-8"
                >
                  <CheckCircle size={12} className="mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject(log.id)}
                  className="flex-1 cursor-pointer text-xs h-8"
                >
                  <XCircle size={12} className="mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="cursor-default text-xs sm:text-sm">Employee</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Project</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Log Date</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Hours Worked</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Description</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-right cursor-default text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hourLogs.map((log) => (
            <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <TableCell className="font-medium cursor-default text-xs sm:text-sm">
                {log.user?.full_name || "N/A"}
                <br />
                <span className="text-[10px] sm:text-xs text-gray-500">{log.user?.employee_code || ""}</span>
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{log.project?.name || "N/A"}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{log.log_date}</TableCell>
              <TableCell className="cursor-default font-semibold text-xs sm:text-sm">{log.hours_logged} hrs</TableCell>
              <TableCell className="cursor-default max-w-[150px] lg:max-w-[250px] truncate text-xs sm:text-sm">
                {log.description || "—"}
              </TableCell>
              <TableCell className="cursor-default">{getStatusBadge(log.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
                      <MoreHorizontal size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 sm:w-48">
                    <DropdownMenuLabel className="cursor-default text-xs sm:text-sm">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-xs sm:text-sm"
                      onClick={() => onViewDetails(log)}
                    >
                      <Eye size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {log.status === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-green-600 focus:text-green-600 text-xs sm:text-sm"
                          onClick={() => onApprove(log.id)}
                        >
                          <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600 text-xs sm:text-sm"
                          onClick={() => onReject(log.id)}
                        >
                          <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
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
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <DesktopTableView />
      <MobileCardView />
    </div>
  );
}