export type Role = 'admin' | 'manager' | 'client' | 'employee';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: Role;
  employee_id?: number | null;
  is_active?: boolean;
}

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  location?: string;
  salary: number;
  pan_number?: string;
  uan_number?: string;
  date_of_joining: string;
  status: 'active' | 'on_leave' | 'inactive';
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  punch_in?: string;
  punch_out?: string;
  work_hours: number;
  status: 'present' | 'half_day' | 'absent' | 'wfh';
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_on: string;
  reviewed_by?: string;
}

export interface PayrollSlip {
  id: number;
  employee_id: number;
  employee_name: string;
  month: string;
  year: number;
  basic_salary: number;
  hra?: number;
  special_allowance?: number;
  allowances: number;
  pf_deduction?: number;
  pt_deduction?: number;
  tds_deduction?: number;
  deductions: number;
  net_salary: number;
  status: 'paid' | 'pending';
  payment_date: string;
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  job_type: string;
  salary_range?: string;
  experience_level?: string;
  description?: string;
  vacancies: number;
  status: 'active' | 'closed';
  posted_date: string;
  candidates_count: number;
}

export interface Candidate {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone?: string;
  current_company?: string;
  experience_years?: number;
  stage: 'applied' | 'screened' | 'interview' | 'offered' | 'hired' | 'rejected';
  rating: number;
  applied_date: string;
}

export interface AssetItem {
  id: number;
  asset_tag: string;
  name: string;
  category: string;
  serial_number?: string;
  assigned_to?: string;
  purchase_date: string;
  value: number;
  status: 'in_use' | 'available' | 'maintenance';
}

export interface LeaveBalance {
  casual_leave: number;
  casual_total: number;
  privilege_leave: number;
  privilege_total: number;
  sick_leave: number;
  sick_total: number;
}

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  on_leave_today: number;
  active_jobs: number;
  pending_leaves: number;
  total_assets: number;
  monthly_payroll: number;
  departments_count: number;
  my_leave_balance?: LeaveBalance | null;
  my_assigned_assets?: number;
  dept_team_count?: number | null;
  dept_present_today?: number | null;
  dept_name?: string | null;
  view_role?: string;
}

export type TabType = 
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'payroll'
  | 'recruitment'
  | 'assets';
