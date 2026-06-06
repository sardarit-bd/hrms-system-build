"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCheck, Bell, BellRing } from "lucide-react";

export default function NotificationCard({ 
  notification, 
  onViewDetails, 
  onMarkAsRead,
  getNotificationTypeIcon 
}) {
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
        !notification.is_read
          ? "border-l-4 border-l-[#C9A84C] bg-blue-50/30 dark:bg-blue-950/20"
          : "bg-white dark:bg-slate-900"
      }`}
      onClick={() => onViewDetails(notification)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Notification Icon */}
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg ${
                !notification.is_read
                  ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}
            >
              {getNotificationTypeIcon(notification.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-1 sm:gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h4>
                  {!notification.is_read && (
                    <Badge className="bg-[#C9A84C] text-white text-[10px] sm:text-xs px-1.5 py-0">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {getTimeAgo(notification.created_at)}
                  </span>
                  {notification.type && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(notification)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 cursor-pointer"
                  title="View Details"
                >
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                </Button>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 cursor-pointer text-green-600 hover:text-green-700"
                    title="Mark as Read"
                  >
                    <CheckCheck size={14} className="sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}