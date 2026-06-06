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
import { Loader2, UserCheck, UserX } from "lucide-react";

export default function StatusChangeDialog({ open, onOpenChange, employee, newStatus, onConfirm, loading }) {
  if (!employee) return null;

  const isActivate = newStatus === "active";
  const statusLabel = isActivate ? "Activate" : "Deactivate";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isActivate ? <UserCheck size={20} className="text-green-600" /> : <UserX size={20} className="text-red-600" />}
            <DialogTitle className="text-base sm:text-lg">{statusLabel} Employee</DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            Are you sure you want to {statusLabel.toLowerCase()} {employee.full_name}?
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <p className="text-sm">
            <span className="font-medium">Employee:</span> {employee.full_name}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Current Status:</span> {employee.status}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">New Status:</span> {newStatus}
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer w-full sm:w-auto text-sm">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} className={`cursor-pointer w-full sm:w-auto text-sm ${isActivate ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {statusLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}