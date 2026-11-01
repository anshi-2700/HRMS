import React from 'react';
import {
  Building2,
  Shield,
  Briefcase,
  User,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  LogIn,
  Laptop,
  CheckCircle2,
  CalendarCheck2
} from 'lucide-react';
import { DashboardStats, JobPosting } from '../../types';

interface GuestDashboardProps {
  stats: DashboardStats | null;
  jobs: JobPosting[];
  onOpenLogin: () => void;
  onQuickLogin: (role: 'admin' | 'manager' | 'employee') => Promise<void>;
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({
  stats,
  jobs,
  onOpenLogin,
  onQuickLogin,
}) => {
  const companyHolidays = [
    { name: 'Diwali (Deepavali)', date: '12 Nov 2026', type: 'Gazetted Festive Holiday' },
    { name: 'Guru Nanak Jayanti', date: '27 Nov 2026', type: 'National Public Holiday' },
    { name: 'New Year Day', date: '01 Jan 2027', type: 'Corporate Holiday' },
    { name: 'Republic Day', date: '26 Jan 2027', type: 'National Holiday' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Hero Welcome Gateway */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>WorkNest &bull; Enterprise Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Workforce, Biometric Attendance &amp; Payroll Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Welcome to the WorkNest HRMS platform. Please select your role below for instant demo persona access, or sign in with your corporate credentials to unlock your dedicated role workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Corporate Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Role Gateway Matrix */}
      <div>
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Your Role Workspace (1-Click Instant Demo Authentication)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-normal">
            Each role unlocks a tailored dashboard, customized permissions &amp; localized workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Admin Role Card */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Executive Level
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Aarav Sharma &bull; HR Admin
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                Full executive command: organization headcount, CTC disbursement, statutory PF/PT compliance, candidate ATS pipeline, and multi-tier leave authorization.
              </p>
            </div>

            <div className="pt-5 border-t border-slate-100 mt-5">
              <button
                onClick={() => onQuickLogin('admin')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Launch Admin Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Manager Role Card */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Department Lead
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Priya Iyer &bull; Engineering Manager
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                Engineering team console: shift attendance tracking, team roster supervision, one-click leave approvals, and engineering candidate pipeline screening.
              </p>
            </div>

            <div className="pt-5 border-t border-slate-100 mt-5">
              <button
                onClick={() => onQuickLogin('manager')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Launch Manager Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Employee Role Card */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                <User size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Self-Service Staff
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Vikram Malhotra &bull; Senior Engineer
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                Individual portal: IST time-clock punch in/out, statutory leave quotas (Casual, Privilege, Sick), monthly salary slip review, and allocated company hardware.
              </p>
            </div>

            <div className="pt-5 border-t border-slate-100 mt-5">
              <button
                onClick={() => onQuickLogin('employee')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Launch Employee Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Public Job Requisitions & Holiday Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Openings */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Open Positions</h3>
              <p className="text-xs text-slate-500">Explore career opportunities across our Indian tech centers</p>
            </div>
            <button
              onClick={onOpenLogin}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>Employee Internal Job Board</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {jobs.slice(0, 4).map((j) => (
              <div key={j.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-blue-700">{j.department}</span>
                    <span className="text-slate-500 font-semibold">{j.salary_range || 'Competitive CTC'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{j.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <MapPin size={11} className="text-slate-400" />
                    <span>{j.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indian Festive Calendar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Indian Gazetted Holidays</h3>
                <p className="text-xs text-slate-500">2026 Statutory Calendar</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Official Rota
              </span>
            </div>

            <div className="space-y-2.5">
              {companyHolidays.map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{h.name}</span>
                    <span className="text-[10px] text-slate-500">{h.type}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700">{h.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 mt-4 text-[11px] text-slate-500">
            WorkNest &bull; Bengaluru HQ
          </div>
        </div>
      </div>
    </div>
  );
};
