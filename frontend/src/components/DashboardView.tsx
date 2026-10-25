import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  CalendarClock, 
  Briefcase, 
  Laptop, 
  DollarSign, 
  ArrowUpRight,
  Clock,
  Sparkles,
  TrendingUp,
  Building2
} from 'lucide-react';
import { DashboardStats, TabType } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  onNavigate: (tab: TabType) => void;
  onQuickPunch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  stats, 
  onNavigate,
  onQuickPunch 
}) => {
  const presenceRatio = stats && stats.total_employees > 0 
    ? Math.round((stats.present_today / stats.total_employees) * 100) 
    : 88;

  const kpis = [
    {
      title: 'Total Workforce',
      value: stats?.total_employees ?? 8,
      subtext: `${stats?.departments_count ?? 5} active departments`,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      tab: 'employees' as TabType,
    },
    {
      title: 'Present Today',
      value: stats?.present_today ?? 7,
      subtext: `${presenceRatio}% workforce attendance`,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      tab: 'attendance' as TabType,
    },
    {
      title: 'Pending Leaves',
      value: stats?.pending_leaves ?? 2,
      subtext: `${stats?.on_leave_today ?? 1} currently on leave`,
      icon: CalendarClock,
      color: 'from-amber-600 to-orange-600',
      tab: 'leaves' as TabType,
    },
    {
      title: 'Active Job Requisitions',
      value: stats?.active_jobs ?? 3,
      subtext: 'ATS talent pipeline active',
      icon: Briefcase,
      color: 'from-purple-600 to-pink-600',
      tab: 'recruitment' as TabType,
    },
    {
      title: 'Enterprise IT Assets',
      value: stats?.total_assets ?? 6,
      subtext: 'Hardware inventory register',
      icon: Laptop,
      color: 'from-cyan-600 to-blue-600',
      tab: 'assets' as TabType,
    },
    {
      title: 'Monthly Compensation',
      value: `$${(stats?.monthly_payroll ?? 42462.5).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      subtext: 'Disbursed payroll ledger',
      icon: DollarSign,
      color: 'from-emerald-600 to-green-600',
      tab: 'payroll' as TabType,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexus Workforce OS &bull; FastAPI + React 19 Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Executive Workforce Operations
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Real-time enterprise telemetry covering personnel directories, automated payroll processing, 
              biometric attendance tracking, and ATS candidate screening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onQuickPunch}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <Clock className="w-4 h-4" />
              <span>Record Punch In/Out</span>
            </button>
            <button
              onClick={() => onNavigate('employees')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              <span>Workforce Directory</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(kpi.tab)}
              className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-indigo-500 transition-colors flex items-center gap-0.5">
                  View <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {kpi.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Department Breakdown & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Ratio Bar */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Presence &amp; Shift Compliance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time attendance ratio across all operational units</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              {presenceRatio}% Present
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden flex mb-6">
            <div 
              style={{ width: `${presenceRatio}%` }} 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
            />
            <div 
              style={{ width: `${100 - presenceRatio}%` }} 
              className="bg-amber-400 h-full rounded-r-full transition-all duration-500" 
            />
          </div>

          {/* Department tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400">Engineering</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">3 Members &bull; 100%</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400">Product Design</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">2 Members &bull; 50%</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400">People Ops</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">1 Member &bull; 100%</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400">Finance &amp; Sales</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">2 Members &bull; 100%</p>
            </div>
          </div>
        </div>

        {/* System Architecture Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Nexus Architecture</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Fully decoupled REST microservices built with Python 3.11, FastAPI, SQLAlchemy ORM, and high-speed React 19 SPA with Tailwind CSS v4.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Backend API</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">FastAPI 0.110</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Frontend Engine</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">React 19 + TypeScript</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400">CSS Framework</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">Tailwind CSS v4</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href="http://localhost:8000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
            >
              <span>Open OpenAPI / Swagger Docs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
