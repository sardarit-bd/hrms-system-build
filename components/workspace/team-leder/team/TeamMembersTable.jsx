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
import { MoreHorizontal, Eye, Briefcase, Users } from "lucide-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  general_manager: "General Manager",
  hr_manager: "HR Manager",
  project_manager: "Project Manager",
  team_leader: "Team Leader",
  employee: "Employee",
};

export default function TeamMembersTable({ team, members, onViewTeamDetails, onViewMemberDetails }) {
  const getStatusBadge = (status) => {
    return (
      <Badge className={`${STATUS_COLORS[status]} cursor-default`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
        <Users size={48} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No team members found</p>
        <p className="text-sm text-gray-400 mt-1">This team has no members yet.</p>
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
              <TableHead className="cursor-default">Email</TableHead>
              <TableHead className="cursor-default">Role</TableHead>
              <TableHead className="cursor-default">Designation</TableHead>
              <TableHead className="cursor-default">Department</TableHead>
              <TableHead className="cursor-default">Joined Date</TableHead>
              <TableHead className="cursor-default">Status</TableHead>
              <TableHead className="text-right cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <TableCell className="font-medium cursor-default">
                  {member.full_name}
                </TableCell>
                <TableCell className="cursor-default">{member.email}</TableCell>
                <TableCell className="cursor-default">
                  {ROLE_LABELS[member.role] || member.role}
                </TableCell>
                <TableCell className="cursor-default">
                  {member.designation || "—"}
                </TableCell>
                <TableCell className="cursor-default">
                  {member.department?.name || member.department || "—"}
                </TableCell>
                <TableCell className="cursor-default">
                  {member.joining_date ? new Date(member.joining_date).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="cursor-default">{getStatusBadge(member.status)}</TableCell>
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
                        onClick={() => onViewMemberDetails(member, team)}
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