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
import { Eye, MoreHorizontal, Users, Calendar, Shield } from "lucide-react";

export default function TeamAttendanceTable({ members, rosters, attendancePolicies, shifts, onViewDetails }) {
  const getShiftName = (memberId) => {
    const roster = rosters[memberId];
    if (!roster || !roster.shift) return "Not assigned";
    return roster.shift.name;
  };

  const getPolicyName = (memberId) => {
    const policy = attendancePolicies[memberId];
    if (!policy) return "Not assigned";
    return policy.name;
  };

  const getRosterStatus = (memberId) => {
    const roster = rosters[memberId];
    if (!roster) return "Not assigned";
    return roster.is_active ? "Active" : "Inactive";
  };

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (status === "Not assigned") return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <Users size={48} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No team members found</p>
        <p className="text-sm text-gray-400">Your team has no members yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="cursor-default">Employee Name</TableHead>
              <TableHead className="cursor-default">Shift</TableHead>
              <TableHead className="cursor-default">Attendance Policy</TableHead>
              <TableHead className="cursor-default">Roster Status</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
              <TableHead className="text-right cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {member.full_name}
                  <br />
                  <span className="text-xs text-gray-500">{member.email}</span>
                </TableCell>
                <TableCell className="cursor-default">{getShiftName(member.id)}</TableCell>
                <TableCell className="cursor-default">{getPolicyName(member.id)}</TableCell>
                <TableCell className="cursor-default">
                  <Badge className={getStatusColor(getRosterStatus(member.id))}>
                    {getRosterStatus(member.id)}
                  </Badge>
                </TableCell>
                <TableCell className="cursor-default">
                  <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="cursor-default">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewDetails(member)}
                      >
                        <Eye size={14} className="mr-2" />
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
    </div>
  );
}