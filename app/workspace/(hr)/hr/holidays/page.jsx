"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import HolidayDetailsModal from "../../../../../components/workspace/hr/holidays/HolidayDetailsModal";
import EditHolidayDialog from "../../../../../components/workspace/hr/holidays/EditHolidayDialog";
import CreateHolidayDialog from "../../../../../components/workspace/hr/holidays/CreateHolidayDialog";
import UpcomingHolidaysCard from "../../../../../components/workspace/hr/holidays/UpcomingHolidaysCard";
import HolidayList from "../../../../../components/workspace/hr/holidays/HolidayList";
import HolidayFilters from "../../../../../components/workspace/hr/holidays/HolidayFilters";
import HolidayStatsCards from "../../../../../components/workspace/hr/holidays/HolidayStatsCards";
import HolidaySkeleton from "../../../../../components/workspace/hr/holidays/HolidaySkeleton";


export default function HRHolidaysPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("list");

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

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleViewDetails = (holiday) => {
    setSelectedHoliday(holiday);
    setDetailsModalOpen(true);
  };

  const handleEditHoliday = (holiday) => {
    setSelectedHoliday(holiday);
    setEditDialogOpen(true);
  };

  // Filter holidays
  const filteredHolidays = holidays.filter(holiday => {
    if (searchTerm && !holiday.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (typeFilter === "recurring" && !holiday.is_recurring) return false;
    if (typeFilter === "one-time" && holiday.is_recurring) return false;
    return true;
  });

  const stats = {
    totalHolidays: holidays.length,
    upcomingCount: upcomingHolidays.length,
    recurringCount: holidays.filter(h => h.is_recurring).length,
    oneTimeCount: holidays.filter(h => !h.is_recurring).length,
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  if (loading) {
    return <HolidaySkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Holidays Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage company holidays and observances
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex gap-1 p-0.5 sm:p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
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
                className="gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                size="sm"
                onClick={() => setCreateDialogOpen(true)}
                className="gap-1 sm:gap-2 bg-[#1D3A88] hover:bg-[#142558] cursor-pointer text-xs sm:text-sm"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add Holiday</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <HolidayStatsCards stats={stats} />

          {/* Filters */}
          {/* <HolidayFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onReset={handleResetFilters}
          /> */}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="list" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  All Holidays
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                    {filteredHolidays.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                  Upcoming
                  {stats.upcomingCount > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs bg-[#C9A84C] text-white px-1.5 py-0.5 rounded-full">
                      {stats.upcomingCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="space-y-4 sm:space-y-6">
              <HolidayList
                holidays={filteredHolidays}
                selectedYear={selectedYear}
                onViewDetails={handleViewDetails}
                onEditHoliday={handleEditHoliday}
              />
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4 sm:space-y-6">
              <UpcomingHolidaysCard
                upcomingHolidays={upcomingHolidays}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Holiday Dialog */}
      <CreateHolidayDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchHolidays}
      />

      {/* Edit Holiday Dialog */}
      <EditHolidayDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        holiday={selectedHoliday}
        onSuccess={fetchHolidays}
      />

      {/* Holiday Details Modal */}
      <HolidayDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        holiday={selectedHoliday}
      />
    </DashboardLayout>
  );
}