import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  ReceiptIndianRupee, 
  Briefcase, 
  Laptop, 
  Building2,
  ChevronRight,
  Shield,
  UserCheck
} from 'lucide-react';
import { TabType, User } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: User | null;
  pendingLeavesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  currentUser,
  pendingLeavesCount = 0 
}) => {
  const isEmployee = currentUser?.role === 'employee';
  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'client';
  const isAdmin = currentUser?.role === 'admin';
  const isGuest = !currentUser;

  const getDashboardLabel = () => {
    if (isGuest) return 'Company Gateway';
    if (isAdmin) return 'Executive Command';
    if (isManager) return 'Team Operations';
    return 'My Workspace';
  };

  const getSectionHeader = () => {
    if (isGuest) return 'Public Gateway';
    if (isAdmin) return 'Super Admin Console';
    if (isManager) return 'Department Operations';
    return 'Self-Service Portal';
  };

  const navItems = [
    { 
      id: 'dashboard', 
      label: getDashboardLabel(), 
      icon: LayoutDashboard 
    },
    { 
      id: 'employees', 
      label: isGuest ? 'Personnel Roster' : 'Personnel Directory', 
      icon: Users 
    },
    { 
      id: 'attendance', 
      label: isEmployee ? 'My Attendance & Clock' : 'Attendance & Shifts', 
      icon: Clock 
    },
    { 
      id: 'leaves', 
      label: isEmployee ? 'My Leaves & Holidays' : 'Leave Governance', 
      icon: CalendarDays, 
      badge: (!isEmployee && !isGuest && pendingLeavesCount > 0) ? pendingLeavesCount : undefined 
    },
    { 
      id: 'payroll', 
      label: isEmployee ? 'My Payslips & Tax' : (isGuest ? 'Remuneration Standard' : 'Payroll & CTC Ledger'), 
      icon: ReceiptIndianRupee 
    },
    { 
      id: 'recruitment', 
      label: isGuest ? 'Open Tech Roles' : (isEmployee ? 'Internal Job Openings' : 'Recruitment & ATS'), 
      icon: Briefcase 
    },
    { 
      id: 'assets', 
      label: isEmployee ? 'My Allocated Assets' : 'IT Assets Register', 
      icon: Laptop 
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col shrink-0 select-none min-h-screen shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200 gap-3 bg-white">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
          W
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-slate-900 tracking-tight text-sm truncate">WorkNest</span>
          <span className="text-[10px] text-blue-600 font-bold tracking-wide">Workforce &amp; Payroll OS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>{getSectionHeader()}</span>
          {currentUser && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              {currentUser.role}
            </span>
          )}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Corporate Info Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-900 font-bold">
          <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">WorkNest Technologies</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Bengaluru &bull; Pune &bull; Hyderabad
        </p>
      </div>
    </aside>
  );
};
