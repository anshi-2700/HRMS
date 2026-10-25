import React, { useState } from 'react';
import { CreditCard, DollarSign, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function PayrollView({
  salaries,
  employees,
  onGenerateSalary,
}) {
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [netSalary, setNetSalary] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const totalDisbursed = salaries.reduce((sum, s) => sum + s.net_salary, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !netSalary) return;
    onGenerateSalary(employeeId, parseFloat(netSalary), date);
    setShowModal(false);
    setEmployeeId('');
    setNetSalary('');
  };

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ '--card-accent': '#10b981' }}>
          <div>
            <div className="stat-label">Total Disbursed Payroll</div>
            <div className="stat-value">₹{totalDisbursed.toLocaleString('en-IN')}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(16, 185, 129, 0.12)', '--icon-color': '#10b981' }}>
            <CreditCard size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#4f46e5' }}>
          <div>
            <div className="stat-label">Disbursed Records</div>
            <div className="stat-value">{salaries.length}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(79, 70, 229, 0.12)', '--icon-color': '#4f46e5' }}>
            <FileText size={24} />
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <div>
            <h2 className="section-title">Payroll Register & Salary Slips</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Monthly remuneration records with fixed-point accuracy
            </p>
          </div>
          <button
            className="btn btn-primary"
            id="btn-open-generate-salary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            <span>Record Salary Slip</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee Code</th>
                <th>Designation</th>
                <th>Payment Date</th>
                <th>Net Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length > 0 ? (
                salaries.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{s.employee_name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-purple">{s.employee_code}</span>
                    </td>
                    <td>{s.designation}</td>
                    <td>{s.date}</td>
                    <td>
                      <strong style={{ color: 'var(--success)', fontSize: '0.95rem' }}>
                        ₹{s.net_salary.toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Disbursed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No salary records logged. Click "Record Salary Slip" to generate one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Salary Slip</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select
                  className="form-control"
                  id="salary-employee-select"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.employeeid}) - {e.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Net Salary (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="salary-amount-input"
                  required
                  placeholder="e.g. 65000"
                  value={netSalary}
                  onChange={(e) => setNetSalary(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Disbursement Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="salary-date-input"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="btn-confirm-salary"
                >
                  Record Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
