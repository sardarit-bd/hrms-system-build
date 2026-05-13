'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function AttendanceAdminContent() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);

  const attendanceRecords = [
    {
      id: '1',
      employeeName: 'John Doe',
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      status: 'Present',
      department: 'Engineering',
    },
    {
      id: '2',
      employeeName: 'Sarah Smith',
      checkIn: '09:15 AM',
      checkOut: '05:45 PM',
      status: 'Present',
      department: 'Sales',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      checkIn: '-',
      checkOut: '-',
      status: 'Absent',
      department: 'HR',
    },
    {
      id: '4',
      employeeName: 'Emma Wilson',
      checkIn: '10:30 AM',
      checkOut: '-',
      status: 'In Office',
      department: 'Operations',
    },
  ];

  const stats = {
    present: 2,
    absent: 1,
    onLeave: 3,
    halfDay: 1,
    total: 7,
  };

  const attendanceRate = Math.round(
    ((stats.present + stats.halfDay) / stats.total) * 100
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground dark:text-white">
              Attendance Management
            </h1>
            <p className="text-muted-foreground dark:text-gray-400 mt-1">
              Admin controls for managing employee attendance
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button variant="primary" onClick={() => setShowBulkUpdate(true)}>
              Bulk Update
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                Present
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.present}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                Absent
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.absent}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                On Leave
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.onLeave}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                Half Day
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.halfDay}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                Attendance Rate
              </p>
              <p className="text-3xl font-bold text-primary dark:text-white">
                {attendanceRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records - {selectedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border dark:border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                      Employee
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                      Check In
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                      Check Out
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-foreground dark:text-white">
                        {record.employeeName}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground dark:text-gray-400">
                        {record.department}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground dark:text-gray-400">
                        {record.checkIn}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground dark:text-gray-400">
                        {record.checkOut}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          defaultValue={record.status}
                          className="px-3 py-1 text-sm border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-accent hover:text-accent/80 text-sm font-medium">
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="border-b border-border dark:border-slate-700">
              <CardTitle>Bulk Attendance Update</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Select Department
                </label>
                <select className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>HR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Mark as
                </label>
                <select className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Half Day</option>
                  <option>Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  placeholder="Enter reason for bulk update"
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows="3"
                ></textarea>
              </div>
            </CardContent>

            <div className="border-t border-border dark:border-slate-700 p-4 flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowBulkUpdate(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function AttendanceAdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AttendanceAdminContent />
    </ProtectedRoute>
  );
}
