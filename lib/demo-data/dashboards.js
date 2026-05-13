export const dashboardMetrics = {
  admin: {
    metrics: [
      { label: 'Total Employees', value: 245, change: '+12', color: 'blue' },
      { label: 'Active Projects', value: 8, change: '+2', color: 'green' },
      { label: 'Leave Approvals', value: 23, change: '+5', color: 'orange' },
      { label: 'Department Heads', value: 6, change: '0', color: 'purple' },
      { label: 'System Health', value: '99.8%', change: '+0.2%', color: 'green' },
      { label: 'Avg Attendance', value: '94%', change: '-2%', color: 'orange' },
    ],
    recentActivities: [
      { id: 1, type: 'employee_added', user: 'John Smith', description: 'Added new employee', time: '2 hours ago' },
      { id: 2, type: 'project_started', user: 'Sarah Johnson', description: 'Started Website Redesign project', time: '5 hours ago' },
      { id: 3, type: 'leave_approved', user: 'HR Team', description: 'Approved 3 leave requests', time: '1 day ago' },
      { id: 4, type: 'department_update', user: 'Admin', description: 'Updated IT department structure', time: '2 days ago' },
    ],
  },
  hr_manager: {
    metrics: [
      { label: 'Total Employees', value: 245, change: '+12', color: 'blue' },
      { label: 'Pending Approvals', value: 23, change: '+5', color: 'orange' },
      { label: 'New Hires (This Month)', value: 8, change: '+3', color: 'green' },
      { label: 'Leave Balance Alerts', value: 15, change: '+4', color: 'red' },
      { label: 'Payroll Processed', value: '98%', change: '+2%', color: 'green' },
      { label: 'Training Programs', value: 12, change: '+1', color: 'blue' },
    ],
    pendingApprovals: [
      { id: 1, type: 'leave', employee: 'Emma Wilson', days: 3, reason: 'Personal leave', status: 'pending' },
      { id: 2, type: 'expense', employee: 'James Lee', amount: 1500, reason: 'Conference ticket', status: 'pending' },
      { id: 3, type: 'leave', employee: 'Nina Patel', days: 5, reason: 'Vacation', status: 'pending' },
    ],
  },
  dept_head: {
    metrics: [
      { label: 'Department Size', value: 42, change: '+2', color: 'blue' },
      { label: 'Active Projects', value: 5, change: '+1', color: 'green' },
      { label: 'Team Members', value: 42, change: '0', color: 'blue' },
      { label: 'Leave Requests', value: 7, change: '+2', color: 'orange' },
      { label: 'Avg Productivity', value: '88%', change: '+5%', color: 'green' },
      { label: 'Open Positions', value: 3, change: '+1', color: 'orange' },
    ],
    teamPerformance: [
      { name: 'John Doe', role: 'Senior Developer', performance: 95, status: 'excellent' },
      { name: 'Emma Wilson', role: 'Developer', performance: 82, status: 'good' },
      { name: 'James Lee', role: 'Developer', performance: 78, status: 'good' },
      { name: 'Nina Patel', role: 'Junior Developer', performance: 72, status: 'satisfactory' },
      { name: 'Oliver Davis', role: 'Developer', performance: 85, status: 'good' },
    ],
  },
  manager: {
    metrics: [
      { label: 'Team Size', value: 8, change: '0', color: 'blue' },
      { label: 'Active Tasks', value: 24, change: '+3', color: 'orange' },
      { label: 'Completed (This Week)', value: 12, change: '+5', color: 'green' },
      { label: 'Pending Approvals', value: 5, change: '+1', color: 'orange' },
      { label: 'Team Attendance', value: '96%', change: '+1%', color: 'green' },
      { label: 'Project Progress', value: '65%', change: '+8%', color: 'green' },
    ],
    teamMembers: [
      { id: 1, name: 'John Doe', role: 'Senior Developer', status: 'online', tasks: 4 },
      { id: 2, name: 'Emma Wilson', role: 'Developer', status: 'online', tasks: 5 },
      { id: 3, name: 'James Lee', role: 'Developer', status: 'offline', tasks: 3 },
      { id: 4, name: 'Nina Patel', role: 'Developer', status: 'online', tasks: 4 },
      { id: 5, name: 'Oliver Davis', role: 'Developer', status: 'online', tasks: 6 },
      { id: 6, name: 'Chris Brown', role: 'QA Engineer', status: 'offline', tasks: 2 },
    ],
  },
  employee: {
    metrics: [
      { label: 'Leave Balance', value: '12 days', change: '-2 days', color: 'blue' },
      { label: 'Tasks Assigned', value: 4, change: '+1', color: 'orange' },
      { label: 'Tasks Completed', value: 24, change: '+2', color: 'green' },
      { label: 'Attendance', value: '97%', change: '+1%', color: 'green' },
      { label: 'Performance', value: '88%', change: '+3%', color: 'green' },
      { label: 'Salary Status', value: 'Processed', change: '', color: 'green' },
    ],
    myTasks: [
      { id: 1, title: 'Frontend development - Header', project: 'Website Redesign', priority: 'high', dueDate: '2024-02-10', status: 'in_progress' },
      { id: 2, title: 'Code review for API endpoints', project: 'Website Redesign', priority: 'medium', dueDate: '2024-02-08', status: 'in_progress' },
      { id: 3, title: 'Write unit tests', project: 'Website Redesign', priority: 'medium', dueDate: '2024-02-15', status: 'pending' },
      { id: 4, title: 'Documentation update', project: 'Website Redesign', priority: 'low', dueDate: '2024-02-20', status: 'pending' },
    ],
  },
};

export const departmentStats = {
  departments: [
    { name: 'IT', employees: 52, projects: 5, avgSalary: 95000, head: 'Sarah Wilson' },
    { name: 'HR', employees: 12, projects: 1, avgSalary: 65000, head: 'Lisa Anderson' },
    { name: 'Sales', employees: 45, projects: 3, avgSalary: 75000, head: 'Michael Brown' },
    { name: 'Marketing', employees: 28, projects: 4, avgSalary: 70000, head: 'Jessica Lee' },
    { name: 'Finance', employees: 18, projects: 2, avgSalary: 85000, head: 'David Chen' },
    { name: 'Operations', employees: 90, projects: 6, avgSalary: 62000, head: 'Robert Taylor' },
  ],
};

export const attendanceStats = [
  { date: 'Mon', present: 235, absent: 8, late: 2 },
  { date: 'Tue', present: 238, absent: 5, late: 2 },
  { date: 'Wed', present: 240, absent: 3, late: 2 },
  { date: 'Thu', present: 236, absent: 7, late: 2 },
  { date: 'Fri', present: 232, absent: 10, late: 3 },
  { date: 'Sat', present: 45, absent: 200, late: 0 },
  { date: 'Sun', present: 0, absent: 245, late: 0 },
];

export const leaveStats = [
  { type: 'Casual', total: 12, used: 8, remaining: 4 },
  { type: 'Sick', total: 8, used: 3, remaining: 5 },
  { type: 'Annual', total: 20, used: 15, remaining: 5 },
  { type: 'Maternity', total: 90, used: 0, remaining: 90 },
];

export const projectStats = [
  { status: 'completed', count: 18 },
  { status: 'in_progress', count: 8 },
  { status: 'planning', count: 3 },
  { status: 'on_hold', count: 2 },
];
