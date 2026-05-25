"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Bell, Mail, BellRing } from "lucide-react";

export default function NotificationDetailsModal({ open, onOpenChange, notification }) {
  if (!notification) return null;

  const getTypeIcon = (type) => {
    const icons = {
      leave: "📅",
      payroll: "💰",
      project: "📁",
      approval: "✓",
      attendance: "⏰",
      hour_log: "⏱️",
      default: "🔔",
    };
    return icons[type] || icons.default;
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-xl sm:text-2xl">
              {getTypeIcon(notification.type)}
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">{notification.title}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {notification.type && (
                  <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Message */}
          <div className="p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {notification.message}
            </p>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <Calendar size={14} className="sm:w-4 sm:h-4 text-gray-500" />
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Received</p>
                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                  {getFormattedDate(notification.created_at)}
                </p>
              </div>
            </div>

            {notification.read_at && (
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <Mail size={14} className="sm:w-4 sm:h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Read on</p>
                  <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    {getFormattedDate(notification.read_at)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <Bell size={14} className="sm:w-4 sm:h-4 text-gray-500" />
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Status</p>
                <Badge
                  className={`mt-0.5 text-[10px] sm:text-xs ${
                    notification.is_read
                      ? "bg-gray-100 text-gray-600"
                      : "bg-[#C9A84C] text-white"
                  }`}
                >
                  {notification.is_read ? "Read" : "Unread"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Additional Info for specific types */}
          {notification.metadata && (
            <>
              <Separator />
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Additional Information
                </p>
                <div className="p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-xs sm:text-sm">
                  <pre className="whitespace-pre-wrap text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    {JSON.stringify(notification.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}