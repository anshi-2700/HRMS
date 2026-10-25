import React from 'react';
import { Plus, Check, X, Calendar, AlertCircle } from 'lucide-react';

export default function LeavesView({
  leaveRequests,
  leaveTypes,
  onOpenApplyModal,
  onApproveLeave,
  onRejectLeave,
  user,
}) {
  return (
    <div>
      {/* Leave Types Overview */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {leaveTypes.map((t, idx) => (
          <div key={t.id} className="stat-card" style={{ '--card-accent': idx % 2 === 0 ? '#4f46e5' : '#10b981' }}>
            <div>
              <div className="stat-label">{t.name} Allowance</div>
              <div className="stat-value">{t.days} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Days</span></div>
            </div>
            <div className="stat-icon-wrapper">
              <Calendar size={22} />
            </div>
          </div>
        ))}
      </div>

      <div className="content-card">
        <div className="content-header">
          <div>
            <h2 className="section-title">Leave Applications & Approval Workflow</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Review and authorize employee leave requests
            </p>
          </div>
          <button
            className="btn btn-primary"
            id="btn-apply-leave"
            onClick={onOpenApplyModal}
          >
            <Plus size={16} />
            <span>Apply Leave</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{l.employee_name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.employee_code}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{l.leavetype_name}</span>
                    </td>
                    <td>{l.startdate}</td>
                    <td>{l.enddate}</td>
                    <td>
                      <strong>{l.leave_days}</strong> days
                    </td>
                    <td style={{ maxWidth: '200px' }}>{l.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          l.status === 'Approved'
                            ? 'badge-success'
                            : l.status === 'Rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {l.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-success btn-sm"
                            id={`btn-approve-leave-${l.id}`}
                            onClick={() => onApproveLeave(l.id)}
                            title="Approve leave"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            id={`btn-reject-leave-${l.id}`}
                            onClick={() => onRejectLeave(l.id)}
                            title="Reject leave"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No leave applications found. Click "Apply Leave" to submit a request.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
