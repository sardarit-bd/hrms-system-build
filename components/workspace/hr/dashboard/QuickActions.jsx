"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Calendar, Clock, Shield, Zap } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "View Employees", icon: Users, href: "/workspace/hr/employees", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { label: "Pending Approvals", icon: UserCheck, href: "/workspace/hr/approvals", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
  { label: "Leave Requests", icon: Calendar, href: "/workspace/hr/leave", color: "bg-green-50 text-green-600 hover:bg-green-100" },
  { label: "Manage Roster", icon: Clock, href: "/workspace/hr/roster", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { label: "Attendance Policies", icon: Shield, href: "/workspace/hr/policies", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Zap size={18} className="sm:w-5 sm:h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 cursor-pointer ${action.color} border-0 hover:shadow-sm transition-all text-xs sm:text-sm h-9`}
              >
                <action.icon size={14} />
                <span className="truncate">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}