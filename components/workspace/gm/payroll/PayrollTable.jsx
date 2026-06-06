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
import { MoreHorizontal, Eye, CheckCircle, CreditCard, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

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

export default function PayrollTable({
  payrollRecords,
  currentPage,
  setCurrentPage,
  total,
  perPage,
  totalPages,
  employees,
  onViewDetails,
  onApprovePayroll,
  onMarkAsPaid,
  statusFilter,
}) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default text-[10px] sm:text-xs`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  const getEmployeeName = (userId) => {
    const emp = employees.find(e => e.id === userId);
    return emp?.full_name || "N/A";
  };

  if (payrollRecords.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <DollarSign size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No payroll records found</p>
        <p className="text-xs sm:text-sm text-gray-400">
          {statusFilter === "draft" 
            ? "No draft payroll records available."
            : statusFilter === "approved"
            ? "No approved payroll records found."
            : statusFilter === "paid"
            ? "No paid payroll records found."
            : "Adjust your filters to see results."}
        </p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {payrollRecords.map((record) => (
        <div key={record.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium">{getEmployeeName(record.user_id)}</p>
              <p className="text-xs text-gray-500">{record.payroll_month}</p>
            </div>
            {getStatusBadge(record.payroll_status)}
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Net Salary: ৳{record.net_salary?.toLocaleString()}</p>
            <p>Gross: ৳{record.gross_salary?.toLocaleString()}</p>
            <p>Deductions: ৳{record.total_deductions?.toLocaleString()}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(record)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View Details
            </Button>
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
            <TableHead className="cursor-default text-xs sm:text-sm">Payroll Month</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Gross Salary</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Net Salary</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Deductions</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Present Days</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Absent Days</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-right cursor-default text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRecords.map((record) => (
            <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <TableCell className="font-medium cursor-default text-xs sm:text-sm">
                {getEmployeeName(record.user_id)}
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{record.payroll_month}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">৳{record.gross_salary?.toLocaleString()}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm font-semibold text-green-600">
                ৳{record.net_salary?.toLocaleString()}
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm text-red-600">
                ৳{record.total_deductions?.toLocaleString()}
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{record.days_present || "—"}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{record.days_absent || "—"}</TableCell>
              <TableCell className="cursor-default">{getStatusBadge(record.payroll_status)}</TableCell>
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
                      onClick={() => onViewDetails(record)}
                    >
                      <Eye size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {record.payroll_status === "draft" && (
                      <DropdownMenuItem
                        className="cursor-pointer text-green-600 focus:text-green-600 text-xs sm:text-sm"
                        onClick={() => onApprovePayroll(record)}
                      >
                        <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                        Approve Payroll
                      </DropdownMenuItem>
                    )}
                    {record.payroll_status === "approved" && (
                      <DropdownMenuItem
                        className="cursor-pointer text-blue-600 focus:text-blue-600 text-xs sm:text-sm"
                        onClick={() => onMarkAsPaid(record)}
                      >
                        <CreditCard size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                        Mark as Paid
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
  );

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <DesktopTableView />
        <MobileCardView />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 border-t">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer h-7 sm:h-8 text-xs"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer h-7 sm:h-8 text-xs"
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}