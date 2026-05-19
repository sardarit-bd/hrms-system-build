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
import { Eye, MoreHorizontal, Printer, DollarSign } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const STATUS_LABELS = {
  draft: "Draft",
  approved: "Approved",
  paid: "Paid",
};

export default function PayrollTable({ payrollRecords, onViewDetails, onPrintPayslip }) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  if (payrollRecords.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <DollarSign size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500">No payroll records found</p>
          <p className="text-sm text-gray-400">Your salary records will appear here once processed.</p>
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
              <TableHead className="cursor-default">Payroll Month</TableHead>
              <TableHead className="cursor-default">Gross Salary</TableHead>
              <TableHead className="cursor-default">Net Salary</TableHead>
              <TableHead className="cursor-default">Deductions</TableHead>
              <TableHead className="cursor-default">Present</TableHead>
              <TableHead className="cursor-default">Absent</TableHead>
              <TableHead className="cursor-default">Late Count</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
              <TableHead className="text-right cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollRecords.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {record.payroll_month}
                </TableCell>
                <TableCell className="cursor-default">
                  ৳{record.gross_salary?.toLocaleString()}
                </TableCell>
                <TableCell className="cursor-default font-semibold text-green-600 dark:text-green-400">
                  ৳{record.net_salary?.toLocaleString()}
                </TableCell>
                <TableCell className="cursor-default text-red-600 dark:text-red-400">
                  ৳{(record.total_deductions || 0).toLocaleString()}
                </TableCell>
                <TableCell className="cursor-default">{record.days_present || "—"}</TableCell>
                <TableCell className="cursor-default">{record.days_absent || "—"}</TableCell>
                <TableCell className="cursor-default">{record.late_count || "—"}</TableCell>
                <TableCell className="cursor-default">{getStatusBadge(record.payroll_status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel className="cursor-default">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewDetails(record)}
                      >
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {record.payroll_status === "paid" && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onPrintPayslip(record)}
                        >
                          <Printer size={14} className="mr-2" />
                          Print Payslip
                        </DropdownMenuItem>
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