import {
  DashboardStats,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollSlip,
  JobPosting,
  Candidate,
  AssetItem,
  User,
} from './types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('worknest_auth_token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errData = await response.json();
      errorDetail = errData.detail || errData.message || JSON.stringify(errData);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Health Probe
  checkHealth: () => fetchJson<{ status: string; service: string; database: string }>(`${API_BASE}/health`),

  // Authentication & Session
  login: async (username: string, password: string): Promise<{ access_token: string; user: User }> => {
    const data = await fetchJson<{ access_token: string; user: User }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('worknest_auth_token', data.access_token);
    localStorage.setItem('worknest_user', JSON.stringify(data.user));
    return data;
  },

  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem('worknest_user');
    return saved ? JSON.parse(saved) : null;
  },

  logout: () => {
    localStorage.removeItem('worknest_auth_token');
    localStorage.removeItem('worknest_user');
  },

  // 1-Click Role Switcher
  switchPersona: async (role: 'admin' | 'manager' | 'employee'): Promise<User> => {
    let username = 'admin';
    let password = 'admin';
    if (role === 'manager') {
      username = 'manager1';
      password = 'password@123';
    } else if (role === 'employee') {
      username = 'employee1';
      password = 'password@123';
    }
    const res = await api.login(username, password);
    return res.user;
  },

  // Dashboard Aggregates
  getStats: (): Promise<DashboardStats> => fetchJson<DashboardStats>(`${API_BASE}/dashboard/stats`),

  // Employee Directory
  getEmployees: (department?: string): Promise<Employee[]> => {
    const url = department && department !== 'All' 
      ? `${API_BASE}/employees/?department=${encodeURIComponent(department)}` 
      : `${API_BASE}/employees/`;
    return fetchJson<Employee[]>(url);
  },

  createEmployee: (emp: Omit<Employee, 'id' | 'employee_id' | 'date_of_joining'>): Promise<Employee> => {
    return fetchJson<Employee>(`${API_BASE}/employees/`, {
      method: 'POST',
      body: JSON.stringify(emp),
    });
  },

  // Attendance & Time Logging
  getAttendance: (dateStr?: string, employeeId?: number): Promise<AttendanceRecord[]> => {
    const params = new URLSearchParams();
    if (dateStr) params.append('target_date', dateStr);
    if (employeeId) params.append('employee_id', employeeId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<AttendanceRecord[]>(`${API_BASE}/attendance/${query}`);
  },

  punchAttendance: (employeeId?: number, punchType: 'clock_in' | 'clock_out' = 'clock_in'): Promise<{ message: string; status: string }> => {
    return fetchJson(`${API_BASE}/attendance/punch`, {
      method: 'POST',
      body: JSON.stringify({ employee_id: employeeId, punch_type: punchType }),
    });
  },

  // Leave Management
  getLeaves: (status?: string, employeeId?: number): Promise<LeaveRequest[]> => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (employeeId) params.append('employee_id', employeeId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<LeaveRequest[]>(`${API_BASE}/leaves/${query}`);
  },

  applyLeave: (leave: { employee_id?: number; leave_type: string; start_date: string; end_date: string; days: number; reason?: string }): Promise<LeaveRequest> => {
    return fetchJson<LeaveRequest>(`${API_BASE}/leaves/apply`, {
      method: 'POST',
      body: JSON.stringify(leave),
    });
  },

  approveLeave: (id: number): Promise<{ message: string }> => {
    return fetchJson(`${API_BASE}/leaves/${id}/approve`, { method: 'POST' });
  },

  rejectLeave: (id: number): Promise<{ message: string }> => {
    return fetchJson(`${API_BASE}/leaves/${id}/reject`, { method: 'POST' });
  },

  // Payroll & Salary Slips
  getPayroll: (month?: string, year?: number, employeeId?: number): Promise<PayrollSlip[]> => {
    const params = new URLSearchParams();
    if (month && month !== 'All') params.append('month', month);
    if (year) params.append('year', year.toString());
    if (employeeId) params.append('employee_id', employeeId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<PayrollSlip[]>(`${API_BASE}/payroll/${query}`);
  },

  // Recruitment & ATS Pipeline
  getJobs: (): Promise<JobPosting[]> => fetchJson<JobPosting[]>(`${API_BASE}/recruitment/jobs`),
  getCandidates: (): Promise<Candidate[]> => fetchJson<Candidate[]>(`${API_BASE}/recruitment/candidates`),

  // IT Assets Registry
  getAssets: (): Promise<AssetItem[]> => fetchJson<AssetItem[]>(`${API_BASE}/assets/`),
  createAsset: (asset: Omit<AssetItem, 'id' | 'purchase_date'>): Promise<AssetItem> => {
    return fetchJson<AssetItem>(`${API_BASE}/assets/`, {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  },
};
