"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Briefcase, Calendar, Shield } from "lucide-react";

export default function EmployeeDetailsModal({ open, onOpenChange, employee }) {
  if (!employee) return null;

  const getInitials = () => employee.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{employee.full_name}</DialogTitle>
              <DialogDescription>{employee.employee_code || "No code"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-500" />
              <span className="text-sm">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-500" />
              <span className="text-sm">{employee.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-gray-500" />
              <span className="text-sm">{employee.designation || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm">{employee.joining_date || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-gray-500" />
              <span className="text-sm">{employee.role}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500">Status</span>
            <Badge className={employee.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {employee.status}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}