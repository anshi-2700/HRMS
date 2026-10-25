import React from 'react';
import { Sun, Moon, LogIn, LogOut, CheckCircle2, Clock } from 'lucide-react';

export default function Topbar({
  pageTitle,
  theme,
  toggleTheme,
  user,
  onOpenLogin,
  onLogout,
  onQuickClockIn,
  apiHealthy,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{pageTitle}</h1>
        <div className="api-status" title={apiHealthy ? 'Connected to Django Ninja API' : 'Connecting to API...'}>
          <span className="status-dot" style={{ backgroundColor: apiHealthy ? '#10b981' : '#f59e0b' }} />
          <span>{apiHealthy ? 'API Online' : 'Connecting'}</span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="btn btn-secondary btn-sm"
          id="btn-quick-clock-in"
          onClick={onQuickClockIn}
          title="Mark presence for today"
        >
          <Clock size={15} color="#4f46e5" />
          <span>Quick Clock-In</span>
        </button>

        <button
          className="theme-btn"
          id="btn-theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="user-badge" id="user-profile-badge">
          <div className="user-avatar">
            {user?.first_name ? user.first_name[0].toUpperCase() : 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.first_name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Admin'}</span>
          </div>
        </div>

        {user?.is_authenticated ? (
          <button
            className="btn btn-secondary btn-sm"
            id="btn-logout"
            onClick={onLogout}
            title="Log out"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            id="btn-login-modal"
            onClick={onOpenLogin}
          >
            <LogIn size={14} />
            <span>Switch User</span>
          </button>
        )}
      </div>
    </header>
  );
}
