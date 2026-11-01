import React from 'react';
import { 
  Search, 
  UserCircle2, 
  LogOut, 
  LogIn, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { User, Role } from '../types';

interface TopbarProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSwitchPersona: (role: 'admin' | 'manager' | 'employee') => Promise<void>;
  apiHealthy: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onSwitchPersona,
  apiHealthy,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 select-none shadow-xs">
      {/* Global Search */}
      <div className="flex items-center gap-3 w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employees, requisitions, payroll..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Real 1-Click Persona Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 hidden sm:inline">
            Role:
          </span>
          <button
            onClick={() => onSwitchPersona('admin')}
            title="Switch to Aarav Sharma (HR Admin)"
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              currentUser?.role === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white'
            }`}
          >
            Aarav (Admin)
          </button>
          <button
            onClick={() => onSwitchPersona('manager')}
            title="Switch to Priya Iyer (Engineering Manager)"
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              currentUser?.role === 'manager' || currentUser?.role === 'client'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white'
            }`}
          >
            Priya (Manager)
          </button>
          <button
            onClick={() => onSwitchPersona('employee')}
            title="Switch to Vikram Malhotra (Staff)"
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              currentUser?.role === 'employee'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white'
            }`}
          >
            Vikram (Staff)
          </button>
        </div>

        {/* Backend Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700">
          <span className={`w-2 h-2 rounded-full ${apiHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>FastAPI</span>
        </div>

        {/* User Account / Profile */}
        {currentUser ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
              {currentUser.full_name ? currentUser.full_name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold capitalize">
                {currentUser.role} &bull; India
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
