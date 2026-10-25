/**
 * Nexus Workforce OS API Client
 * Enterprise REST API connection
 */

const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Support session cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  // System Health
  getHealth: () => fetchJSON('/health'),

  // Authentication
  login: (username, password) =>
    fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () => fetchJSON('/auth/logout', { method: 'POST' }),

  getMe: () => fetchJSON('/auth/me'),

  // Dashboard Stats
  getDashboardStats: () => fetchJSON('/dashboard/stats'),

  // Employees & Departments
  getEmployees: (search = '', department = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (department) params.append('department', department);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJSON(`/employees${query}`);
  },

  getEmployee: (id) => fetchJSON(`/employees/${id}`),

  createEmployee: (data) =>
    fetchJSON('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteEmployee: (id) => fetchJSON(`/employees/${id}`, { method: 'DELETE' }),

  getDepartments: () => fetchJSON('/departments'),

  createDepartment: (name) =>
    fetchJSON('/departments', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  getDesignations: (departmentId = null) => {
    const query = departmentId ? `?department_id=${departmentId}` : '';
    return fetchJSON(`/designations${query}`);
  },

  createDesignation: (name, departmentId) =>
    fetchJSON('/designations', {
      method: 'POST',
      body: JSON.stringify({ name, department_id: departmentId }),
    }),

  // Attendance
  getTodayAttendance: () => fetchJSON('/attendance/today'),

  clockIn: (employeeId = null, status = 'present') =>
    fetchJSON('/attendance/clock-in', {
      method: 'POST',
      body: JSON.stringify({ employee_id: employeeId, status }),
    }),

  // Leaves
  getLeaveTypes: () => fetchJSON('/leaves/types'),

  getLeaveRequests: () => fetchJSON('/leaves/requests'),

  applyLeave: (data) =>
    fetchJSON('/leaves/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  approveLeave: (leaveId) =>
    fetchJSON(`/leaves/${leaveId}/approve`, { method: 'POST' }),

  rejectLeave: (leaveId) =>
    fetchJSON(`/leaves/${leaveId}/reject`, { method: 'POST' }),

  // Payroll
  getSalaries: () => fetchJSON('/payroll/salaries'),

  generateSalary: (employeeId, netSalary, date) =>
    fetchJSON('/payroll/generate', {
      method: 'POST',
      body: JSON.stringify({ employee_id: employeeId, net_salary: netSalary, date }),
    }),

  // Recruitment
  getJobs: () => fetchJSON('/jobs'),

  createJob: (data) =>
    fetchJSON('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCandidates: () => fetchJSON('/candidates'),

  updateCandidateStatus: (candidateId, status) =>
    fetchJSON(`/candidates/${candidateId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  // Assets
  getAssets: () => fetchJSON('/assets'),

  createAsset: (data) =>
    fetchJSON('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
