"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

export default function TeamRosterInfo({ teamMembers, rosters, shifts }) {
  const assignedRosters = Object.keys(rosters).length;
  const activeRosters = Object.values(rosters).filter(r => r.is_active).length;

  // Group rosters by shift
  const rosterByShift = {};
  Object.values(rosters).forEach(roster => {
    const shiftName = roster.shift?.name || "Unknown";
    if (!rosterByShift[shiftName]) {
      rosterByShift[shiftName] = [];
    }
    rosterByShift[shiftName].push(roster);
  });

  if (assignedRosters === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Calendar size={18} className="sm:w-5 sm:h-5" />
            Team Roster Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 sm:py-12 text-center">
          <Users size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-500">No roster assignments found</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">No team members have roster assignments yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Total Rosters Assigned</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{assignedRosters}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Active Rosters</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{activeRosters}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock size={14} className="sm:w-4 sm:h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rosters by Shift */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
            <Clock size={18} className="sm:w-5 sm:h-5" />
            Rosters by Shift
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {Object.entries(rosterByShift).map(([shiftName, rosterList]) => (
            <div key={shiftName} className="border-b last:border-0 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{shiftName}</h4>
                <Badge variant="outline" className="text-[10px] sm:text-xs">{rosterList.length} members</Badge>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {rosterList.map((roster) => {
                  const member = teamMembers.find(m => m.id === roster.user_id);
                  return member ? (
                    <Badge key={roster.id} variant="secondary" className="text-[10px] sm:text-xs cursor-default">
                      {member.full_name.split(" ")[0]}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}