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
import { MoreHorizontal, Eye, Calendar, Plus, History } from "lucide-react";

export default function RosterAssignments({ rosters, shifts, employees, onViewEmployeeDetails, onViewRosterHistory, onAssignRoster }) {
  const getEmployeeName = (userId) => {
    const emp = employees.find(e => e.id === userId);
    return emp?.full_name || "N/A";
  };

  const getShiftName = (shiftId) => {
    const shift = shifts.find(s => s.id === shiftId);
    return shift?.name || "N/A";
  };

  if (rosters.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Calendar size={32} className="text-gray-400" />
          <p className="text-sm sm:text-base text-gray-500">No roster assignments found</p>
          <Button onClick={onAssignRoster} className="mt-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-sm">
            <Plus size={14} className="mr-2" />
            Assign Roster
          </Button>
        </div>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {rosters.map((roster) => (
        <div key={roster.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{getEmployeeName(roster.user_id)}</p>
            <Badge className={roster.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {roster.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Shift: {getShiftName(roster.shift_id)}</p>
            <p>Weekend: {roster.weekend_days?.join(", ") || "None"}</p>
            <p>Effective: {roster.effective_from}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewEmployeeDetails(employees.find(e => e.id === roster.user_id))}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewRosterHistory(employees.find(e => e.id === roster.user_id))}
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <History size={12} className="mr-1" />
              History
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
            <TableHead>Employee</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Weekend Days</TableHead>
            <TableHead>Effective From</TableHead>
            <TableHead>Effective To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rosters.map((roster) => (
            <TableRow key={roster.id}>
              <TableCell className="font-medium">{getEmployeeName(roster.user_id)}</TableCell>
              <TableCell>{getShiftName(roster.shift_id)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {roster.weekend_days?.map((day) => (
                    <Badge key={day} variant="outline" className="text-[10px]">
                      {day}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{roster.effective_from}</TableCell>
              <TableCell>{roster.effective_to || "Current"}</TableCell>
              <TableCell>
                <Badge className={roster.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {roster.is_active ? "Active" : "Inactive"}
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
                    <DropdownMenuItem onClick={() => onViewEmployeeDetails(employees.find(e => e.id === roster.user_id))}>
                      <Eye size={14} className="mr-2" />
                      View Employee
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewRosterHistory(employees.find(e => e.id === roster.user_id))}>
                      <History size={14} className="mr-2" />
                      View History
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
      <div className="p-3 sm:p-4 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Roster Assignments</h3>
        <Button onClick={onAssignRoster} size="sm" className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-xs">
          <Plus size={14} className="mr-1" />
          Assign Roster
        </Button>
      </div>
      <DesktopTableView />
      <MobileCardView />
    </div>
  );
}