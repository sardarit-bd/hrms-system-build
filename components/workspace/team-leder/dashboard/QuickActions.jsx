"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, Briefcase, Bell, Zap } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "View Team", icon: Users, href: "/workspace/leader/team", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { label: "Approve Leave", icon: Calendar, href: "/workspace/leader/approvals?tab=leave", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
  { label: "Approve Hour Logs", icon: Clock, href: "/workspace/leader/approvals?tab=hourlogs", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { label: "View Projects", icon: Briefcase, href: "/workspace/leader/projects", color: "bg-green-50 text-green-600 hover:bg-green-100" },
  { label: "Notifications", icon: Bell, href: "/workspace/leader/notifications", color: "bg-gray-50 text-gray-600 hover:bg-gray-100" },
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