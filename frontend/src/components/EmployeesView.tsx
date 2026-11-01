import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  ReceiptIndianRupee,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { Employee } from '../types';

interface EmployeesViewProps {
  employees: Employee[];
  canManage?: boolean;
  onOpenAddModal: () => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  canManage = true,
  onOpenAddModal,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = [
    'All',
    'Engineering & Technology',
    'Product Design & UI/UX',
    'People Operations (HR)',
    'Finance & Accounts',
    'Enterprise Client Partnerships'
  ];

  const filtered = employees.filter((emp) => {
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const nameMatch = `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
    const desigMatch = emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = emp.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && (nameMatch || idMatch || desigMatch || locMatch);
  });

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(1)}L / yr`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Personnel Directory
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Directory of organization personnel across Indian offices, compensation profiles &amp; statutory identifiers
          </p>
        </div>

        {canManage && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Personnel</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, ID, role, city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department &amp; Title</th>
                <th className="py-3 px-4">Work Location</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">CTC &amp; Statutory</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  {/* Name & ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {emp.first_name} {emp.last_name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">
                          {emp.employee_id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Department & Title */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{emp.designation}</span>
                    <span className="text-[11px] text-slate-500">{emp.department}</span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-700">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{emp.location || 'Bengaluru (HQ)'}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px] font-medium">{emp.email}</span>
                      </div>
                      {emp.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{emp.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Compensation & Statutory */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block tabular-nums">
                      {formatLakhs(emp.salary)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      PAN: {emp.pan_number || 'AABCS1234F'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      emp.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : emp.status === 'on_leave'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
