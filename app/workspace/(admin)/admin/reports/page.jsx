'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ChevronRight } from 'lucide-react';

function ReportsContent() {
  const { user } = useAuth();

  const reports = [
    {
      id: '1',
      name: 'Monthly Attendance Report',
      description: 'Employee attendance summary for the current month',
      category: 'Attendance',
      icon: '📊',
    },
    {
      id: '2',
      name: 'Leave Summary Report',
      description: 'Department-wise leave application and approval status',
      category: 'Leave',
      icon: '🏖️',
    },
    {
      id: '3',
      name: 'Employee Directory',
      description: 'Complete employee list with contact information',
      category: 'Employee',
      icon: '👥',
    },
    {
      id: '4',
      name: 'Salary Report',
      description: 'Monthly salary distribution and payroll summary',
      category: 'Payroll',
      icon: '💰',
    },
    {
      id: '5',
      name: 'Department Performance',
      description: 'Department-wise attendance and productivity metrics',
      category: 'Analytics',
      icon: '📈',
    },
    {
      id: '6',
      name: 'Compliance Report',
      description: 'HR compliance and policy adherence metrics',
      category: 'Compliance',
      icon: '✓',
    },
  ];

  const handleGenerateReport = (reportId) => {
    console.log('[v0] Generating report:', reportId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Attendance: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      Leave: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      Employee: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      Payroll: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      Analytics: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
      Compliance: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    };
    return colors[category] || colors.Analytics;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
            Generate and export HR reports for analysis and decision making
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Reports Generated
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
                24
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                This Month
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
                8
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Scheduled Reports
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
                5
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Export Formats
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
                3
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText size={20} />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-0">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 bg-secondary dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 hover:border-accent dark:hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground dark:text-white truncate text-sm sm:text-base">
                        {report.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                    <span className="text-lg flex-shrink-0">{report.icon}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border dark:border-slate-700">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(report.category)}`}>
                      {report.category}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => handleGenerateReport(report.id)}
                      className="w-full sm:w-auto text-xs sm:text-sm py-2 flex items-center justify-center gap-2 min-h-[44px] sm:min-h-auto"
                    >
                      <Download size={16} />
                      Generate
                    </Button>
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

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  );
}
