'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

function LeaveContent() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sick',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const leaveApplications = [
    {
      id: '1',
      type: 'Sick Leave',
      startDate: new Date(Date.now() + 86400000).toLocaleDateString(),
      endDate: new Date(Date.now() + 86400000).toLocaleDateString(),
      reason: 'Not feeling well',
      status: 'pending',
      appliedOn: new Date().toLocaleDateString(),
    },
    {
      id: '2',
      type: 'Casual Leave',
      startDate: new Date(Date.now() - 604800000).toLocaleDateString(),
      endDate: new Date(Date.now() - 604800000).toLocaleDateString(),
      reason: 'Personal work',
      status: 'approved',
      approvedOn: new Date(Date.now() - 604800000).toLocaleDateString(),
    },
  ];

  const leaveBalance = {
    casual: { total: 12, used: 2, remaining: 10 },
    sick: { total: 10, used: 1, remaining: 9 },
    annual: { total: 20, used: 5, remaining: 15 },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setFormData({ type: 'sick', startDate: '', endDate: '', reason: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'pending':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
              Leave Management
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              Apply and track your leave requests
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
          >
            + Apply for Leave
          </Button>
        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(leaveBalance).map(([type, data]) => (
            <Card key={type}>
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground dark:text-white capitalize mb-1">
                    {type} Leave
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    Balance
                  </p>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Used
                      </span>
                      <span className="font-medium text-foreground dark:text-white">
                        {data.used}/{data.total}
                      </span>
                    </div>
                    <div className="w-full bg-secondary dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{
                          width: `${(data.used / data.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border dark:border-slate-700">
                    <p className="text-xs sm:text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Remaining:{' '}
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {data.remaining}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leave Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar size={20} />
              Leave Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border dark:border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Start Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      End Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Reason
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-border dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground dark:text-white">
                        {app.type}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {app.startDate}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {app.endDate}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {app.reason}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-4">
              {leaveApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-secondary dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-foreground dark:text-white text-sm">
                      {app.type}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Period:
                      </span>
                      <span className="text-foreground dark:text-white font-medium">
                        {app.startDate} to {app.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Reason:
                      </span>
                      <span className="text-foreground dark:text-white font-medium text-right">
                        {app.reason}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border dark:border-slate-600">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Applied On:
                      </span>
                      <span className="text-foreground dark:text-white font-medium">
                        {app.appliedOn}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl w-full sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="text-lg sm:text-2xl font-bold text-foreground dark:text-white">
                Apply for Leave
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base min-h-[44px]"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base min-h-[44px]"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base min-h-[44px]"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base resize-none min-h-[100px]"
                  placeholder="Enter your reason for leave"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  Apply for Leave
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function LeavePage() {
  return (
    <ProtectedRoute>
      <LeaveContent />
    </ProtectedRoute>
  );
}
