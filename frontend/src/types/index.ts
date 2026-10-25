export type Role = 'admin' | 'client' | 'employee';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: Role;
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
  salary: number;
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
  status: 'present' | 'half_day' | 'absent';
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
}

export interface PayrollSlip {
  id: number;
  employee_id: number;
  employee_name: string;
  month: string;
  year: number;
  basic_salary: number;
  allowances: number;
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

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  on_leave_today: number;
  active_jobs: number;
  pending_leaves: number;
  total_assets: number;
  monthly_payroll: number;
  departments_count: number;
}

export type TabType = 
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'payroll'
  | 'recruitment'
  | 'assets';
