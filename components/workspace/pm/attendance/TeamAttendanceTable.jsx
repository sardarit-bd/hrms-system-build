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
import { Eye, MoreHorizontal, Calendar, Shield, Users } from "lucide-react";

export default function TeamAttendanceTable({ members, projects, rosters, attendancePolicies, shifts, onViewDetails }) {
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "—";
  };

  const getShiftName = (memberId) => {
    const roster = rosters[memberId];
    if (!roster || !roster.shift) return "Not assigned";
    return roster.shift.name;
  };

  const getRosterStatus = (memberId) => {
    const roster = rosters[memberId];
    if (!roster) return "Not assigned";
    return roster.is_active ? "Active" : "Inactive";
  };

  const getPolicyName = (memberId) => {
    const policy = attendancePolicies[memberId];
    if (!policy) return "Not assigned";
    return policy.name;
  };

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (status === "Not assigned") return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <Users size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
        <p className="text-sm sm:text-base text-gray-500">No team members found</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Your team has no members yet.</p>
      </div>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {members.map((member) => (
        <div key={member.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{member.full_name}</p>
              <p className="text-xs text-gray-500">{member.email}</p>
            </div>
            <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {member.status}
            </Badge>
          </div>
          <div className="space-y-1 text-xs">
            <p>Project: {getProjectName(member.project_id)}</p>
            <p>Shift: {getShiftName(member.id)}</p>
            <p>Roster: <Badge className={getStatusColor(getRosterStatus(member.id))}>{getRosterStatus(member.id)}</Badge></p>
            <p>Policy: {getPolicyName(member.id)}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(member)}
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
            <TableHead className="cursor-default text-xs sm:text-sm">Employee Name</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Project</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Shift</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Roster Status</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Attendance Policy</TableHead>
            <TableHead className="cursor-default text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-right cursor-default text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <TableCell className="font-medium cursor-default text-xs sm:text-sm">
                {member.full_name}
                <br />
                <span className="text-[10px] sm:text-xs text-gray-500">{member.email}</span>
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{getProjectName(member.project_id)}</TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{getShiftName(member.id)}</TableCell>
              <TableCell className="cursor-default">
                <Badge className={getStatusColor(getRosterStatus(member.id))}>
                  {getRosterStatus(member.id)}
                </Badge>
              </TableCell>
              <TableCell className="cursor-default text-xs sm:text-sm">{getPolicyName(member.id)}</TableCell>
              <TableCell className="cursor-default">
                <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
                </Badge>
              </TableCell>
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
                      onClick={() => onViewDetails(member)}
                    >
                      <Eye size={12} className="sm:w-3.5 sm:h-3.5 mr-2" />
                      View Details
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