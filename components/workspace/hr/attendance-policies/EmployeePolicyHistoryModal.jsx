"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function EmployeePolicyHistoryModal({ open, onOpenChange, employee, history }) {
  if (!employee) return null;

  const historyList = history || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Policy History - {employee.full_name}</DialogTitle>
          <DialogDescription>Previous attendance policy assignments for this employee</DialogDescription>
        </DialogHeader>

        {historyList.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No policy history found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Grace Period</TableHead>
                  <TableHead>Late Threshold</TableHead>
                  <TableHead>Effective From</TableHead>
                  <TableHead>Effective To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.grace_period_minutes} min</TableCell>
                    <TableCell>{item.late_count_threshold} times</TableCell>
                    <TableCell>{item.effective_from}</TableCell>
                    <TableCell>{item.effective_to || "Current"}</TableCell>
                    <TableCell>
                      <Badge className={item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}