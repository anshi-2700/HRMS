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
  const token = localStorage.getItem('nexus_auth_token');
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
  // Health
  checkHealth: () => fetchJson<{ status: string; service: string; database: string }>(`${API_BASE}/health`),

  // Auth
  login: async (username: string, password: string): Promise<{ access_token: string; user: User }> => {
    const data = await fetchJson<{ access_token: string; user: User }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('nexus_auth_token', data.access_token);
    localStorage.setItem('nexus_user', JSON.stringify(data.user));
    return data;
  },

  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  },

  logout: () => {
    localStorage.removeItem('nexus_auth_token');
    localStorage.removeItem('nexus_user');
  },

  // Dashboard
  getStats: (): Promise<DashboardStats> => fetchJson<DashboardStats>(`${API_BASE}/dashboard/stats`),

  // Employees
  getEmployees: (department?: string): Promise<Employee[]> => {
    const url = department ? `${API_BASE}/employees/?department=${encodeURIComponent(department)}` : `${API_BASE}/employees/`;
    return fetchJson<Employee[]>(url);
  },

  createEmployee: (emp: Omit<Employee, 'id' | 'employee_id' | 'date_of_joining'>): Promise<Employee> => {
    return fetchJson<Employee>(`${API_BASE}/employees/`, {
      method: 'POST',
      body: JSON.stringify(emp),
    });
  },

  // Attendance
  getAttendance: (dateStr?: string): Promise<AttendanceRecord[]> => {
    const url = dateStr ? `${API_BASE}/attendance/?target_date=${dateStr}` : `${API_BASE}/attendance/`;
    return fetchJson<AttendanceRecord[]>(url);
  },

  punchAttendance: (employeeId: number, punchType: 'clock_in' | 'clock_out'): Promise<{ message: string; status: string }> => {
    return fetchJson(`${API_BASE}/attendance/punch`, {
      method: 'POST',
      body: JSON.stringify({ employee_id: employeeId, punch_type: punchType }),
    });
  },

  // Leaves
  getLeaves: (status?: string): Promise<LeaveRequest[]> => {
    const url = status ? `${API_BASE}/leaves/?status=${status}` : `${API_BASE}/leaves/`;
    return fetchJson<LeaveRequest[]>(url);
  },

  applyLeave: (leave: { employee_id: number; leave_type: string; start_date: string; end_date: string; days: number; reason?: string }): Promise<LeaveRequest> => {
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

  // Payroll
  getPayroll: (month?: string, year?: number): Promise<PayrollSlip[]> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<PayrollSlip[]>(`${API_BASE}/payroll/${query}`);
  },

  // Recruitment
  getJobs: (): Promise<JobPosting[]> => fetchJson<JobPosting[]>(`${API_BASE}/recruitment/jobs`),
  getCandidates: (): Promise<Candidate[]> => fetchJson<Candidate[]>(`${API_BASE}/recruitment/candidates`),

  // Assets
  getAssets: (): Promise<AssetItem[]> => fetchJson<AssetItem[]>(`${API_BASE}/assets/`),
  createAsset: (asset: Omit<AssetItem, 'id' | 'purchase_date'>): Promise<AssetItem> => {
    return fetchJson<AssetItem>(`${API_BASE}/assets/`, {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  },
};
