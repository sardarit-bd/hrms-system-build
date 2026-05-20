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
import { Calendar, Bell, Mail } from "lucide-react";

export default function NotificationDetailsModal({ open, onOpenChange, notification }) {
  if (!notification) return null;

  const getTypeIcon = (type) => {
    const icons = {
      leave: "📅",
      payroll: "💰",
      project: "📁",
      approval: "✓",
      attendance: "⏰",
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-2xl">
              {getTypeIcon(notification.type)}
            </div>
            <div>
              <DialogTitle className="text-lg">{notification.title}</DialogTitle>
              <DialogDescription>
                {notification.type && (
                  <Badge variant="outline" className="mt-1">
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Message */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {notification.message}
            </p>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Received</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {getFormattedDate(notification.created_at)}
                </p>
              </div>
            </div>

            {notification.read_at && (
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Read on</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {getFormattedDate(notification.read_at)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <Bell size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge
                  className={`mt-1 ${
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
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Additional Information
                </p>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-sm">
                  <pre className="whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-400">
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