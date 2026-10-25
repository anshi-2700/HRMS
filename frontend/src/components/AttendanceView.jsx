import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AttendanceView({
  attendanceList,
  onClockIn,
  employees,
}) {
  const [selectedEmp, setSelectedEmp] = useState('');
  const [status, setStatus] = useState('present');

  const handleManualClockIn = (e) => {
    e.preventDefault();
    onClockIn(status, selectedEmp || null);
    setSelectedEmp('');
  };

  return (
    <div>
      <div className="two-col-grid" style={{ marginBottom: '24px' }}>
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="content-header">
            <h2 className="section-title">Record Attendance</h2>
          </div>
          <form onSubmit={handleManualClockIn}>
            <div className="form-group">
              <label className="form-label">Select Employee (or Leave Blank for Current User)</label>
              <select
                className="form-control"
                id="select-attendance-emp"
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
              >
                <option value="">Current User / First Active Employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name} ({e.employeeid}) - {e.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Attendance Status</label>
              <select
                className="form-control"
                id="select-attendance-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="present">Present (Full Day)</option>
                <option value="half-day">Half Day</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="btn-submit-attendance"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Clock size={16} />
              <span>Submit Attendance Check-In</span>
            </button>
          </form>
        </div>

        <div className="content-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
            {attendanceList.filter((a) => a.status === 'present').length}
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Employees Present Today
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <h2 className="section-title">Today's Attendance Register</h2>
          <span className="badge badge-primary">{attendanceList.length} Logged</span>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee Code</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((rec) => (
                  <tr key={rec.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{rec.employee_name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-purple">{rec.employee_code}</span>
                    </td>
                    <td>{rec.department}</td>
                    <td>{rec.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          rec.status === 'present'
                            ? 'badge-success'
                            : rec.status === 'half-day'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {rec.status === 'present' ? <CheckCircle2 size={12} /> : null}
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No attendance records for today. Use the check-in form above to clock in!
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
