"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing } from "lucide-react";
import Link from "next/link";

export default function NotificationsCard({ notifications, unreadCount, onRefresh }) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BellRing size={16} />
          Notifications
          {unreadCount > 0 && (
            <Badge className="bg-[#C9A84C] text-white ml-2">{unreadCount} new</Badge>
          )}
        </CardTitle>
        <Link
          href="/workspace/leader/notifications"
          className="text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.slice(0, 4).map((notification) => (
          <div
            key={notification.id}
            className={`p-2 rounded-lg ${!notification.is_read ? "bg-gray-50 dark:bg-gray-800/30" : ""}`}
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.title}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {notification.created_at
                ? new Date(notification.created_at).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}