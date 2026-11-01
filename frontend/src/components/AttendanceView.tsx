import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Building2,
  UserCheck
} from 'lucide-react';
import { AttendanceRecord, Employee, User } from '../types';

interface AttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  employees: Employee[];
  currentUser: User | null;
  onPunch: (employeeId: number, punchType: 'clock_in' | 'clock_out') => Promise<void>;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceRecords,
  employees,
  currentUser,
  onPunch,
}) => {
  const isEmployee = currentUser?.role === 'employee';
  const defaultEmpId = currentUser?.employee_id || employees[0]?.id || 1;
  const [selectedEmpId, setSelectedEmpId] = useState<number>(defaultEmpId);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [punching, setPunching] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.employee_id) {
      setSelectedEmpId(currentUser.employee_id);
    }
  }, [currentUser]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePunchAction = async (type: 'clock_in' | 'clock_out') => {
    setPunching(true);
    try {
      await onPunch(selectedEmpId, type);
    } finally {
      setPunching(false);
    }
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const halfDayCount = attendanceRecords.filter(r => r.status === 'half_day').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Attendance &amp; Biometric Time Clock
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Real-time punch logging, shift attendance audit, and Indian Standard Time (IST) tracking
        </p>
      </div>

      {/* Clock Widget & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Punch Console */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                WorkNest Time Terminal
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                IST Active
              </span>
            </div>

            {/* Large Digital Clock */}
            <div className="text-3xl font-mono font-black tracking-tight text-slate-900 mb-1 tabular-nums">
              {currentTime || '09:15:00 AM'}
            </div>
            <p className="text-xs text-slate-500 mb-5 font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Personnel Selector or Locked View */}
            {isEmployee ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Punching As:
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {currentUser?.full_name} ({employees.find(e => e.id === currentUser?.employee_id)?.employee_id || 'WN-IND-1003'})
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pune Technology Center &bull; Engineering
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-bold text-slate-700">Select Personnel</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.first_name} {e.last_name} ({e.employee_id} - {e.department})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Punch Actions */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => handlePunchAction('clock_in')}
              disabled={punching}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Clock IN</span>
            </button>
            <button
              onClick={() => handlePunchAction('clock_out')}
              disabled={punching}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 disabled:opacity-50 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Clock OUT</span>
            </button>
          </div>
        </div>

        {/* Presence Summary Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>On Duty (Full Day)</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">Present</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 tabular-nums">{presentCount}</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">Logged 8+ standard hours</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Half Day Shifts</span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">4 Hours</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 tabular-nums">{halfDayCount}</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">First or second half shift</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Absent / On Leave</span>
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">Time Off</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 tabular-nums">{absentCount}</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">Sanctioned statutory leave</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Today&apos;s Daily Presence Register
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {attendanceRecords.length} records logged today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Personnel</th>
                <th className="py-3 px-4">Punch In (IST)</th>
                <th className="py-3 px-4">Punch Out (IST)</th>
                <th className="py-3 px-4">Hours Logged</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {r.employee_name}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-mono font-medium">
                    {r.punch_in || '--:--'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-mono font-medium">
                    {r.punch_out || '--:--'}
                  </td>
                  <td className="py-3 px-4 text-slate-900 tabular-nums font-semibold">
                    {r.work_hours > 0 ? `${r.work_hours.toFixed(1)} hrs` : '0.0 hrs'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      r.status === 'present'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : r.status === 'half_day'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {r.status === 'present' ? 'Present' : r.status === 'half_day' ? 'Half Day' : 'Absent'}
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
