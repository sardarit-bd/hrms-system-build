"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Calendar, Clock, BarChart3, Zap } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "View Projects", icon: Briefcase, href: "/workspace/manager/projects", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { label: "Manage Team", icon: Users, href: "/workspace/manager/team", color: "bg-green-50 text-green-600 hover:bg-green-100" },
  { label: "Approve Leave", icon: Calendar, href: "/workspace/manager/approvals?tab=leave", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
  { label: "Approve Hour Logs", icon: Clock, href: "/workspace/manager/approvals?tab=hourlogs", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { label: "View Reports", icon: BarChart3, href: "/workspace/manager/reports", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Zap size={16} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 cursor-pointer ${action.color} border-0 hover:shadow-sm transition-all`}
              >
                <action.icon size={14} />
                <span className="text-sm">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}