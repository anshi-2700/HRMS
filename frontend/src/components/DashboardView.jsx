import React from 'react';
import {
  Users,
  Clock,
  CalendarDays,
  Briefcase,
  Boxes,
  UserCheck,
  ArrowRight,
  PlusCircle,
  Calendar,
} from 'lucide-react';

export default function DashboardView({
  stats,
  onNavigate,
  onOpenAddEmployee,
  onOpenApplyLeave,
  onClockIn,
}) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      {/* Clock Widget Banner */}
      <div className="clock-widget">
        <div>
          <div className="clock-date">{currentDate}</div>
          <div className="clock-time">{currentTime}</div>
          <p style={{ marginTop: '4px', opacity: 0.9, fontSize: '0.9rem' }}>
            Nexus Workforce OS · Enterprise talent management & analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-success"
            id="btn-dash-clockin"
            onClick={() => onClockIn('present')}
          >
            <Clock size={16} />
            <span>Mark Present</span>
          </button>
          <button
            className="btn btn-secondary"
            id="btn-dash-applyleave"
            onClick={onOpenApplyLeave}
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <Calendar size={16} />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--card-accent': '#4f46e5' }}>
          <div>
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats?.total_employees ?? 0}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(79, 70, 229, 0.12)', '--icon-color': '#4f46e5' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#10b981' }}>
          <div>
            <div className="stat-label">Present Today</div>
            <div className="stat-value">{stats?.present_today ?? 0}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(16, 185, 129, 0.12)', '--icon-color': '#10b981' }}>
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#f59e0b' }}>
          <div>
            <div className="stat-label">On Leave Today</div>
            <div className="stat-value">{stats?.on_leave_today ?? 0}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(245, 158, 11, 0.12)', '--icon-color': '#f59e0b' }}>
            <CalendarDays size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#0ea5e9' }}>
          <div>
            <div className="stat-label">Active Job Openings</div>
            <div className="stat-value">{stats?.total_jobs ?? 0}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(14, 165, 233, 0.12)', '--icon-color': '#0ea5e9' }}>
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#8b5cf6' }}>
          <div>
            <div className="stat-label">Total Candidates</div>
            <div className="stat-value">{stats?.total_candidates ?? 0}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(139, 92, 246, 0.12)', '--icon-color': '#8b5cf6' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#ec4899' }}>
          <div>
            <div className="stat-label">Managed Assets</div>
            <div className="stat-value">{stats?.total_assets ?? 0}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(236, 72, 153, 0.12)', '--icon-color': '#ec4899' }}>
            <Boxes size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Employees & Recent Leaves */}
      <div className="two-col-grid">
        <div className="content-card">
          <div className="content-header">
            <h2 className="section-title">Recent Employees</h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('employees')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_employees?.length > 0 ? (
                  stats.recent_employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{emp.name}</strong>
                      </td>
                      <td>
                        <span className="badge badge-primary">{emp.employeeid}</span>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No employees found. Click "Add Employee" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-card">
          <div className="content-header">
            <h2 className="section-title">Recent Leave Requests</h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('leaves')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_leaves?.length > 0 ? (
                  stats.recent_leaves.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{l.employee}</strong>
                      </td>
                      <td>{l.type}</td>
                      <td>{l.days}d</td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No pending leaves.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
