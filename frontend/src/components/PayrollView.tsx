import React, { useState } from 'react';
import { CreditCard, DollarSign, Plus, FileText, CheckCircle2, Clock, Download, TrendingUp } from 'lucide-react';
import { PayrollSlip, Employee } from '../types';

interface PayrollViewProps {
  salaries: PayrollSlip[];
  employees: Employee[];
  onRefresh?: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ salaries, employees, onRefresh }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredSalaries = salaries.filter((s) => {
    const matchesMonth = selectedMonth === 'All' || s.month.toLowerCase() === selectedMonth.toLowerCase();
    const matchesSearch = s.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const totalDisbursed = filteredSalaries.reduce((sum, s) => sum + s.net_salary, 0);
  const totalAllowances = filteredSalaries.reduce((sum, s) => sum + s.allowances, 0);
  const totalDeductions = filteredSalaries.reduce((sum, s) => sum + s.deductions, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net Disbursed</p>
              <h3 className="text-2xl font-bold text-white mt-1">₹{totalDisbursed.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> Live disbursement ledger
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard size={22} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Allowances</p>
              <h3 className="text-2xl font-bold text-white mt-1">₹{totalAllowances.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-indigo-400 mt-1">Bonuses, HRA & Special</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Deductions</p>
              <h3 className="text-2xl font-bold text-white mt-1">₹{totalDeductions.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-amber-400 mt-1">PF, Tax & Insurance</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Processed Slips</p>
              <h3 className="text-2xl font-bold text-white mt-1">{filteredSalaries.length}</h3>
              <p className="text-xs text-cyan-400 mt-1">Across active roster</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Payroll Register & Remuneration Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically verified salary slips and tax withholdings
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-3.5 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m} {m !== 'All' ? '2026' : 'Months'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Period</th>
                <th className="py-3 px-5">Basic Salary</th>
                <th className="py-3 px-5">Allowances</th>
                <th className="py-3 px-5">Deductions</th>
                <th className="py-3 px-5">Net Remuneration</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Disbursed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{s.employee_name}</div>
                      <div className="text-[11px] text-slate-400">ID: EMP-{s.employee_id.toString().padStart(3, '0')}</div>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-200">
                      {s.month} {s.year}
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-300">
                      ₹{s.basic_salary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-5 font-mono text-emerald-400">
                      +₹{s.allowances.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-5 font-mono text-rose-400">
                      -₹{s.deductions.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-sm text-emerald-400">
                        ₹{s.net_salary.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {s.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Disbursed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                      {s.payment_date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No payroll slips match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
