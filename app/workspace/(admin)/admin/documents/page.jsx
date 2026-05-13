'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Upload, FileText, Download, Trash2, CheckCircle, Clock, X } from 'lucide-react';

function DocumentsContent() {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const documents = [
    {
      id: '1',
      name: 'Resume.pdf',
      type: 'Resume',
      uploadedAt: new Date(Date.now() - 604800000).toLocaleDateString(),
      size: '245 KB',
      status: 'Verified',
    },
    {
      id: '2',
      name: 'IdentityProof.pdf',
      type: 'Identity Proof',
      uploadedAt: new Date(Date.now() - 1209600000).toLocaleDateString(),
      size: '512 KB',
      status: 'Verified',
    },
    {
      id: '3',
      name: 'EducationCertificate.pdf',
      type: 'Education Certificate',
      uploadedAt: new Date(Date.now() - 1814400000).toLocaleDateString(),
      size: '384 KB',
      status: 'Pending',
    },
  ];

  const policies = [
    {
      id: '1',
      name: 'Leave Policy 2024',
      category: 'HR Policy',
      uploadedAt: new Date(Date.now() - 2592000000).toLocaleDateString(),
    },
    {
      id: '2',
      name: 'Code of Conduct',
      category: 'HR Policy',
      uploadedAt: new Date(Date.now() - 2592000000).toLocaleDateString(),
    },
    {
      id: '3',
      name: 'Company Handbook',
      category: 'HR Policy',
      uploadedAt: new Date(Date.now() - 2592000000).toLocaleDateString(),
    },
  ];

  const getStatusColor = (status) => {
    return status === 'Verified'
      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
  };

  const getStatusIcon = (status) => {
    return status === 'Verified' ? <CheckCircle size={16} /> : <Clock size={16} />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
              Documents
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              Manage and upload your documents
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto"
          >
            + Upload Document
          </Button>
        </div>

        {/* Your Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText size={20} />
              Your Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border dark:border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Document Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Uploaded
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground dark:text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-border dark:border-slate-700 hover:bg-secondary dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground dark:text-white">
                        {doc.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {doc.type}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {doc.uploadedAt}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-gray-400">
                        {doc.size}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-secondary dark:hover:bg-slate-700 rounded transition-colors">
                            <Download size={16} className="text-accent" />
                          </button>
                          <button className="p-2 hover:bg-secondary dark:hover:bg-slate-700 rounded transition-colors">
                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-secondary dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground dark:text-white text-sm truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                        {doc.type}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs mb-3 pb-3 border-b border-border dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Size:
                      </span>
                      <span className="text-foreground dark:text-white font-medium">
                        {doc.size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Uploaded:
                      </span>
                      <span className="text-foreground dark:text-white font-medium">
                        {doc.uploadedAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-medium min-h-[44px]">
                      <Download size={16} />
                      Download
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs font-medium min-h-[44px]">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText size={20} />
              Company Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="p-4 bg-secondary dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 hover:border-accent transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="text-accent flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground dark:text-white text-sm truncate">
                        {policy.name}
                      </h3>
                      <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                        {policy.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border dark:border-slate-700">
                    <span className="text-xs text-muted-foreground dark:text-gray-400">
                      {policy.uploadedAt}
                    </span>
                    <button className="p-2 hover:bg-secondary dark:hover:bg-slate-700 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Download size={16} className="text-accent" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl w-full sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="text-lg sm:text-2xl font-bold text-foreground dark:text-white">
                Upload Document
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base min-h-[44px]">
                  <option>Resume</option>
                  <option>Identity Proof</option>
                  <option>Education Certificate</option>
                  <option>Experience Letter</option>
                  <option>Other</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Select File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-border dark:border-slate-700 rounded-lg p-6 sm:p-8 text-center hover:border-accent transition-colors">
                  <Upload className="mx-auto text-muted-foreground mb-2" size={32} />
                  <p className="text-sm font-medium text-foreground dark:text-white mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowUploadModal(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  Upload Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <DocumentsContent />
    </ProtectedRoute>
  );
}
