import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  UserCheck
} from 'lucide-react';
import { AttendanceRecord, Employee } from '../types';

interface AttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  employees: Employee[];
  onPunch: (employeeId: number, punchType: 'clock_in' | 'clock_out') => Promise<void>;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceRecords,
  employees,
  onPunch,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<number>(employees[0]?.id || 1);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [punching, setPunching] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Attendance &amp; Time Clock
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time punch biometric logging, daily shift audit, and presence verification
        </p>
      </div>

      {/* Clock Widget & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Punch Console */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-800/50 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Nexus Time Terminal
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Large Digital Clock */}
            <div className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-white mb-2">
              {currentTime || '09:00:00 AM'}
            </div>
            <p className="text-xs text-indigo-200/80 mb-6">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Employee Selector */}
            <div className="space-y-1.5 mb-6">
              <label className="text-[11px] font-semibold text-indigo-200">Select Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id} className="bg-slate-900">
                    {e.first_name} {e.last_name} ({e.employee_id} - {e.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={punching}
              onClick={() => handlePunchAction('clock_in')}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Clock In</span>
            </button>
            <button
              disabled={punching}
              onClick={() => handlePunchAction('clock_out')}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Clock Out</span>
            </button>
          </div>
        </div>

        {/* Attendance Summary Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Present</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{presentCount}</span>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">On-time shifts logged</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Half Day</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{halfDayCount}</span>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Partial shift recorded</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Absent / Leave</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{absentCount}</span>
              <p className="text-[11px] text-red-500 font-semibold mt-0.5">Approved leave or absent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Today's Attendance Register
          </h2>
          <span className="text-xs text-slate-400">
            {new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Punch In</th>
                <th className="py-3 px-4">Punch Out</th>
                <th className="py-3 px-4">Hours Logged</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No attendance logs recorded for today yet.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((rec) => {
                  const statusColors = {
                    present: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                    half_day: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                    absent: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
                  }[rec.status] || 'bg-slate-100 text-slate-600';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {rec.employee_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {rec.punch_in || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {rec.punch_out || 'Active on shift'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {rec.work_hours.toFixed(1)} hrs
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${statusColors}`}>
                          {rec.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
