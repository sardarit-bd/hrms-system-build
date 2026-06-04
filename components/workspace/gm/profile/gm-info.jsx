// components/gm/gm-info.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Target, Users, TrendingUp, Award, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GMInfo({ profile }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star size={18} className="text-[#1D3A88]" />
            General Manager Information
          </CardTitle>
          <CardDescription>
            Executive-level information and responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <Target size={20} className="text-[#1D3A88]" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Management Level</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Executive Leadership</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10">
              <Users size={20} className="text-green-600" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Team Size</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {profile.team_size || "Department-wide"}
                </p>
              </div>
            </div>
          </div>

          {/* Reports To */}
          {profile.reports_to && (
            <div className="p-3 rounded-lg border border-gray-100 dark:border-slate-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reports To</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.reports_to}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {profile.responsibilities && profile.responsibilities.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <ClipboardList size={16} />
                Key Responsibilities
              </p>
              <ul className="space-y-2">
                {profile.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-[#1D3A88]">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#1D3A88]" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-[#1D3A88]">
                {profile.performance_score || "—"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Performance Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-[#1D3A88]">
                {profile.projects_managed || "—"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Projects Managed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-[#1D3A88]">
                {profile.team_members || "—"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Team Members</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
              <p className="text-2xl font-bold text-[#1D3A88]">
                {profile.completed_initiatives || "—"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Initiatives</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}