import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Check, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { LeaveRequest, User } from '../types';

interface LeavesViewProps {
  leaves: LeaveRequest[];
  currentUser: User | null;
  onOpenApplyModal: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
}

export const LeavesView: React.FC<LeavesViewProps> = ({
  leaves,
  currentUser,
  onOpenApplyModal,
  onApprove,
  onReject,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const canAuthorize = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const filtered = leaves.filter((l) => filter === 'all' || l.status === filter);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      if (action === 'approve') await onApprove(id);
      else await onReject(id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Leave Governance &amp; Time-Off Ledger
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Indian statutory leave administration (Casual Leave, Privilege Leave, Sick Leave) &amp; multi-tier approvals
          </p>
        </div>

        <button
          onClick={onOpenApplyModal}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Indian Statutory Policy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Casual Leave (CL)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">12 Days</span>
            <span className="text-xs text-slate-500 font-medium">Monthly credit quota</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Privilege / Earned (PL)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">18 Days</span>
            <span className="text-xs text-slate-500 font-medium">Annual encashable</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Sick / Medical (SL)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">12 Days</span>
            <span className="text-xs text-slate-500 font-medium">Medical certification</span>
          </div>
        </div>
      </div>

      {/* Requests Filter & Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3 bg-slate-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Leave Requests Ledger
          </h2>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Reviewed By</th>
                <th className="py-3 px-4 text-center">Status</th>
                {canAuthorize && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {l.employee_name}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {l.leave_type}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="block font-semibold">{l.start_date} &rarr; {l.end_date}</span>
                    <span className="text-[11px] text-slate-500">{l.days} day(s)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate font-medium">
                    {l.reason || 'Personal matters'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] font-medium">
                    {l.reviewed_by || (l.status === 'pending' ? 'Pending Review' : 'Auto-recorded')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      l.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : l.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {l.status === 'approved' ? 'Approved' : l.status === 'rejected' ? 'Declined' : 'Pending'}
                    </span>
                  </td>
                  {canAuthorize && (
                    <td className="py-3 px-4 text-right">
                      {l.status === 'pending' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleAction(l.id, 'approve')}
                            disabled={processingId === l.id}
                            className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-colors"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAction(l.id, 'reject')}
                            disabled={processingId === l.id}
                            className="p-1 rounded-md bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors"
                            title="Decline"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Archived</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
