"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Mail, Briefcase } from "lucide-react";

export default function TeamReports({ teamMembers, projects }) {
  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  if (teamMembers.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center">
          <Users size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">No team data available</p>
        </CardContent>
      </Card>
    );
  }

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 sm:hidden">
      {teamMembers.map((member) => (
        <div key={member.id} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#C9A84C]/20 text-[#C9A84C] text-sm">
                {getInitials(member.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{member.full_name}</p>
              <p className="text-xs text-gray-500">{member.email}</p>
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <p>Role: {member.role}</p>
            <p>Designation: {member.designation || "—"}</p>
            <p>Status: <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {member.status}
            </Badge></p>
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
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.full_name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.designation || "—"}</TableCell>
              <TableCell>
                <Badge className={member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {member.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Users size={18} className="sm:w-5 sm:h-5" />
          Team Members ({teamMembers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DesktopTableView />
        <MobileCardView />
      </CardContent>
    </Card>
  );
}