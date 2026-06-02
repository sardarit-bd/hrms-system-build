"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Users, Briefcase } from "lucide-react";

export default function CompanyOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <Building2 size={18} className="sm:w-5 sm:h-5" />
          Company Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">500+</p>
              <p className="text-xs text-gray-500">Total Workforce</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Briefcase size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-xs text-gray-500">Active Projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Building2 size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
              <p className="text-xs text-gray-500">Departments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">+15%</p>
              <p className="text-xs text-gray-500">YoY Growth</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}