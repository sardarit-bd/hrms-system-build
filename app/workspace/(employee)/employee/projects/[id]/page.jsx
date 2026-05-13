'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProjectById, getTasksByProjectId } from '@/lib/demo-data/projects';
import {
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const project = getProjectById(params.id);
  const tasks = getTasksByProjectId(params.id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const priorityColors = {
    critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    low: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    planning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <button className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-md">
              <ArrowLeft size={24} className="text-foreground dark:text-white" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground dark:text-white">{project.name}</h1>
            <p className="text-muted-foreground dark:text-gray-400 mt-1">{project.description}</p>
          </div>
          <button className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-md">
            <MoreVertical size={24} className="text-muted-foreground" />
          </button>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
              {project.status === 'completed' && <CheckCircle size={16} className="mr-2" />}
              {project.status === 'in_progress' && <Clock size={16} className="mr-2" />}
              {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
            </span>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Priority</p>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${priorityColors[project.priority]}`}>
              <Flag size={16} />
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
            </span>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Deadline</p>
            <p className="text-lg font-bold text-foreground dark:text-white">
              {new Date(project.deadline).toLocaleDateString()}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Progress</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-lg font-bold text-accent">{project.progress}%</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-border dark:border-slate-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'team'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Team
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Budget */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Budget Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Budget</span>
                    <span className="text-lg font-bold text-foreground dark:text-white">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Spent</span>
                    <span className="text-lg font-bold text-orange-600">
                      ${project.spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${(project.spent / project.budget) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(project.budget - project.spent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Calendar className="text-accent" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="text-foreground dark:text-white font-medium">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="text-orange-500" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="text-foreground dark:text-white font-medium">
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="text-red-500" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-foreground dark:text-white font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Project Owner */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Project Owner</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    {project.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground dark:text-white">{project.owner.name}</p>
                    <p className="text-xs text-muted-foreground">Project Manager</p>
                  </div>
                </div>
              </Card>

              {/* Department */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Department</h3>
                <p className="text-foreground dark:text-white font-medium">{project.department}</p>
              </Card>

              {/* Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tasks</span>
                    <span className="font-bold text-foreground dark:text-white">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-bold text-green-600">{tasks.filter((t) => t.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="font-bold text-blue-600">{tasks.filter((t) => t.status === 'in_progress').length}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Showing {tasks.length} tasks</p>
              <Button className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2">
                <Plus size={20} />
                Add Task
              </Button>
            </div>

            {tasks.map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-foreground dark:text-white">{task.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{task.assignedTo.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-md">
                    <MoreVertical size={20} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-bold text-accent">{task.progress}%</span>
                  </div>
                  <div className="h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.team.map((member) => (
              <Card key={member.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground dark:text-white">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground">
                    <Edit size={16} />
                  </Button>
                  <Button className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 hover:dark:bg-red-900/30 text-red-600">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
