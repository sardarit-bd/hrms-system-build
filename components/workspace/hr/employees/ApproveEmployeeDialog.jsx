"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

export default function ApproveEmployeeDialog({ open, onOpenChange, employee, onConfirm, loading }) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            <DialogTitle className="text-base sm:text-lg">Approve Employee</DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            Are you sure you want to approve {employee.full_name}?
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <p className="text-sm">
            <span className="font-medium">Employee:</span> {employee.full_name}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Email:</span> {employee.email}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Current Status:</span> {employee.status}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">After Approval:</span> Active
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer w-full sm:w-auto text-sm">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="bg-green-600 hover:bg-green-700 cursor-pointer w-full sm:w-auto text-sm">
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Approve Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}