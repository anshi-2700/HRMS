import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Briefcase,
  Boxes,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: stats?.total_employees },
    { id: 'attendance', label: 'Attendance', icon: Clock, badge: stats?.present_today ? `${stats.present_today} Present` : null },
    { id: 'leaves', label: 'Leave Tracker', icon: CalendarDays, badge: stats?.on_leave_today ? `${stats.on_leave_today} On Leave` : null },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase, badge: stats?.total_jobs ? `${stats.total_jobs} Jobs` : null },
    { id: 'assets', label: 'Assets', icon: Boxes },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">N</div>
        <div className="brand-title">
          <span>Nexus</span>
          <span className="brand-subtitle">Workforce OS</span>
        </div>
      </div>

      <ul className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <li
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <a
          href="http://localhost:8000/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="api-link-badge"
          title="Open interactive Swagger API documentation"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode size={16} />
            <span>OpenAPI Docs</span>
          </div>
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>/api/docs ↗</span>
        </a>

        <div style={{ padding: '8px 12px', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Django Ninja Backend</span>
        </div>
      </div>
    </aside>
  );
}
