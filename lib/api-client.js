const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // For development debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Token expired or invalid
        this.setToken(null);
        if (typeof window !== 'undefined') {
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
      }
      throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data;
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.data?.access_token) {
      this.setToken(data.data.access_token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async refreshToken() {
    return this.request('/auth/refresh', { method: 'POST' });
  }

  // User endpoints
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updateUserStatus(userId, status) {
    return this.request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  // Role endpoints
  async assignRole(userId, role) {
    return this.request('/roles/assign', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, role }),
    });
  }

  async getRoles() {
    return this.request('/roles');
  }

  // Department endpoints
  async getDepartments(activeOnly = false) {
    const params = activeOnly ? '?is_active=true' : '';
    return this.request(`/departments${params}`);
  }

  // Shift endpoints
  async getShifts() {
    return this.request('/shifts');
  }

  async getFixedShifts() {
    return this.request('/shifts/list/fixed');
  }

  // Roster endpoints
  async assignRoster(userId, shiftId, weekendDays, effectiveFrom) {
    return this.request('/roster', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        shift_id: shiftId,
        weekend_days: weekendDays,
        effective_from: effectiveFrom,
      }),
    });
  }

  async getUserRoster(userId) {
    return this.request(`/roster/user/${userId}`);
  }

  // Attendance Policy endpoints
  async assignAttendancePolicy(userId, policyId, effectiveFrom) {
    return this.request('/attendance/policies/assign', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        attendance_policy_id: policyId,
        effective_from: effectiveFrom,
      }),
    });
  }

  async getAttendancePolicies() {
    return this.request('/attendance/policies');
  }

  // Leave endpoints
  async getLeaveRequests(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/leave/requests${params ? `?${params}` : ''}`);
  }

  async createLeaveRequest(leaveData) {
    return this.request('/leave/requests', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async getLeaveTypes() {
    return this.request('/leave/types');
  }
}

export const apiClient = new ApiClient();