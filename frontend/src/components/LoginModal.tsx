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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Sign In to WorkNest HRMS
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Role-based access gateway &bull; India Operations</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 1-Click Role Login Shortcuts */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            1-Click Demo Persona Sign In
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
            >
              <Shield size={16} className="text-blue-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Aarav</span>
              <span className="text-[10px] text-slate-500 font-medium">HR Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('manager1', 'password@123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
            >
              <Briefcase size={16} className="text-blue-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Priya</span>
              <span className="text-[10px] text-slate-500 font-medium">Engineering Lead</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('employee1', 'password@123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
            >
              <User size={16} className="text-blue-600 mb-1" />
              <span className="text-xs font-bold text-slate-900">Vikram</span>
              <span className="text-[10px] text-slate-500 font-medium">Senior Staff</span>
            </button>
          </div>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2 text-slate-400 font-bold">Or enter credentials</span>
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username / Corporate ID</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
};
