import React, { useState } from 'react';
import { Shield, User, Briefcase, KeyRound, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (u: string, p: string) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    executeLogin(u, p);
  };

  const executeLogin = async (u: string, p: string) => {
    setLoading(true);
    setError('');
    try {
      await onLogin(u, p);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(username, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              Sign In to Nexus Workforce OS
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Role-based security authentication gateway</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* 1-Click Role Login Shortcuts */}
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Quick Demo Persona Login (1-Click)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="quick-admin-login"
              onClick={() => handleQuickLogin('admin', 'admin')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-indigo-500/50 transition-all group text-center"
            >
              <Shield size={16} className="text-indigo-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-white">Admin</span>
              <span className="text-[10px] text-slate-400">Master Level</span>
            </button>

            <button
              type="button"
              id="quick-client-login"
              onClick={() => handleQuickLogin('hrmsclient1', 'password@123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 transition-all group text-center"
            >
              <Briefcase size={16} className="text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-white">HR Client</span>
              <span className="text-[10px] text-slate-400">Client Portal</span>
            </button>

            <button
              type="button"
              id="quick-employee-login"
              onClick={() => handleQuickLogin('employee1', 'password@123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/50 transition-all group text-center"
            >
              <User size={16} className="text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-white">Employee</span>
              <span className="text-[10px] text-slate-400">Self Service</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username / Identifier</label>
            <input
              type="text"
              id="input-login-username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Security Password</label>
            <input
              type="password"
              id="input-login-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-login-submit"
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
          >
            <KeyRound size={15} />
            <span>{loading ? 'Authenticating...' : 'Authenticate & Enter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
