"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Bell, BellRing, CheckCheck, Inbox, Trash2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import NotificationDetailsModal from "../../../../../components/workspace/team-leder/notifications/NotificationDetailsModal";
import NotificationCard from "../../../../../components/workspace/team-leder/notifications/NotificationCard";
import NotificationSkeleton from "../../../../../components/workspace/team-leder/notifications/NotificationSkeleton";


export default function TeamLeaderNotificationsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchNotifications = useCallback(async (showRefreshToast = false) => {
    try {
      const [notificationsRes, unreadRes] = await Promise.allSettled([
        apiRequest("/notifications?per_page=100"),
        apiRequest("/notifications/unread-count"),
      ]);

      if (notificationsRes.status === "fulfilled" && notificationsRes.value?.data) {
        setNotifications(notificationsRes.value.data);
      }
      if (unreadRes.status === "fulfilled" && unreadRes.value?.data) {
        setUnreadCount(unreadRes.value.data.unread_count || 0);
      }

      if (showRefreshToast) {
        gooeyToast.success("Notifications Refreshed", {
          description: "Your notifications have been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      gooeyToast.error("Failed to Load Notifications", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiRequest("/notifications/mark-read", {
        method: "POST",
        body: JSON.stringify({ notification_ids: [notificationId] }),
      });
      
      gooeyToast.success("Marked as Read", {
        description: "Notification has been marked as read.",
        duration: 2000,
      });
      
      fetchNotifications();
    } catch (error) {
      gooeyToast.error("Failed to Mark as Read", {
        description: error.message,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      gooeyToast.info("No Unread Notifications", {
        description: "You don't have any unread notifications.",
        duration: 2000,
      });
      return;
    }

    try {
      await apiRequest("/notifications/mark-all-read", {
        method: "POST",
      });
      
      gooeyToast.success("All Notifications Marked as Read", {
        description: `${unreadCount} notification${unreadCount !== 1 ? "s" : ""} marked as read.`,
        duration: 3000,
      });
      
      fetchNotifications();
    } catch (error) {
      gooeyToast.error("Failed to Mark All as Read", {
        description: error.message,
      });
    }
  };

  const handleCleanup = async () => {
    try {
      await apiRequest("/notifications/cleanup?days=30", {
        method: "DELETE",
      });
      
      gooeyToast.success("Old Notifications Cleaned Up", {
        description: "Notifications older than 30 days have been removed.",
        duration: 3000,
      });
      
      fetchNotifications();
    } catch (error) {
      gooeyToast.error("Cleanup Failed", {
        description: error.message,
      });
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailsModalOpen(true);
    
    // Mark as read when viewed if not already read
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.is_read;
    if (activeTab === "read") return notification.is_read;
    return true;
  });

  const getNotificationTypeIcon = (type) => {
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

  if (loading) {
    return <NotificationSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Stay updated with your latest alerts and team updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2 cursor-pointer"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanup}
                className="gap-2 cursor-pointer text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 size={14} />
                Cleanup Old
              </Button>
              <Button
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="gap-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer disabled:opacity-50"
              >
                <CheckCheck size={14} />
                Mark All as Read
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                      <BellRing size={20} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {unreadCount}
                      </p>
                      <p className="text-xs text-gray-500">Unread</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Bell size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {notifications.length}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all" className="cursor-pointer">
                All
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="cursor-pointer">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-[#C9A84C] text-white">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read" className="cursor-pointer">
                Read
                <Badge variant="secondary" className="ml-2">
                  {notifications.filter(n => n.is_read).length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Inbox size={48} className="text-gray-400" />
                      <p className="text-gray-500">No notifications found</p>
                      <p className="text-sm text-gray-400">
                        {activeTab === "unread" 
                          ? "You've read all your notifications!" 
                          : activeTab === "read"
                          ? "You haven't read any notifications yet."
                          : "When you receive notifications, they'll appear here."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-3 pr-4">
                    {filteredNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onViewDetails={handleViewDetails}
                        onMarkAsRead={handleMarkAsRead}
                        getNotificationTypeIcon={getNotificationTypeIcon}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Notification Details Modal */}
      <NotificationDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        notification={selectedNotification}
      />
    </DashboardLayout>
  );
}