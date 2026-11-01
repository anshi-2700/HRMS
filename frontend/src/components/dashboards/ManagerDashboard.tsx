import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  CalendarClock, 
  Briefcase, 
  Laptop, 
  Check, 
  X, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CalendarCheck2
} from 'lucide-react';
import { DashboardStats, TabType, User, LeaveRequest, Employee, Candidate, JobPosting } from '../../types';

interface ManagerDashboardProps {
  stats: DashboardStats | null;
  currentUser: User;
  employees: Employee[];
  pendingLeaves: LeaveRequest[];
  candidates: Candidate[];
  jobs: JobPosting[];
  onNavigate: (tab: TabType) => void;
  onApproveLeave: (id: number) => Promise<void>;
  onRejectLeave: (id: number) => Promise<void>;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  stats,
  currentUser,
  employees,
  pendingLeaves,
  candidates,
  jobs,
  onNavigate,
  onApproveLeave,
  onRejectLeave,
}) => {
  const deptName = stats?.dept_name || 'Engineering & Technology';
  const teamMembers = employees.filter(e => e.department.toLowerCase().includes('engineering'));
  const deptJobs = jobs.filter(j => j.department.toLowerCase().includes('engineering'));
  const techCandidates = candidates.filter(c => {
    const job = jobs.find(j => j.id === c.job_id);
    return job?.department.toLowerCase().includes('engineering');
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Department Command Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Building2 className="w-3.5 h-3.5" />
              <span>{deptName} &bull; Department Lead Operations</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Good day, {currentUser.full_name} &bull; Engineering Manager
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl font-normal">
              Team operational console for shift attendance monitoring, technical time-off authorizations, and engineering candidate screening.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Team Shift Register</span>
            </button>
            <button
              onClick={() => onNavigate('recruitment')}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Review Candidates</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Department Team KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Team Size */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department Roster</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{teamMembers.length} Engineers</div>
            <p className="text-xs text-slate-500 mt-0.5">Bengaluru &amp; Pune Centers</p>
          </div>
        </div>

        {/* Team Presence Today */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team On-Duty</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {stats?.dept_present_today ?? 3} Active
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Standard 8.5 hr shifts logged</p>
          </div>
        </div>

        {/* Team Leave Requests */}
        <div 
          onClick={() => onNavigate('leaves')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Leaves</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{pendingLeaves.length} Requests</div>
            <p className="text-xs text-slate-500 mt-0.5">Awaiting team lead approval</p>
          </div>
        </div>

        {/* Open Tech Requisitions */}
        <div 
          onClick={() => onNavigate('recruitment')}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-sm cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Tech Roles</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">{deptJobs.length} Roles Open</div>
            <p className="text-xs text-slate-500 mt-0.5">FastAPI &amp; React Architect</p>
          </div>
        </div>
      </div>

      {/* Team Roster & Team Leave Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members Roster */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Engineering Personnel Roster</h2>
                <p className="text-xs text-slate-500">Direct reports &amp; technical team members</p>
              </div>
              <button
                onClick={() => onNavigate('employees')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Directory &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {teamMembers.map((emp) => (
                <div key={emp.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {emp.first_name} {emp.last_name}
                      </span>
                      <span className="text-[11px] text-slate-500">{emp.designation}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-700 block font-medium">{emp.location}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 mt-3 text-xs text-slate-500">
            Sprint cycle: Bi-weekly &bull; Daily standup: 10:00 AM IST
          </div>
        </div>

        {/* Team Leave Approvals Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Team Leave Approvals</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review engineering team time-off requests</p>
              </div>
              <button
                onClick={() => onNavigate('leaves')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Full Ledger &rarr;
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CalendarCheck2 className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                No pending team leave requests at this time.
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

          <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Manager approvals automatically notify People Operations.
          </div>
        </div>
      </div>
    </div>
  );
};
