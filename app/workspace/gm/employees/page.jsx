"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";
import EmployeeDetailsModal from "../../../../components/workspace/gm/employee/EmployeeDetailsModal";
import EmployeesTable from "../../../../components/workspace/gm/employee/EmployeesTable";
import EmployeeFilters from "../../../../components/workspace/gm/employee/EmployeeFilters";
import EmployeeStatsCards from "../../../../components/workspace/gm/employee/EmployeeStatsCards";
import EmployeesSkeleton from "../../../../components/workspace/gm/employee/EmployeesSkeleton";


export default function GMEmployeesPage() {
  const { apiRequest } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchEmployees = useCallback(async (showRefreshToast = false) => {
    try {
      const params = new URLSearchParams();
      params.append("per_page", perPage);
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);
      if (departmentFilter) params.append("department", departmentFilter);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);
      
      const response = await apiRequest(`/users?${params.toString()}`);
      
      if (response.status && response.data) {
        setEmployees(response.data);
        setTotal(response.meta?.total || response.data.length);
      }

      if (showRefreshToast) {
        gooeyToast.success("Employees Refreshed", {
          description: "Employee data has been updated.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      gooeyToast.error("Failed to Load Employees", {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiRequest, perPage, currentPage, searchTerm, departmentFilter, roleFilter, statusFilter]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await apiRequest("/departments");
      if (response.status && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setRoleFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const handleViewDetails = async (employee) => {
    try {
      const response = await apiRequest(`/users/${employee.id}`);
      if (response.status && response.data) {
        setSelectedEmployee(response.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      gooeyToast.error("Failed to Load Details", {
        description: error.message,
      });
    }
  };

  // Calculate stats
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === "active").length,
    inactive: employees.filter(e => e.status === "inactive").length,
    pending: employees.filter(e => e.status === "pending").length,
  };

  const totalPages = Math.ceil(total / perPage);

  if (loading) {
    return <EmployeesSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/50">
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Employee Directory
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                View and manage employee information
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
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
            </div>
          </div>

          {/* Stats Cards */}
          <EmployeeStatsCards stats={stats} />

          {/* Filters */}
          {/* <EmployeeFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departments={departments}
            onReset={handleResetFilters}
          /> */}

          {/* Employees Table */}
          <EmployeesTable
            employees={employees}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={total}
            perPage={perPage}
            totalPages={totalPages}
            departments={departments}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        employee={selectedEmployee}
        departments={departments}
      />
    </DashboardLayout>
  );
}