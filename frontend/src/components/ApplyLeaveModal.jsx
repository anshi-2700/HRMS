import React, { useState } from 'react';

export default function ApplyLeaveModal({
  isOpen,
  onClose,
  leaveTypes,
  employees,
  onApplyLeave,
}) {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveTypeId || !reason) return;

    setLoading(true);
    try {
      await onApplyLeave({
        employee_id: employeeId || null,
        leavetype_id: leaveTypeId,
        startdate: startDate,
        enddate: endDate,
        leave_days: parseInt(days, 10),
        reason,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Apply for Leave</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee (Leave blank for current user)</label>
            <select
              className="form-control"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="">Current User / First Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name} ({e.employeeid})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select
              className="form-control"
              required
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
            >
              <option value="">Select Leave Category...</option>
              {leaveTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.days} Days Allowance)
                </option>
              ))}
            </select>
          </div>

          <div className="two-col-grid">
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Days</label>
            <input
              type="number"
              min="1"
              className="form-control"
              required
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Leave</label>
            <textarea
              className="form-control"
              rows="3"
              required
              placeholder="Provide context or explanation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
