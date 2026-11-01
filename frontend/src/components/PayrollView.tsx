import React, { useState } from 'react';
import {
  ReceiptIndianRupee,
  FileText,
  CheckCircle2,
  Download,
  TrendingUp,
  Building2,
  X,
  Printer
} from 'lucide-react';
import { PayrollSlip, Employee, User } from '../types';

interface PayrollViewProps {
  salaries: PayrollSlip[];
  employees: Employee[];
  currentUser: User | null;
  onRefresh?: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  salaries,
  employees,
  currentUser
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSlip, setActiveSlip] = useState<PayrollSlip | null>(null);

  const months = ['All', 'October', 'September', 'August', 'July', 'June', 'May', 'April'];

  const filteredSalaries = salaries.filter((s) => {
    const matchesMonth = selectedMonth === 'All' || s.month.toLowerCase() === selectedMonth.toLowerCase();
    const matchesSearch = s.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const totalDisbursed = filteredSalaries.reduce((sum, s) => sum + s.net_salary, 0);
  const totalAllowances = filteredSalaries.reduce((sum, s) => sum + s.allowances, 0);
  const totalDeductions = filteredSalaries.reduce((sum, s) => sum + s.deductions, 0);

  const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  const linkedEmp = activeSlip ? employees.find(e => e.id === activeSlip.employee_id) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Payroll &amp; Remuneration Register
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Indian statutory payroll ledger, CTC breakdown (Basic, HRA, Special Allowance), EPF, Professional Tax (PT) &amp; TDS
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Net Disbursed</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {formatINR(totalDisbursed)}
          </div>
          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} /> Live disbursement ledger
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allowances (HRA &amp; Flexi)</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {formatINR(totalAllowances)}
          </div>
          <p className="text-xs text-blue-600 mt-1 font-semibold">HRA, Special &amp; Medical</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statutory Deductions</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {formatINR(totalDeductions)}
          </div>
          <p className="text-xs text-rose-600 mt-1 font-semibold">EPF, PT (₹200) &amp; TDS</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disbursed Slips</span>
          <div className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            {filteredSalaries.length} Slips
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Direct bank credit</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Monthly Salary Ledger
            </h2>
            <div className="flex items-center gap-1 overflow-x-auto ml-2">
              {months.slice(0, 4).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${selectedMonth === m
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-700'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employee name..."
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-full sm:w-60"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Basic Pay</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Deductions (EPF/PT/TDS)</th>
                <th className="py-3 px-4 font-bold text-slate-800">Net Take-Home</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSalaries.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {s.employee_name}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {s.month} {s.year}
                  </td>
                  <td className="py-3 px-4 text-slate-700 tabular-nums font-semibold">
                    {formatINR(s.basic_salary)}
                  </td>
                  <td className="py-3 px-4 text-blue-700 tabular-nums font-semibold">
                    {formatINR(s.allowances)}
                  </td>
                  <td className="py-3 px-4 text-rose-600 tabular-nums font-semibold">
                    -{formatINR(s.deductions)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 tabular-nums text-sm">
                    {formatINR(s.net_salary)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveSlip(s)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View Detailed Payslip"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Indian Salary Slip Modal */}
      {activeSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Payslip Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                  W
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">WorkNest</h3>
                  <p className="text-[11px] text-slate-500">
                    Outer Ring Road, Bellandur, Bengaluru, Karnataka &bull; CIN: U72200KA2022PTC158912
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSlip(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Payslip Title */}
            <div className="py-3 text-center border-b border-slate-100 bg-slate-50 rounded-lg my-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
                Payslip for the Month of {activeSlip.month} {activeSlip.year}
              </span>
            </div>

            {/* Employee Meta Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Employee Name</span>
                <span className="font-bold text-slate-900">{activeSlip.employee_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Employee ID</span>
                <span className="font-bold text-slate-900 font-mono">{linkedEmp?.employee_id || 'WN-IND-1003'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Department &amp; Title</span>
                <span className="font-bold text-slate-900">{linkedEmp?.department || 'Engineering'} &bull; {linkedEmp?.designation || 'Engineer'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Work Location</span>
                <span className="font-bold text-slate-900">{linkedEmp?.location || 'Bengaluru (HQ)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">PAN / Tax Number</span>
                <span className="font-bold text-slate-900 font-mono">{linkedEmp?.pan_number || 'CLKVM9012M'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">PF UAN Identifier</span>
                <span className="font-bold text-slate-900 font-mono">{linkedEmp?.uan_number || '100982341003'}</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              {/* Earnings */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block pb-1 border-b border-slate-200">
                  Earnings (INR)
                </span>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Basic Salary</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatINR(activeSlip.basic_salary)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatINR(activeSlip.hra || activeSlip.basic_salary * 0.4)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Special Allowance</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatINR(activeSlip.special_allowance || activeSlip.allowances - (activeSlip.hra || activeSlip.basic_salary * 0.4))}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Gross Earnings</span>
                  <span className="tabular-nums">{formatINR(activeSlip.basic_salary + activeSlip.allowances)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block pb-1 border-b border-slate-200">
                  Deductions (INR)
                </span>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Employee Provident Fund (EPF)</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatINR(activeSlip.pf_deduction || 3600)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Professional Tax (PT)</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatINR(activeSlip.pt_deduction || 200)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>TDS (Income Tax)</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatINR(activeSlip.tds_deduction || (activeSlip.deductions - 3800))}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-rose-600">
                  <span>Total Deductions</span>
                  <span className="tabular-nums">-{formatINR(activeSlip.deductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Take-Home Highlight */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 my-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-700 block font-bold">Net Salary Credited to Bank Account</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">{formatINR(activeSlip.net_salary)}</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Payment Status: Paid
              </span>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">This is a computer-generated salary slip.</span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Salary Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
