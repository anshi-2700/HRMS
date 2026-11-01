import React, { useState } from 'react';
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
  ReceiptIndianRupee,
  Clock,
  CheckCircle2,
  CalendarDays,
  FileText,
  Lock,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { JobPosting } from '../types';

interface HomePageProps {
  jobs: JobPosting[];
  onOpenLogin: () => void;
  onQuickLogin: (role: 'admin' | 'manager' | 'employee') => Promise<void>;
}

export const HomePage: React.FC<HomePageProps> = ({
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/20">
            W
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">WorkNest</span>
            <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase mt-0.5">Enterprise HRMS</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#solutions" className="hover:text-blue-600 transition-colors">Role Solutions</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Platform Features</a>
          <a href="#careers" className="hover:text-blue-600 transition-colors">Open Roles</a>
          <a href="#locations" className="hover:text-blue-600 transition-colors">Indian Centers</a>
          <a href="#holidays" className="hover:text-blue-600 transition-colors">Holiday Rota</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuickLogin('admin')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
          >
            <span>1-Click Admin Demo</span>
          </button>
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all hover:-translate-y-0.5"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6">
          <Building2 size={14} className="text-blue-600" />
          <span>WorkNest Technologies India &bull; Enterprise Workforce OS</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          The Human Capital, Attendance &amp; Payroll Platform for Indian Enterprises
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
          Engineered for fast-growing Indian organizations. Unified personnel directories, biometric IST shift tracking, statutory leave governance (CL, PL, SL), compliant Indian CTC payroll with EPF, PT &amp; TDS, and modern ATS candidate screening.
        </p>

        {/* Hero CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#solutions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all hover:-translate-y-0.5"
          >
            <span>Launch Live Role Demo</span>
            <ArrowRight size={16} />
          </a>
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            <Lock size={15} className="text-slate-500" />
            <span>Corporate Account Login</span>
          </button>
        </div>

        {/* Trust & Architecture Tag */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-blue-600" />
            FastAPI High-Performance Engine
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-blue-600" />
            PostgreSQL Relational Persistence
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-blue-600" />
            Strict Role-Based Access Control (RBAC)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-blue-600" />
            Indian Statutory Compliance (EPF, PT, TDS)
          </span>
        </div>
      </section>

      {/* Role-Based Solutions Interactive Showcase */}
      <section id="solutions" className="py-16 px-6 lg:px-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
              Role-Based Access Control (RBAC)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Every Persona Gets Their Own Dedicated Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Experience the customized interface, permissions, and tools designed specifically for each role. Click any card below for instant 1-click access.
            </p>
          </div>

          {/* Role Cards Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Super Admin */}
            <div className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Shield size={24} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
                    Executive Super Admin
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Full Platform
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Aarav Sharma &bull; Chief People Officer
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Total organization headcount (10), live monthly net remuneration ledger (₹8,99,800), multi-tier leave authorizations, and talent acquisition ATS pipeline.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>Executive Headcount &amp; Department KPIs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>Company-wide Salary Ledger (INR ₹)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>Employee Onboarding &amp; PAN/UAN Register</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onQuickLogin('admin')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                >
                  <span>Launch Admin Workspace</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Department Manager */}
            <div className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Users size={24} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
                    Department Manager
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Engineering Team
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Priya Iyer &bull; Engineering Manager
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Engineering &amp; Technology team operations, shift presence rates, 1-click technical leave approvals/rejections, and candidate pipeline screening.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>Team Shift &amp; Presence Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>Direct Team Leave Approvals &amp; Rejections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>ATS Candidate Resume Reviews</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onQuickLogin('manager')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                >
                  <span>Launch Manager Workspace</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Staff Employee */}
            <div className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <User size={24} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
                    Staff Member
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Self-Service
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Vikram Malhotra &bull; Senior Engineer
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Personal self-service workspace: Live IST biometric punch clock, statutory leave balance counters (CL, PL, SL), printable monthly payslip, and hardware assets.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>IST Biometric Time Punch In / Out</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>Statutory Leave Quotas (12 CL, 18 PL, 12 SL)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>October 2026 Salary Slip &amp; Tax Deductions</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onQuickLogin('employee')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                >
                  <span>Launch Employee Workspace</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Integrated Workforce Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Everything an Indian enterprise needs to manage talent, compliance, and compensation from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Personnel Roster &amp; Profiles</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Complete employee records with Indian statutory fields including PAN Card, UAN, CTC breakdown, department affiliations, and role privileges.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Biometric Attendance &amp; Shifts</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Real-time IST biometric punch logging with automated work-hour calculations, presence flags (Present, Half-day, WFH, Absent), and shift tracking.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <CalendarDays size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Statutory Leave Governance</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Enforces statutory Indian leave balances: Casual Leave (12), Privilege Leave (18), and Sick Leave (12) with instant manager approval workflows.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ReceiptIndianRupee size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Compliant Indian Payroll (₹)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Precision salary computations: Basic Salary (50%), HRA (25%), Special Allowance (25%), Employee Provident Fund (EPF), Professional Tax (₹200), and TDS.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Briefcase size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">ATS Recruitment Pipeline</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Post technical requisitions across Indian tech hubs, screen applicant resumes, evaluate candidate experience, and manage interview pipelines.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Laptop size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">IT Hardware Asset Registry</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Track high-value development workstations, MacBook Pros, monitors, and secure serial allocations with real-time assignment accountability.
            </p>
          </div>
        </div>
      </section>

      {/* Careers & Locations Section */}
      <section id="careers" className="py-20 px-6 lg:px-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
                Join WorkNest Technologies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Active Career Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Explore engineering and product leadership positions across our Indian technology centers.
              </p>
            </div>
            <button
              onClick={() => onQuickLogin('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-blue-700 text-xs font-semibold self-start md:self-auto shadow-sm"
            >
              <span>Manage Requisitions (Admin)</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Job listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {jobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {job.department}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {job.salary_range || 'Competitive CTC'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {job.location}
                    </span>
                    <span>&bull;</span>
                    <span className="capitalize">{job.job_type.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {job.vacancies} open position{job.vacancies > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={onOpenLogin}
                    className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 text-xs"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Indian Offices Grid */}
          <div id="locations" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Indian Technology Centers</h3>
                  <p className="text-xs text-slate-500">Corporate headquarters &amp; engineering hubs</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  4 Active Centers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={15} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Bengaluru (Global HQ)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Outer Ring Road, Bellandur, Bengaluru 560103</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-blue-700">Engineering &amp; Executive Leadership</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={15} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Pune Technology Center</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Hinjawadi Phase 1, Rajiv Gandhi Infotech Park 411057</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-blue-700">Cloud &amp; Distributed Systems</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={15} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Hyderabad Hub</span>
                  </div>
                  <p className="text-[11px] text-slate-600">HITEC City, Madhapur, Hyderabad 500081</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-blue-700">Client Operations &amp; DevOps</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={15} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Mumbai Corporate Office</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Bandra Kurla Complex (BKC), Mumbai 400051</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-blue-700">Finance, Legal &amp; Compliance</span>
                </div>
              </div>
            </div>

            {/* Holiday Calendar */}
            <div id="holidays" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">Indian Gazetted Holidays</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    2026 Rota
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Statutory company holidays across India</p>

                <div className="space-y-3">
                  {companyHolidays.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{h.name}</span>
                        <span className="text-[11px] text-slate-500">{h.type}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                        {h.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Standard Hours: 9:00 AM &ndash; 6:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-slate-200 bg-slate-50 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              W
            </div>
            <div>
              <span className="font-bold text-slate-900 block">WorkNest</span>
              <span className="text-[11px] text-slate-500">Enterprise Workforce, Biometric &amp; Payroll OS</span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-slate-600 font-medium">&copy; 2026 WorkNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
