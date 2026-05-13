import { hashPassword } from './auth';

// Mock database - In production, replace with real database
let db = {
  users: [
    {
      id: '1',
      email: 'admin@hrms.com',
      password: hashPassword('admin123'),
      name: 'Admin User',
      role: 'admin',
      department: 'Management',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'hr@hrms.com',
      password: hashPassword('hr123'),
      name: 'HR Manager',
      role: 'hr_manager',
      department: 'HR',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'manager@hrms.com',
      password: hashPassword('manager123'),
      name: 'John Manager',
      role: 'manager',
      department: 'Engineering',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      email: 'employee@hrms.com',
      password: hashPassword('emp123'),
      name: 'John Employee',
      role: 'employee',
      department: 'Engineering',
      createdAt: new Date().toISOString(),
    },
  ],
  employees: [
    {
      id: '1',
      userId: '4',
      name: 'John Employee',
      email: 'employee@hrms.com',
      phone: '+1234567890',
      designation: 'Software Engineer',
      department: 'Engineering',
      reportingManager: 'John Manager',
      joinDate: '2022-01-15',
      salary: 60000,
      status: 'active',
      avatar: 'https://via.placeholder.com/150?text=JE',
    },
    {
      id: '2',
      userId: '3',
      name: 'John Manager',
      email: 'manager@hrms.com',
      phone: '+1234567891',
      designation: 'Engineering Manager',
      department: 'Engineering',
      reportingManager: 'Admin User',
      joinDate: '2020-06-01',
      salary: 80000,
      status: 'active',
      avatar: 'https://via.placeholder.com/150?text=JM',
    },
  ],
  attendance: [
    {
      id: '1',
      employeeId: '1',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00:00',
      checkOut: '17:30:00',
      status: 'present',
    },
    {
      id: '2',
      employeeId: '1',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      checkIn: '09:15:00',
      checkOut: '17:45:00',
      status: 'present',
    },
  ],
  leaveApplications: [
    {
      id: '1',
      employeeId: '1',
      type: 'sick',
      startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      reason: 'Not feeling well',
      status: 'pending',
      appliedOn: new Date().toISOString(),
      approvedBy: null,
    },
  ],
  documents: [
    {
      id: '1',
      employeeId: '1',
      name: 'Resume',
      type: 'pdf',
      uploadedAt: new Date().toISOString(),
      url: '#',
    },
  ],
  notifications: [],
};

// Database operations
export const dbOps = {
  // User operations
  findUserByEmail: (email) => {
    return db.users.find((u) => u.email === email);
  },

  findUserById: (id) => {
    return db.users.find((u) => u.id === id);
  },

  createUser: (userData) => {
    const id = String(db.users.length + 1);
    const user = { ...userData, id, createdAt: new Date().toISOString() };
    db.users.push(user);
    return user;
  },

  // Employee operations
  getEmployees: () => [...db.employees],

  getEmployeeById: (id) => {
    return db.employees.find((e) => e.id === id);
  },

  getEmployeeByUserId: (userId) => {
    return db.employees.find((e) => e.userId === userId);
  },

  createEmployee: (employeeData) => {
    const id = String(db.employees.length + 1);
    const employee = { ...employeeData, id };
    db.employees.push(employee);
    return employee;
  },

  updateEmployee: (id, data) => {
    const index = db.employees.findIndex((e) => e.id === id);
    if (index !== -1) {
      db.employees[index] = { ...db.employees[index], ...data };
      return db.employees[index];
    }
    return null;
  },

  // Attendance operations
  getAttendanceByEmployee: (employeeId) => {
    return db.attendance.filter((a) => a.employeeId === employeeId);
  },

  getAttendanceByDate: (date) => {
    return db.attendance.filter((a) => a.date === date);
  },

  createAttendance: (attendanceData) => {
    const id = String(db.attendance.length + 1);
    const record = { ...attendanceData, id };
    db.attendance.push(record);
    return record;
  },

  updateAttendance: (id, data) => {
    const index = db.attendance.findIndex((a) => a.id === id);
    if (index !== -1) {
      db.attendance[index] = { ...db.attendance[index], ...data };
      return db.attendance[index];
    }
    return null;
  },

  // Leave operations
  getLeaveApplications: (filters = {}) => {
    let leaves = [...db.leaveApplications];
    if (filters.employeeId) {
      leaves = leaves.filter((l) => l.employeeId === filters.employeeId);
    }
    if (filters.status) {
      leaves = leaves.filter((l) => l.status === filters.status);
    }
    return leaves;
  },

  createLeaveApplication: (leaveData) => {
    const id = String(db.leaveApplications.length + 1);
    const leave = { ...leaveData, id, appliedOn: new Date().toISOString() };
    db.leaveApplications.push(leave);
    return leave;
  },

  approveLeave: (leaveId, approvedBy) => {
    const leave = db.leaveApplications.find((l) => l.id === leaveId);
    if (leave) {
      leave.status = 'approved';
      leave.approvedBy = approvedBy;
    }
    return leave;
  },

  rejectLeave: (leaveId, approvedBy) => {
    const leave = db.leaveApplications.find((l) => l.id === leaveId);
    if (leave) {
      leave.status = 'rejected';
      leave.approvedBy = approvedBy;
    }
    return leave;
  },

  // Document operations
  getDocuments: (employeeId) => {
    return db.documents.filter((d) => d.employeeId === employeeId);
  },

  addDocument: (documentData) => {
    const id = String(db.documents.length + 1);
    const doc = { ...documentData, id, uploadedAt: new Date().toISOString() };
    db.documents.push(doc);
    return doc;
  },

  // Notification operations
  getNotifications: (userId) => {
    return db.notifications.filter((n) => n.userId === userId);
  },

  addNotification: (notificationData) => {
    const id = String(db.notifications.length + 1);
    const notification = {
      ...notificationData,
      id,
      createdAt: new Date().toISOString(),
      read: false,
    };
    db.notifications.push(notification);
    return notification;
  },

  // Reset database (for demo)
  resetDb: () => {
    db = { ...db };
  },
};

export default db;
