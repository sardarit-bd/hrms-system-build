"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Calendar, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HRManagerInfoCard({ profileData }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingApprovals: 0,
    totalDepartments: 0,
    activePolicies: 0,
  });

  useEffect(() => {
    fetchHRStats();
  }, []);

  const fetchHRStats = async () => {
    setLoading(true);
    try {
      const [usersRes, deptRes, policiesRes] = await Promise.allSettled([
        apiRequest("/users?per_page=500"),
        apiRequest("/departments"),
        apiRequest("/attendance/policies"),
      ]);

      const users = usersRes.status === "fulfilled" && usersRes.value?.data ? usersRes.value.data : [];
      const departments = deptRes.status === "fulfilled" && deptRes.value?.data ? deptRes.value.data : [];
      const policies = policiesRes.status === "fulfilled" && policiesRes.value?.data ? policiesRes.value.data : [];

      setStats({
        totalEmployees: users.length,
        activeEmployees: users.filter(u => u.status === "active").length,
        pendingApprovals: users.filter(u => u.status === "pending").length,
        totalDepartments: departments.length,
        activePolicies: policies.filter(p => p.is_active).length,
      });
    } catch (error) {
      console.error("Failed to fetch HR stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Users size={16} className="sm:w-5 sm:h-5" />
            HR Manager Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    { label: "Total Employees", value: stats.totalEmployees, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Active Employees", value: stats.activeEmployees, icon: CheckCircle, color: "bg-green-100 text-green-700" },
    { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    { label: "Departments", value: stats.totalDepartments, icon: Building2, color: "bg-purple-100 text-purple-700" },
    { label: "Active Policies", value: stats.activePolicies, icon: Calendar, color: "bg-indigo-100 text-indigo-700" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Users size={16} className="sm:w-5 sm:h-5" />
          HR Manager Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        {/* HR Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statCards.map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.color} mb-1`}>
                <stat.icon size={14} />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Access</h4>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/workspace/hr/employees" className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
              • Employee Management
            </Link>
            <Link href="/workspace/hr/attendance-policies" className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
              • Attendance Policies
            </Link>
            <Link href="/workspace/hr/leave" className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
              • Leave Requests
            </Link>
            <Link href="/workspace/hr/roster-shifts" className="text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 cursor-pointer">
              • Roster & Shifts
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}