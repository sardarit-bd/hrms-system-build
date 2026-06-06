"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

export default function RosterShiftReports({ rosters, shifts }) {
  const activeRosters = rosters.filter(r => r.is_active).length;
  const totalRosters = rosters.length;

  if (shifts.length === 0 && totalRosters === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No roster or shift data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
          <Clock size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{shifts.length}</p>
          <p className="text-[10px] text-gray-500">Total Shifts</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
          <Calendar size={16} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{activeRosters}</p>
          <p className="text-[10px] text-gray-500">Active Rosters</p>
        </div>
      </div>

      {/* Shifts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift Name</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.name}</TableCell>
                    <TableCell>{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</TableCell>
                    <TableCell>{shift.working_hours} hrs</TableCell>
                    <TableCell>
                      <Badge className={shift.is_fixed ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                        {shift.is_fixed ? "Fixed" : "Rotating"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Roster Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-medium">Roster Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Weekend Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rosters.slice(0, 20).map((roster) => (
                  <TableRow key={roster.id}>
                    <TableCell className="font-medium">{roster.user?.full_name || "N/A"}</TableCell>
                    <TableCell>{roster.shift?.name || "N/A"}</TableCell>
                    <TableCell>{roster.weekend_days?.join(", ") || "None"}</TableCell>
                    <TableCell>
                      <Badge className={roster.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {roster.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}