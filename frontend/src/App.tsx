import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { AttendanceView } from './components/AttendanceView';
import { LeavesView } from './components/LeavesView';
import { PayrollView } from './components/PayrollView';
import { RecruitmentView } from './components/RecruitmentView';
import { AssetsView } from './components/AssetsView';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { LoginModal } from './components/LoginModal';
import {
  User,
  DashboardStats,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollSlip,
  JobPosting,
  Candidate,
  AssetItem,
  TabType,
} from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [user, setUser] = useState<User | null>(api.getCurrentUser());
  const [apiHealthy, setApiHealthy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollSlip[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assets, setAssets] = useState<AssetItem[]>([]);

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState<boolean>(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      const health = await api.checkHealth().catch(() => null);
      setApiHealthy(health?.status === 'ok');

      const [
        statsRes,
        empRes,
        attRes,
        leaveRes,
        payRes,
        jobRes,
        candRes,
        assetRes,
      ] = await Promise.allSettled([
        api.getStats(),
        api.getEmployees(),
        api.getAttendance(),
        api.getLeaves(),
        api.getPayroll(),
        api.getJobs(),
        api.getCandidates(),
        api.getAssets(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (empRes.status === 'fulfilled') setEmployees(empRes.value);
      if (attRes.status === 'fulfilled') setAttendance(attRes.value);
      if (leaveRes.status === 'fulfilled') setLeaves(leaveRes.value);
      if (payRes.status === 'fulfilled') setPayroll(payRes.value);
      if (jobRes.status === 'fulfilled') setJobs(jobRes.value);
      if (candRes.status === 'fulfilled') setCandidates(candRes.value);
      if (assetRes.status === 'fulfilled') setAssets(assetRes.value);
    } catch (err: any) {
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auth Handlers
  const handleLogin = async (u: string, p: string) => {
    const res = await api.login(u, p);
    setUser(res.user);
    addToast(`Signed in successfully as ${res.user.full_name} (${res.user.role})`, 'success');
    loadData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    addToast('Signed out of session', 'info');
  };

  // Business Action Handlers
  const handlePunch = async (employeeId: number, punchType: 'clock_in' | 'clock_out') => {
    try {
      const res = await api.punchAttendance(employeeId, punchType);
      addToast(res.message, 'success');
      const updatedAtt = await api.getAttendance();
      setAttendance(updatedAtt);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (err: any) {
      addToast(err.message || 'Failed to record attendance', 'error');
    }
  };

  const handleApproveLeave = async (id: number) => {
    try {
      await api.approveLeave(id);
      addToast('Leave request approved', 'success');
      const updatedLeaves = await api.getLeaves();
      setLeaves(updatedLeaves);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (err: any) {
      addToast(err.message || 'Failed to approve leave', 'error');
    }
  };

  const handleRejectLeave = async (id: number) => {
    try {
      await api.rejectLeave(id);
      addToast('Leave request declined', 'info');
      const updatedLeaves = await api.getLeaves();
      setLeaves(updatedLeaves);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (err: any) {
      addToast(err.message || 'Failed to decline leave', 'error');
    }
  };

  const handleCreateEmployee = async (empData: Omit<Employee, 'id' | 'employee_id' | 'date_of_joining'>) => {
    const created = await api.createEmployee(empData);
    addToast(`Enrolled ${created.first_name} ${created.last_name} (${created.employee_id})`, 'success');
    const updated = await api.getEmployees();
    setEmployees(updated);
    const updatedStats = await api.getStats();
    setStats(updatedStats);
  };

  const handleApplyLeave = async (leaveData: {
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
  }) => {
    await api.applyLeave(leaveData);
    addToast('Leave application submitted for approval', 'success');
    const updated = await api.getLeaves();
    setLeaves(updated);
    const updatedStats = await api.getStats();
    setStats(updatedStats);
  };

  const handleCreateAsset = async (assetData: Omit<AssetItem, 'id' | 'purchase_date'>) => {
    const created = await api.createAsset(assetData);
    addToast(`Asset ${created.asset_tag} (${created.name}) registered`, 'success');
    const updated = await api.getAssets();
    setAssets(updated);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-2xl border text-xs font-medium animate-fadeIn backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-300'
                : t.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/30 text-rose-300'
                : 'bg-slate-900/95 border-indigo-500/30 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        pendingLeavesCount={leaves.filter((l) => l.status === 'pending').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Topbar
          currentUser={user}
          apiHealthy={apiHealthy}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/60 custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium tracking-wide uppercase">Connecting to Nexus Workforce OS...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  onNavigate={setCurrentTab}
                  onQuickPunch={() => setCurrentTab('attendance')}
                />
              )}

              {currentTab === 'employees' && (
                <EmployeesView
                  employees={employees}
                  onOpenAddModal={() => setShowAddEmpModal(true)}
                />
              )}

              {currentTab === 'attendance' && (
                <AttendanceView
                  attendanceRecords={attendance}
                  employees={employees}
                  onPunch={handlePunch}
                />
              )}

              {currentTab === 'leaves' && (
                <LeavesView
                  leaves={leaves}
                  onOpenApplyModal={() => setShowApplyLeaveModal(true)}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              )}

              {currentTab === 'payroll' && (
                <PayrollView
                  salaries={payroll}
                  employees={employees}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'recruitment' && (
                <RecruitmentView
                  jobs={jobs}
                  candidates={candidates}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'assets' && (
                <AssetsView
                  assets={assets}
                  onCreateAsset={handleCreateAsset}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddEmpModal}
        onClose={() => setShowAddEmpModal(false)}
        onEmployeeCreated={handleCreateEmployee}
      />

      <ApplyLeaveModal
        isOpen={showApplyLeaveModal}
        onClose={() => setShowApplyLeaveModal(false)}
        employees={employees}
        onApplyLeave={handleApplyLeave}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;
