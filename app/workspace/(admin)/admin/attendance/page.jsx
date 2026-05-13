'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

function AttendanceContent() {
  const { user } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString();
    setCheckInTime(now);
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
  };

  const attendanceRecords = [
    {
      date: new Date().toLocaleDateString(),
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      duration: '8h 30m',
      status: 'Present',
    },
    {
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      checkIn: '09:15 AM',
      checkOut: '05:45 PM',
      duration: '8h 30m',
      status: 'Present',
    },
    {
      date: new Date(Date.now() - 172800000).toLocaleDateString(),
      checkIn: '-',
      checkOut: '-',
      duration: '-',
      status: 'Leave',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
            Attendance
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
            Track your attendance and work hours
          </p>
        </div>

        {/* Check-in/Check-out Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 w-full">
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                  Current Status
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-white mb-1">
                  {checkedIn ? '✓ Checked In' : 'Not Checked In'}
                </p>
                {checkInTime && (
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                    Since {checkInTime}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant={checkedIn ? 'secondary' : 'primary'}
                  onClick={handleCheckIn}
                  disabled={checkedIn}
                  className="flex-1 sm:flex-auto"
                >
                  Check In
                </Button>
                <Button
                  variant={checkedIn ? 'danger' : 'secondary'}
                  onClick={handleCheckOut}
                  disabled={!checkedIn}
                  className="flex-1 sm:flex-auto"
                >
                  Check Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                This Month
              </p>
              <p className="text-xl sm:text-3xl font-bold text-primary dark:text-white">
                20
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1 sm:mt-2">
                Days Present
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Attendance Rate
              </p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                91%
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1 sm:mt-2">
                This Month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Total Hours
              </p>
              <p className="text-xl sm:text-3xl font-bold text-accent dark:text-blue-400">
                164h
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1 sm:mt-2">
                Worked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar size={20} />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border dark:border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Check In
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Check Out
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-foreground dark:text-white">
                        {record.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {record.checkIn}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {record.checkOut}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {record.duration}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Present'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-4">
              {attendanceRecords.map((record, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-secondary dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-foreground dark:text-white text-sm">
                      {record.date}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Present'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground dark:text-gray-400">Check In:</span>
                      <span className="text-foreground dark:text-white font-medium">
                        {record.checkIn}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground dark:text-gray-400">Check Out:</span>
                      <span className="text-foreground dark:text-white font-medium">
                        {record.checkOut}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-border dark:border-slate-600">
                      <span className="text-muted-foreground dark:text-gray-400">Duration:</span>
                      <span className="text-foreground dark:text-white font-medium">
                        {record.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function AttendancePage() {
  return (
    <ProtectedRoute>
      <AttendanceContent />
    </ProtectedRoute>
  );
}
