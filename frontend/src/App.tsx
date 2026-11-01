import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { HomePage } from './components/HomePage';
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
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

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

  // Core Organization Data
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

  // Toast Notifications
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

  // Initial data loading
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
    setCurrentTab('dashboard');
    addToast('Signed out successfully. Welcome to WorkNest homepage.', 'info');
    loadData();
  };

  const handleSwitchPersona = async (role: 'admin' | 'manager' | 'employee') => {
    try {
      const newUser = await api.switchPersona(role);
      setUser(newUser);
      addToast(`Switched persona to ${newUser.full_name} (${newUser.role})`, 'success');
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Failed to switch persona', 'error');
    }
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
      addToast(err.message || 'Failed to record attendance punch', 'error');
    }
  };

  const handleApproveLeave = async (id: number) => {
    try {
      const res = await api.approveLeave(id);
      addToast(res.message || 'Leave request approved', 'success');
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
      const res = await api.rejectLeave(id);
      addToast(res.message || 'Leave request declined', 'info');
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
    employee_id?: number;
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
    addToast(`Registered asset ${created.asset_tag} (${created.name})`, 'success');
    const updated = await api.getAssets();
    setAssets(updated);
  };

  const canManage = user?.role === 'admin' || user?.role === 'manager';

  // ================= 1. DEDICATED SIGNED-OUT HOMEPAGE =================
  if (!user) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {/* Toast Notification Container */}
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md ${
                t.type === 'success'
                  ? 'bg-white border-emerald-300 text-slate-900'
                  : t.type === 'error'
                  ? 'bg-white border-rose-300 text-slate-900'
                  : 'bg-white border-blue-300 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {t.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                )}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Dedicated Full-Page Homepage */}
        <HomePage
          jobs={jobs}
          onOpenLogin={() => setShowLoginModal(true)}
          onQuickLogin={handleSwitchPersona}
        />

        {/* Sign In Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  // ================= 2. AUTHENTICATED ROLE WORKSPACE =================
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-white border-emerald-300 text-slate-900'
                : t.type === 'error'
                ? 'bg-white border-rose-300 text-slate-900'
                : 'bg-white border-blue-300 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-slate-400 hover:text-slate-600 ml-2"
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
        currentUser={user}
        pendingLeavesCount={leaves.filter((l) => l.status === 'pending').length}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        {/* Top Header Bar */}
        <Topbar
          currentUser={user}
          apiHealthy={apiHealthy}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onSwitchPersona={handleSwitchPersona}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold tracking-wider uppercase text-slate-500">
                Initializing WorkNest HRMS &bull; FastAPI Backend...
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  currentUser={user}
                  employees={employees}
                  pendingLeaves={leaves.filter((l) => l.status === 'pending')}
                  candidates={candidates}
                  jobs={jobs}
                  onNavigate={setCurrentTab}
                  onQuickPunch={() => setCurrentTab('attendance')}
                  onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
                  onOpenAddEmployee={() => setShowAddEmpModal(true)}
                  onOpenLogin={() => setShowLoginModal(true)}
                  onQuickLogin={handleSwitchPersona}
                  onApproveLeave={handleApproveLeave}
                  onRejectLeave={handleRejectLeave}
                />
              )}

              {currentTab === 'employees' && (
                <EmployeesView
                  employees={employees}
                  canManage={canManage}
                  onOpenAddModal={() => setShowAddEmpModal(true)}
                />
              )}

              {currentTab === 'attendance' && (
                <AttendanceView
                  attendanceRecords={attendance}
                  employees={employees}
                  currentUser={user}
                  onPunch={handlePunch}
                />
              )}

              {currentTab === 'leaves' && (
                <LeavesView
                  leaves={leaves}
                  currentUser={user}
                  onOpenApplyModal={() => setShowApplyLeaveModal(true)}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              )}

              {currentTab === 'payroll' && (
                <PayrollView
                  salaries={payroll}
                  employees={employees}
                  currentUser={user}
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
                  onCreateAsset={canManage ? handleCreateAsset : undefined}
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
        currentUser={user}
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
