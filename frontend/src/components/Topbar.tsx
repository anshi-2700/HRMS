import React from 'react';
import { 
  Search, 
  Bell, 
  Activity, 
  UserCircle, 
  LogOut, 
  LogIn, 
  ShieldAlert 
} from 'lucide-react';
import { User, Role } from '../types';

interface TopbarProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onRoleSwitch?: (role: Role) => void;
  apiHealthy: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onRoleSwitch,
  apiHealthy,
}) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employees, requisitions, payroll slips..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* System Health Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${apiHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span>FastAPI {apiHealthy ? 'Active' : 'Offline'}</span>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onRoleSwitch?.('admin')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
              currentUser?.role === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => onRoleSwitch?.('client')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
              currentUser?.role === 'client'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Client
          </button>
          <button
            onClick={() => onRoleSwitch?.('employee')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
              currentUser?.role === 'employee'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Staff
          </button>
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute top-2 right-2" />
        </button>

        {/* User Account / Profile */}
        {currentUser ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-medium mt-0.5">
                {currentUser.role} Account
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm shadow-indigo-600/30"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
