'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

function EmployeeDetailContent() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employees/${employeeId}`);
        const data = await response.json();
        setEmployee(data.employee);
        setFormData(data.employee);
      } catch (error) {
        console.error('[v0] Failed to fetch employee:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setEmployee(data.employee);
      setIsEditing(false);
    } catch (error) {
      console.error('[v0] Failed to update employee:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Employee not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-accent hover:text-accent/80"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground dark:text-white">
                {employee.name}
              </h1>
              <p className="text-muted-foreground dark:text-gray-400">
                {employee.designation}
              </p>
            </div>
          </div>
          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Save' : 'Edit Profile'}
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white disabled:bg-secondary dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white disabled:bg-secondary dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white disabled:bg-secondary dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white disabled:bg-secondary dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white disabled:bg-secondary dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.joinDate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white disabled:bg-secondary dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                  Reporting Manager
                </p>
                <p className="font-medium text-foreground dark:text-white">
                  {formData.reportingManager || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                  Status
                </p>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                  ✓ {formData.status || 'Active'}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                  Salary
                </p>
                <p className="font-medium text-foreground dark:text-white">
                  ${formData.salary?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Attendance Rate
              </p>
              <p className="text-3xl font-bold text-primary dark:text-white">
                91%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Leaves Used
              </p>
              <p className="text-3xl font-bold text-primary dark:text-white">
                8/30
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                Documents
              </p>
              <p className="text-3xl font-bold text-primary dark:text-white">
                5
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function EmployeeDetailPage() {
  return (
    <ProtectedRoute>
      <EmployeeDetailContent />
    </ProtectedRoute>
  );
}
