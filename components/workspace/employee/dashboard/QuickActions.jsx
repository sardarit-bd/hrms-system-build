"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, DollarSign, Briefcase, User, Zap } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    label: "Apply Leave",
    icon: CalendarDays,
    href: "/workspace/employee/leave",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    label: "Submit Hour Log",
    icon: Clock,
    href: "/workspace/employee/hour-logs",
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    label: "View Payroll",
    icon: DollarSign,
    href: "/workspace/employee/payroll",
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  {
    label: "My Projects",
    icon: Briefcase,
    href: "/workspace/employee/projects",
    color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
  },
  {
    label: "My Profile",
    icon: User,
    href: "/workspace/profile",
    color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
  },
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
        <div className="grid grid-cols-2 gap-3">
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