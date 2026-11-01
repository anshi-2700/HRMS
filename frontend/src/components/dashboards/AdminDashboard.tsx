import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  CalendarClock, 
  Briefcase, 
  Laptop, 
  ReceiptIndianRupee, 
  Check, 
  X, 
  Building2, 
  Plus, 
  UserPlus, 
  FileText,
  CalendarCheck2
} from 'lucide-react';
import { DashboardStats, TabType, User, LeaveRequest } from '../../types';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  currentUser: User;
  pendingLeaves: LeaveRequest[];
  onNavigate: (tab: TabType) => void;
  onOpenAddEmployee: () => void;
  onApproveLeave: (id: number) => Promise<void>;
  onRejectLeave: (id: number) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  currentUser,
  pendingLeaves,
  onNavigate,
  onOpenAddEmployee,
  onApproveLeave,
  onRejectLeave,
}) => {
  const presenceRatio = stats && stats.total_employees > 0 
    ? Math.round((stats.present_today / stats.total_employees) * 100) 
    : 90;

  const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  const departments = [
    { name: 'Engineering & Technology', count: 4, pct: 40 },
    { name: 'Product Design & UI/UX', count: 2, pct: 20 },
    { name: 'People Operations (HR)', count: 2, pct: 20 },
    { name: 'Finance & Accounts', count: 1, pct: 10 },
    { name: 'Enterprise Client Partnerships', count: 1, pct: 10 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Executive Command Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Building2 className="w-3.5 h-3.5" />
              <span>WorkNest Technologies India &bull; Executive Command</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Good day, {currentUser.full_name} &bull; Chief People Officer
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl font-normal">
              Centralized administration across 10 active personnel, statutory PF &amp; tax compliance, time-off authorizations, and technical recruitment pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={onOpenAddEmployee}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Personnel</span>
            </button>
            <button
              onClick={() => onNavigate('payroll')}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <ReceiptIndianRupee className="w-3.5 h-3.5 text-blue-600" />
              <span>Payroll Cycle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Executive KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Headcount */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Headcount</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{stats?.total_employees ?? 10}</div>
            <p className="text-xs text-slate-500 mt-0.5">{stats?.departments_count ?? 5} active departments across India</p>
          </div>
        </div>

        {/* Presence */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Present Today</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {stats?.present_today ?? 8} <span className="text-sm font-semibold text-slate-500">({presenceRatio}%)</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{stats?.on_leave_today ?? 1} currently on sanctioned leave</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div 
          onClick={() => onNavigate('leaves')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Leave Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{stats?.pending_leaves ?? 2}</div>
            <p className="text-xs text-slate-500 mt-0.5">Awaiting supervisor sign-off</p>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div 
          onClick={() => onNavigate('payroll')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Net CTC Disbursed</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <ReceiptIndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {formatINR(stats?.monthly_payroll ?? 899800)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Direct bank credit for October 2026</p>
          </div>
        </div>

        {/* ATS Pipeline */}
        <div 
          onClick={() => onNavigate('recruitment')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Talent Requisitions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{stats?.active_jobs ?? 3} Active Roles</div>
            <p className="text-xs text-slate-500 mt-0.5">Bengaluru &bull; Pune &bull; Hyderabad</p>
          </div>
        </div>

        {/* IT Assets */}
        <div 
          onClick={() => onNavigate('assets')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">IT Capital Assets</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{stats?.total_assets ?? 6} Hardware Units</div>
            <p className="text-xs text-slate-500 mt-0.5">Book valuation ~ ₹9.33 Lakhs</p>
          </div>
        </div>
      </div>

      {/* Two-Column: Pending Approvals & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast-Track Approvals Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Pending Leave Authorizations</h2>
                <p className="text-xs text-slate-500 mt-0.5">Authorize team members' statutory time-off</p>
              </div>
              <button
                onClick={() => onNavigate('leaves')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View Ledger &rarr;
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CalendarCheck2 className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                All time-off applications have been reviewed.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{leave.employee_name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                          {leave.leave_type}
                        </span>
                        <span className="text-xs text-slate-500">&bull; {leave.days} day(s)</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {leave.start_date} to {leave.end_date} &bull; <span className="text-slate-800 italic font-medium">&ldquo;{leave.reason}&rdquo;</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onApproveLeave(leave.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onRejectLeave(leave.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Department Headcount Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-sm font-bold text-slate-900">Department Headcount Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Workforce allocation across functional units</p>
            </div>

            <div className="space-y-4">
              {departments.map((dept, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept.name}</span>
                    <span className="font-bold text-slate-900">{dept.count} members</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-600" 
                      style={{ width: `${dept.pct * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Technology Stack: Python FastAPI &bull; React 19 &bull; PostgreSQL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
