'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/demo-data/projects';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Briefcase,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewProject, setShowNewProject] = useState(false);

  const statuses = {
    completed: { label: 'Completed', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400', icon: CheckCircle },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400', icon: Clock },
    planning: { label: 'Planning', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400', icon: AlertCircle },
    on_hold: { label: 'On Hold', color: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400', icon: AlertCircle },
  };

  const priorities = {
    critical: { label: 'Critical', color: 'text-red-600 dark:text-red-400' },
    high: { label: 'High', color: 'text-orange-600 dark:text-orange-400' },
    medium: { label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' },
    low: { label: 'Low', color: 'text-green-600 dark:text-green-400' },
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
              Manage and track all company projects
            </p>
          </div>
          <Button
            onClick={() => setShowNewProject(!showNewProject)}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground dark:text-white mt-1">
                  {projects.length}
                </p>
              </div>
              <Briefcase className="text-accent flex-shrink-0" size={24} />
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {projects.filter((p) => p.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  Completed
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {projects.filter((p) => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  Team Members
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {new Set(projects.flatMap((p) => p.team.map((t) => t.id))).size}
                </p>
              </div>
              <Users className="text-purple-600 dark:text-purple-400 flex-shrink-0" size={24} />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base min-h-[44px] sm:min-h-auto"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 sm:py-2 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base min-h-[44px] sm:min-h-auto"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = statuses[project.status].icon;
            return (
              <Link key={project.id} href={`/workspace/admin/projects/${project.id}`}>
                <Card className="h-full hover:shadow-lg hover:border-accent transition-all cursor-pointer">
                  <div className="p-4 sm:p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground dark:text-white truncate text-base sm:text-lg">
                          {project.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-md transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center">
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </button>
                    </div>

                    {/* Status and Priority */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statuses[project.status].color}`}>
                        <StatusIcon size={14} />
                        {statuses[project.status].label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary dark:bg-slate-800 ${priorities[project.priority].color}`}>
                        {priorities[project.priority].label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                          Progress
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-foreground dark:text-white">
                          {project.progress}%
                        </p>
                      </div>
                      <div className="w-full bg-secondary dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="space-y-2 mb-4 text-xs sm:text-sm flex-1">
                      <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                        <Calendar size={16} />
                        <span>
                          {new Date(project.startDate).toLocaleDateString()} -{' '}
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                        <Users size={16} />
                        <span>{project.team.length} Team Members</span>
                      </div>
                    </div>

                    {/* Footer with Arrow */}
                    <div className="flex items-center justify-between text-accent pt-4 border-t border-border dark:border-slate-700">
                      <span className="text-xs sm:text-sm font-medium">
                        View Details
                      </span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground dark:text-gray-400">
              No projects found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
