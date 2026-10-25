import React, { useState } from 'react';
import { Shield, User, Briefcase, KeyRound } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    executeLogin(u, p);
  };

  const executeLogin = async (u, p) => {
    setLoading(true);
    setError('');
    try {
      await onLogin(u, p);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(username, password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Sign In to Nexus Workforce OS</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            QUICK DEMO ROLES (1-CLICK SIGN IN)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              id="quick-admin-login"
              style={{ flexDirection: 'column', padding: '10px 6px', textAlign: 'center' }}
              onClick={() => handleQuickLogin('admin', 'admin')}
            >
              <Shield size={16} color="#4f46e5" />
              <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>Admin</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Full Access</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              id="quick-client-login"
              style={{ flexDirection: 'column', padding: '10px 6px', textAlign: 'center' }}
              onClick={() => handleQuickLogin('hrmsclient1', 'password@123')}
            >
              <Briefcase size={16} color="#0ea5e9" />
              <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>Client</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Portal</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              id="quick-employee-login"
              style={{ flexDirection: 'column', padding: '10px 6px', textAlign: 'center' }}
              onClick={() => handleQuickLogin('employee1', 'password@123')}
            >
              <User size={16} color="#10b981" />
              <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>Employee</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Self Service</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="input-login-username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="input-login-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            id="btn-login-submit"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
            disabled={loading}
          >
            <KeyRound size={16} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
