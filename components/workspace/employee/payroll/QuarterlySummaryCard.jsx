"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, Calendar, Clock, RefreshCw } from "lucide-react";

const QUARTERS = [
  { value: "1", label: "Q1 (Jan - Mar)" },
  { value: "2", label: "Q2 (Apr - Jun)" },
  { value: "3", label: "Q3 (Jul - Sep)" },
  { value: "4", label: "Q4 (Oct - Dec)" },
];

export default function QuarterlySummaryCard({ quarterlyData, yearFilter, quarterFilter, setQuarterFilter, onRefresh }) {
  const data = quarterlyData?.data || quarterlyData;

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Quarterly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-500">No quarterly data available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefresh()}
              className="mt-4 cursor-pointer"
            >
              <RefreshCw size={14} className="mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryItems = [
    {
      title: "Total Gross Salary",
      value: `৳${(data.total_gross_salary || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Net Salary",
      value: `৳${(data.total_net_salary || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Total Deductions",
      value: `৳${(data.total_deductions || 0).toLocaleString()}`,
      icon: Clock,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Total Present Days",
      value: data.total_days_present || 0,
      icon: Calendar,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Quarterly Summary</CardTitle>
        <div className="flex gap-2">
          <Select value={quarterFilter} onValueChange={setQuarterFilter}>
            <SelectTrigger className="w-36 cursor-pointer">
              <SelectValue placeholder="Select Quarter" />
            </SelectTrigger>
            <SelectContent>
              {QUARTERS.map((q) => (
                <SelectItem key={q.value} value={q.value} className="cursor-pointer">
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryItems.map((item) => (
            <div key={item.title} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{item.title}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {item.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-xs text-gray-500">Total Days Absent</p>
            <p className="text-lg font-semibold text-red-600">{data.total_days_absent || 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-xs text-gray-500">Total Late Count</p>
            <p className="text-lg font-semibold text-yellow-600">{data.total_late_count || 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-xs text-gray-500">Records Found</p>
            <p className="text-lg font-semibold">{data.records?.length || 0}</p>
          </div>
        </div>

        {/* Monthly Records within Quarter */}
        {data.records && data.records.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Monthly Breakdown
            </p>
            <div className="space-y-2">
              {data.records.map((record) => (
                <div key={record.payroll_month} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm font-medium">{record.payroll_month}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">Net: ৳{record.net_salary?.toLocaleString()}</span>
                    <span className="text-red-600">Ded: ৳{record.total_deductions?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}