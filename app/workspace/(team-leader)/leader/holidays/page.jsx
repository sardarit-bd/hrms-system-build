"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Gift } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import HolidayCalendar from "../../../../../components/workspace/team-leder/holidays/HolidayCalendar";
import HolidayList from "../../../../../components/workspace/team-leder/holidays/HolidayList";
import UpcomingHolidaysCard from "../../../../../components/workspace/team-leder/holidays/UpcomingHolidaysCard";
import HolidaysSkeleton from "../../../../../components/workspace/team-leder/holidays/HolidaysSkeleton";


export default function TeamLeaderHolidaysPage() {
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

  const stats = {
    totalHolidays: holidays.length,
    upcomingCount: upcomingHolidays.length,
    recurringCount: holidays.filter(h => h.is_recurring).length,
  };

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
                View company holidays and observances
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Holidays</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalHolidays}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Gift size={18} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.upcomingCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Gift size={18} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Recurring</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.recurringCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Gift size={18} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="upcoming" className="cursor-pointer">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="list" className="cursor-pointer">
                All Holidays
              </TabsTrigger>
              <TabsTrigger value="calendar" className="cursor-pointer">
                Calendar
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Holidays Tab */}
            <TabsContent value="upcoming" className="space-y-6">
              <UpcomingHolidaysCard upcomingHolidays={upcomingHolidays} />
            </TabsContent>

            {/* All Holidays Tab */}
            <TabsContent value="list" className="space-y-6">
              <HolidayList holidays={holidays} selectedYear={selectedYear} />
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <HolidayCalendar holidays={holidays} selectedYear={selectedYear} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}