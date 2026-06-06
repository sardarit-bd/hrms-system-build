import { Bell, Briefcase, CalendarDays, UserCheck } from "lucide-react";

export function getActivityIcon(type, status) {
    if (type === "leave") {
      return <CalendarDays size={14} className="text-orange-600" />;
    }
    if (type === "user") {
      return <UserCheck size={14} className="text-emerald-600" />;
    }
    if (type === "project") {
      return <Briefcase size={14} className="text-blue-600" />;
    }
    return <Bell size={14} className="text-gray-600" />;
  }