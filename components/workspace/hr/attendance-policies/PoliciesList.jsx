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
import { MoreHorizontal, Edit, Trash2, Eye, Shield } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function PoliciesList({ policies, onEditPolicy, onViewDetails }) {
  const { apiRequest } = useAuth();

  const handleDeletePolicy = async (policy) => {
    if (!confirm(`Are you sure you want to delete policy "${policy.name}"?`)) return;

    try {
      const response = await apiRequest(`/attendance/policies/${policy.id}`, { method: "DELETE" });
      if (response.status) {
        gooeyToast.success("Policy Deleted", {
          description: `${policy.name} has been removed.`,
        });
        window.location.reload();
      }
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    }
  };

  if (policies.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <Shield size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No attendance policies found</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Create a new policy to get started.</p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {policies.map((policy) => (
        <div key={policy.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{policy.name}</p>
            <Badge className={policy.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {policy.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Grace: {policy.grace_period_minutes} min</p>
            <p>Late Threshold: {policy.late_count_threshold} times</p>
            <p>Half Day: {policy.half_day_threshold_hours} hrs</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(policy)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditPolicy(policy)}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Edit size={12} className="mr-1" />
              Edit
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
            <TableHead>Policy Name</TableHead>
            <TableHead>Grace Period</TableHead>
            <TableHead>Late Threshold</TableHead>
            <TableHead>Half Day Threshold</TableHead>
            <TableHead>Effective From</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.name}</TableCell>
              <TableCell>{policy.grace_period_minutes} min</TableCell>
              <TableCell>{policy.late_count_threshold} times</TableCell>
              <TableCell>{policy.half_day_threshold_hours} hrs</TableCell>
              <TableCell>{policy.effective_from}</TableCell>
              <TableCell>
                <Badge className={policy.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {policy.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewDetails(policy)}>
                      <Eye size={14} className="mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditPolicy(policy)}>
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeletePolicy(policy)} className="text-red-600">
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