import React from 'react';
import { 
  Clock, 
  ReceiptIndianRupee, 
  Laptop, 
  CalendarDays, 
  Building2, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText,
  Calendar
} from 'lucide-react';
import { DashboardStats, TabType, User, Employee } from '../../types';

interface EmployeeDashboardProps {
  stats: DashboardStats | null;
  currentUser: User;
  linkedEmployee?: Employee | null;
  onNavigate: (tab: TabType) => void;
  onQuickPunch: () => void;
  onOpenApplyLeave: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  stats,
  currentUser,
  linkedEmployee,
  onNavigate,
  onQuickPunch,
  onOpenApplyLeave,
}) => {
  const firstName = currentUser.full_name.split(' ')[0];

  const companyHolidays = [
    { name: 'Diwali (Deepavali)', date: '12 Nov 2026', type: 'Gazetted Festive Holiday' },
    { name: 'Guru Nanak Jayanti', date: '27 Nov 2026', type: 'National Public Holiday' },
    { name: 'New Year Day', date: '01 Jan 2027', type: 'Corporate Holiday' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Employee Greeting & Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Building2 className="w-3.5 h-3.5" />
              <span>WorkNest Technologies &bull; Pune Technology Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome back, {firstName} &bull; Senior Full-Stack Engineer
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl font-normal">
              Your self-service personnel portal for biometric attendance logging, statutory leave quota management, and monthly CTC payslip review.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={onQuickPunch}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Punch IST Attendance</span>
            </button>
            <button
              onClick={onOpenApplyLeave}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Leave Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Casual Leave */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Casual Leave (CL)</span>
            <span className="text-blue-600">Monthly Rota</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {stats?.my_leave_balance?.casual_leave ?? 10}
              <span className="text-xs text-slate-500 font-normal ml-1">/ 12 days left</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              Available
            </span>
          </div>
        </div>

        {/* Privilege / Earned Leave */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Privilege Leave (PL)</span>
            <span className="text-blue-600">Annual Quota</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {stats?.my_leave_balance?.privilege_leave ?? 14}
              <span className="text-xs text-slate-500 font-normal ml-1">/ 18 days left</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              Encashable
            </span>
          </div>
        </div>

        {/* Sick / Medical Leave */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Sick / Medical (SL)</span>
            <span className="text-amber-700">Statutory</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {stats?.my_leave_balance?.sick_leave ?? 12}
              <span className="text-xs text-slate-500 font-normal ml-1">/ 12 days left</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              Full Balance
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column: Latest Payslip & Assigned Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Payslip Snapshot Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ReceiptIndianRupee className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">My October 2026 Salary Slip</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Credited &bull; 25 Oct 2026
              </span>
            </div>

            <div className="my-5">
              <span className="text-xs text-slate-500 font-medium">Net Take-Home Disbursed</span>
              <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">
                ₹1,57,734
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Basic Salary</span>
                  <span className="font-bold text-slate-900">₹91,667</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">HRA Allowance</span>
                  <span className="font-bold text-slate-900">₹36,667</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Special Allowance</span>
                  <span className="font-bold text-slate-900">₹55,000</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">EPF &amp; Tax Deductions</span>
                  <span className="font-bold text-rose-600">-₹25,600</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">HDFC Bank Direct Deposit</span>
            <button
              onClick={() => onNavigate('payroll')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Detailed Payslip</span>
            </button>
          </div>
        </div>

        {/* IT Equipment & Workstation Hardware */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">My Company Hardware</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                2 Active Devices
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">Apple MacBook Pro 16&quot; M3 Max</p>
                  <p className="text-[11px] text-slate-500 font-mono">Tag: WN-AST-0101 &bull; 36GB RAM / 1TB SSD</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Assigned</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">Dell UltraSharp 32&quot; 4K USB-C Hub (U3223QE)</p>
                  <p className="text-[11px] text-slate-500 font-mono">Tag: WN-AST-0102 &bull; External Display</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Assigned</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">IT Helpdesk: it-ops@worknest.in</span>
            <button
              onClick={() => onNavigate('assets')}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>Asset Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Indian Holidays Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Upcoming Indian Festive &amp; National Holidays
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Pune Tech Center Calendar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {companyHolidays.map((h, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 block">{h.name}</span>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>{h.type}</span>
                <span className="text-blue-700 font-mono font-bold">{h.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
