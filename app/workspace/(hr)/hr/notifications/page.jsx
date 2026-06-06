"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Bell, BellRing, CheckCheck, Inbox, Trash2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import NotificationDetailsModal from "../../../../../components/workspace/hr/notifications/NotificationDetailsModal";
import NotificationCard from "../../../../../components/workspace/hr/notifications/NotificationCard";
import NotificationFilters from "../../../../../components/workspace/hr/notifications/NotificationFilters";
import NotificationStats from "../../../../../components/workspace/hr/notifications/NotificationStats";
import NotificationsSkeleton from "../../../../../components/workspace/hr/notifications/NotificationsSkeleton";


export default function HRNotificationsPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

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

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
  };

  // Filter notifications based on active tab and filters
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.is_read;
    if (activeTab === "read") return notification.is_read;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (typeFilter && notification.type !== typeFilter) return false;
    return true;
  });

  const getNotificationTypeIcon = (type) => {
    const icons = {
      leave: "📅",
      payroll: "💰",
      project: "📁",
      approval: "✓",
      attendance: "⏰",
      employee: "👤",
      policy: "📋",
      roster: "📅",
      default: "🔔",
    };
    return icons[type] || icons.default;
  };

  if (loading) {
    return <NotificationsSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Stay updated with HR system alerts and updates
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanup}
                className="gap-1 sm:gap-2 cursor-pointer text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 text-xs sm:text-sm"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Cleanup Old</span>
                <span className="sm:hidden">Cleanup</span>
              </Button>
              <Button
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="gap-1 sm:gap-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                <CheckCheck size={14} />
                <span className="hidden sm:inline">Mark All as Read</span>
                <span className="sm:hidden">Mark Read</span>
                {unreadCount > 0 && (
                  <span className="ml-1 sm:ml-2 bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <NotificationStats 
            totalCount={notifications.length}
            unreadCount={unreadCount}
            readCount={notifications.filter(n => n.is_read).length}
          />

          {/* Filters */}
          <NotificationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onReset={handleResetFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="all" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  All
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="unread" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Unread
                  {unreadCount > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-[#C9A84C] text-white px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Read
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                    {notifications.filter(n => n.is_read).length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 sm:py-12 text-center">
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <Inbox size={32} className="sm:w-12 sm:h-12 text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-500">No notifications found</p>
                      <p className="text-xs sm:text-sm text-gray-400">
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
                <ScrollArea className="h-[calc(100vh-420px)] sm:h-[calc(100vh-450px)]">
                  <div className="space-y-3 pr-1 sm:pr-2">
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