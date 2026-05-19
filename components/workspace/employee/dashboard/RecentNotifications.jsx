"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, CheckCircle, CalendarDays, DollarSign, Briefcase } from "lucide-react";
import Link from "next/link";

const getNotificationIcon = (type) => {
  const icons = {
    leave: CalendarDays,
    payroll: DollarSign,
    project: Briefcase,
    approval: CheckCircle,
  };
  const Icon = icons[type] || Bell;
  return Icon;
};

const getNotificationColor = (type) => {
  const colors = {
    leave: "text-blue-600 bg-blue-50",
    payroll: "text-green-600 bg-green-50",
    project: "text-purple-600 bg-purple-50",
    approval: "text-amber-600 bg-amber-50",
  };
  return colors[type] || "text-gray-600 bg-gray-50";
};

export default function RecentNotifications({ notifications, unreadCount }) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bell size={16} />
            Recent Notifications
            {unreadCount > 0 && (
              <Badge className="bg-[#C9A84C] text-white ml-2">{unreadCount} new</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-4">No notifications yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BellRing size={16} />
          Recent Notifications
          {unreadCount > 0 && (
            <Badge className="bg-[#C9A84C] text-white ml-2">{unreadCount} new</Badge>
          )}
        </CardTitle>
        <Link
          href="/workspace/employee/notifications"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.slice(0, 5).map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClass = getNotificationColor(notification.type);
          
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                !notification.is_read ? "bg-gray-50 dark:bg-gray-800/30" : ""
              }`}
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.created_at
                    ? new Date(notification.created_at).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
              {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-[#C9A84C]"></div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}