import React from 'react';
import { DashboardStats, TabType, User, LeaveRequest, Employee, Candidate, JobPosting } from '../types';
import { GuestDashboard } from './dashboards/GuestDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { EmployeeDashboard } from './dashboards/EmployeeDashboard';

interface DashboardViewProps {
  stats: DashboardStats | null;
  currentUser: User | null;
  employees: Employee[];
  pendingLeaves: LeaveRequest[];
  candidates: Candidate[];
  jobs: JobPosting[];
  onNavigate: (tab: TabType) => void;
  onQuickPunch: () => void;
  onOpenApplyLeave: () => void;
  onOpenAddEmployee: () => void;
  onOpenLogin: () => void;
  onQuickLogin: (role: 'admin' | 'manager' | 'employee') => Promise<void>;
  onApproveLeave: (id: number) => Promise<void>;
  onRejectLeave: (id: number) => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  stats, 
  currentUser,
  employees,
  pendingLeaves,
  candidates,
  jobs,
  onNavigate,
  onQuickPunch,
  onOpenApplyLeave,
  onOpenAddEmployee,
  onOpenLogin,
  onQuickLogin,
  onApproveLeave,
  onRejectLeave,
}) => {
  // 1. Unauthenticated / Signed-Out Public Gateway Dashboard
  if (!currentUser) {
    return (
      <GuestDashboard
        stats={stats}
        jobs={jobs}
        onOpenLogin={onOpenLogin}
        onQuickLogin={onQuickLogin}
      />
    );
  }

  // 2. Super Admin Executive Command Dashboard (Aarav Sharma)
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        stats={stats}
        currentUser={currentUser}
        pendingLeaves={pendingLeaves}
        onNavigate={onNavigate}
        onOpenAddEmployee={onOpenAddEmployee}
        onApproveLeave={onApproveLeave}
        onRejectLeave={onRejectLeave}
      />
    );
  }

  // 3. Department Lead / Manager Dashboard (Priya Iyer)
  if (currentUser.role === 'manager' || currentUser.role === 'client') {
    return (
      <ManagerDashboard
        stats={stats}
        currentUser={currentUser}
        employees={employees}
        pendingLeaves={pendingLeaves}
        candidates={candidates}
        jobs={jobs}
        onNavigate={onNavigate}
        onApproveLeave={onApproveLeave}
        onRejectLeave={onRejectLeave}
      />
    );
  }

  // 4. Employee Personal Self-Service Workspace (Vikram Malhotra)
  const linkedEmployee = employees.find(e => e.id === currentUser.employee_id) || null;
  return (
    <EmployeeDashboard
      stats={stats}
      currentUser={currentUser}
      linkedEmployee={linkedEmployee}
      onNavigate={onNavigate}
      onQuickPunch={onQuickPunch}
      onOpenApplyLeave={onOpenApplyLeave}
    />
  );
};
