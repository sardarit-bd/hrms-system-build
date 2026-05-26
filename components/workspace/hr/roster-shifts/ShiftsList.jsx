"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
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
import { MoreHorizontal, Edit, Trash2, Clock, Timer, RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function ShiftsList({ shifts, fixedShifts, rotatingShifts, onEditShift }) {
  const { apiRequest } = useAuth();

  const handleDeleteShift = async (shift) => {
    if (!confirm(`Are you sure you want to delete shift "${shift.name}"?`)) return;

    try {
      const response = await apiRequest(`/shifts/${shift.id}`, { method: "DELETE" });
      if (response.status) {
        gooeyToast.success("Shift Deleted", {
          description: `${shift.name} has been removed.`,
        });
        window.location.reload();
      }
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    }
  };

  if (shifts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <Clock size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No shifts found</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Create a new shift to get started.</p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {shifts.map((shift) => (
        <div key={shift.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{shift.name}</p>
            <Badge variant="outline" className="text-[10px]">{shift.working_hours} hrs</Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</p>
            <p>{shift.is_fixed ? "Fixed Shift" : "Rotating Shift"}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditShift(shift)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Edit size={12} className="mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteShift(shift)}
              className="flex-1 cursor-pointer text-red-600 hover:text-red-700 text-xs h-8"
            >
              <Trash2 size={12} className="mr-1" />
              Delete
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
            <TableHead>Shift Name</TableHead>
            <TableHead>Timing</TableHead>
            <TableHead>Working Hours</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell className="font-medium">{shift.name}</TableCell>
              <TableCell>{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</TableCell>
              <TableCell>{shift.working_hours} hrs</TableCell>
              <TableCell>
                <Badge className={shift.is_fixed ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                  {shift.is_fixed ? "Fixed" : "Rotating"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEditShift(shift)}>
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteShift(shift)} className="text-red-600">
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
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