"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function ProjectHourSummary({ projectId, projectName }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchSummary();
    }
  }, [projectId]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/hour-logs/project/${projectId}/summary`);
      if (response.status && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch project hour summary:", error);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8">
        <Clock size={40} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No hour data available</p>
        <p className="text-xs text-gray-400 mt-1">
          No hour logs have been submitted for {projectName} yet.
        </p>
      </div>
    );
  }

  const { total_approved_hours, pending_logs_count, total_pending_hours } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-xs text-gray-500">Approved Hours</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {total_approved_hours || 0} hrs
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-600" />
            <p className="text-xs text-gray-500">Pending Logs</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {pending_logs_count || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle size={16} className="text-orange-600" />
            <p className="text-xs text-gray-500">Pending Hours</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {total_pending_hours || 0} hrs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}