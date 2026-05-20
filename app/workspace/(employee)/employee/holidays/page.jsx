"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Calendar, Gift, Sparkles } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import UpcomingHolidaysCard from "../../../../../components/workspace/employee/holidays/UpcomingHolidaysCard";
import HolidayList from "../../../../../components/workspace/employee/holidays/HolidayList";
import HolidayCalendar from "../../../../../components/workspace/employee/holidays/HolidayCalendar";


export default function EmployeeHolidaysPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchHolidays = useCallback(async (showRefreshToast = false) => {
    try {
      const [allHolidaysRes, upcomingRes] = await Promise.allSettled([
        apiRequest(`/holidays?year=${selectedYear}`),
        apiRequest("/holidays/upcoming?limit=10"),
      ]);

      if (allHolidaysRes.status === "fulfilled" && allHolidaysRes.value?.data) {
        setHolidays(allHolidaysRes.value.data);
      }
      if (upcomingRes.status === "fulfilled" && upcomingRes.value?.data) {
        setUpcomingHolidays(upcomingRes.value.data);
      }

      if (showRefreshToast) {
        gooeyToast.success("Holidays Refreshed", {
          description: "Holiday calendar has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      gooeyToast.error("Failed to Load Holidays", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, selectedYear]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHolidays(true);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  if (loading) {
    return <HolidaysSkeleton />;
  }

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Holidays & Observances
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View upcoming holidays and company observances
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                      selectedYear === year
                        ? "bg-[#1D3A88] text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
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
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Holidays</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {holidays.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Calendar size={18} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {upcomingHolidays.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Gift size={18} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Recurring</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {holidays.filter(h => h.is_recurring).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Sparkles size={18} className="text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list" className="cursor-pointer">
                <Calendar size={14} className="mr-2" />
                Holiday List
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="cursor-pointer">
                <Gift size={14} className="mr-2" />
                Upcoming
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <HolidayList holidays={holidays} />
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingHolidaysCard upcomingHolidays={upcomingHolidays} />
                <HolidayCalendar holidays={holidays} selectedYear={selectedYear} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Loading Skeleton
function HolidaysSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-64" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}