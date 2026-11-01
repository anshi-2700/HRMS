import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Employee, User } from '../types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  currentUser: User | null;
  onApplyLeave: (leave: {
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
  }) => Promise<void>;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  employees,
  currentUser,
  onApplyLeave,
}) => {
  const isEmployee = currentUser?.role === 'employee';
  const defaultEmpId = currentUser?.employee_id 
    ? currentUser.employee_id.toString() 
    : (employees.length > 0 ? employees[0].id.toString() : '1');

  const [employeeId, setEmployeeId] = useState<string>(defaultEmpId);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.employee_id) {
      setEmployeeId(currentUser.employee_id.toString());
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const empId = parseInt(employeeId, 10);
    if (isNaN(empId)) {
      setError('Please select an employee.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onApplyLeave({
        employee_id: empId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        days: Number(days),
        reason: reason || undefined,
      });
      onClose();
      setReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            File Leave Application
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Applying Personnel</label>
            {isEmployee ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold">
                {currentUser?.full_name} ({employees.find(e => e.id === currentUser?.employee_id)?.employee_id || 'WN-IND-1003'})
              </div>
            ) : (
              <select
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name} ({e.employee_id}) - {e.department}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Leave Category</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="Casual Leave">Casual Leave (CL - 12 days quota)</option>
              <option value="Privilege Leave">Privilege Leave (PL / Earned - 18 days quota)</option>
              <option value="Sick Leave">Sick / Medical Leave (SL - 12 days quota)</option>
              <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">To Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Days</label>
            <input
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Purpose</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Attending family function / medical checkup"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
