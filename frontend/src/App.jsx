import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './components/DashboardView';
import EmployeesView from './components/EmployeesView';
import AttendanceView from './components/AttendanceView';
import LeavesView from './components/LeavesView';
import PayrollView from './components/PayrollView';
import RecruitmentView from './components/RecruitmentView';
import AssetsView from './components/AssetsView';
import AddEmployeeModal from './components/AddEmployeeModal';
import ApplyLeaveModal from './components/ApplyLeaveModal';
import LoginModal from './components/LoginModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(false);

  // Core Data
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [assets, setAssets] = useState([]);

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Search & Filters
  const [empSearch, setEmpSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      const health = await api.getHealth();
      if (health.status === 'healthy') setApiHealthy(true);

      const [userData, statsData, empList, depts, leaves, types, att, sals, jobList, candList, assetList] =
        await Promise.allSettled([
          api.getMe(),
          api.getDashboardStats(),
          api.getEmployees(),
          api.getDepartments(),
          api.getLeaveRequests(),
          api.getLeaveTypes(),
          api.getTodayAttendance(),
          api.getSalaries(),
          api.getJobs(),
          api.getCandidates(),
          api.getAssets(),
        ]);

      if (userData.status === 'fulfilled') setUser(userData.value);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (empList.status === 'fulfilled') setEmployees(empList.value);
      if (depts.status === 'fulfilled') setDepartments(depts.value);
      if (leaves.status === 'fulfilled') setLeaveRequests(leaves.value);
      if (types.status === 'fulfilled') setLeaveTypes(types.value);
      if (att.status === 'fulfilled') setAttendanceList(att.value);
      if (sals.status === 'fulfilled') setSalaries(sals.value);
      if (jobList.status === 'fulfilled') setJobs(jobList.value);
      if (candList.status === 'fulfilled') setCandidates(candList.value);
      if (assetList.status === 'fulfilled') setAssets(assetList.value);
    } catch (err) {
      console.warn('Backend API offline or initializing:', err);
      setApiHealthy(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handlers
  const handleLogin = async (username, password) => {
    const res = await api.login(username, password);
    if (res.success) {
      setUser(res.user);
      addToast(`Welcome back, ${res.user.first_name || res.user.username} (${res.user.role})!`);
      loadInitialData();
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser({ id: 0, first_name: 'Guest', role: 'Guest', is_authenticated: false });
    addToast('Signed out successfully.');
  };

  const handleClockIn = async (status = 'present', employeeId = null) => {
    try {
      const res = await api.clockIn(employeeId, status);
      addToast(res.message);
      const updatedAtt = await api.getTodayAttendance();
      setAttendanceList(updatedAtt);
      const updatedStats = await api.getDashboardStats();
      setStats(updatedStats);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateEmployee = async (data) => {
    const newEmp = await api.createEmployee(data);
    addToast(`Employee ${newEmp.full_name} created successfully!`);
    const [allEmps, newStats] = await Promise.all([api.getEmployees(), api.getDashboardStats()]);
    setEmployees(allEmps);
    setStats(newStats);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;
    try {
      await api.deleteEmployee(id);
      addToast('Employee removed');
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      const newStats = await api.getDashboardStats();
      setStats(newStats);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleApplyLeave = async (data) => {
    const res = await api.applyLeave(data);
    addToast(res.message);
    const updatedLeaves = await api.getLeaveRequests();
    setLeaveRequests(updatedLeaves);
    const updatedStats = await api.getDashboardStats();
    setStats(updatedStats);
  };

  const handleApproveLeave = async (id) => {
    await api.approveLeave(id);
    addToast('Leave application approved');
    const updatedLeaves = await api.getLeaveRequests();
    setLeaveRequests(updatedLeaves);
    const updatedStats = await api.getDashboardStats();
    setStats(updatedStats);
  };

  const handleRejectLeave = async (id) => {
    await api.rejectLeave(id);
    addToast('Leave application rejected', 'error');
    const updatedLeaves = await api.getLeaveRequests();
    setLeaveRequests(updatedLeaves);
    const updatedStats = await api.getDashboardStats();
    setStats(updatedStats);
  };

  const handleGenerateSalary = async (empId, netSalary, date) => {
    const res = await api.generateSalary(empId, netSalary, date);
    addToast(res.message);
    const updatedSals = await api.getSalaries();
    setSalaries(updatedSals);
  };

  const handleCreateJob = async (data) => {
    const newJob = await api.createJob(data);
    addToast(`Job opening "${newJob.job_title}" posted!`);
    const [allJobs, newStats] = await Promise.all([api.getJobs(), api.getDashboardStats()]);
    setJobs(allJobs);
    setStats(newStats);
  };

  const handleUpdateCandidateStatus = async (candidateId, status) => {
    await api.updateCandidateStatus(candidateId, status);
    addToast(`Updated candidate stage to ${status}`);
    const updatedCandidates = await api.getCandidates();
    setCandidates(updatedCandidates);
  };

  const handleCreateAsset = async (data) => {
    const newAsset = await api.createAsset(data);
    addToast(`Asset "${newAsset.name}" registered!`);
    const [allAssets, newStats] = await Promise.all([api.getAssets(), api.getDashboardStats()]);
    setAssets(allAssets);
    setStats(newStats);
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !empSearch ||
      emp.full_name?.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.employeeid?.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.email?.toLowerCase().includes(empSearch.toLowerCase());
    const matchesDept = !selectedDept || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Executive HRMS Dashboard';
      case 'employees': return 'Employee Directory';
      case 'attendance': return 'Attendance & Time Clock';
      case 'leaves': return 'Leave Management & Approvals';
      case 'payroll': return 'Payroll & Compensation';
      case 'recruitment': return 'Talent Acquisition & Jobs';
      case 'assets': return 'Hardware & Asset Inventory';
      default: return 'HRMS Portal';
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} stats={stats} />

      <main className="main-content">
        <Topbar
          pageTitle={getPageTitle()}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onQuickClockIn={() => handleClockIn('present')}
          apiHealthy={apiHealthy}
        />

        <div className="page-container">
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              onNavigate={setCurrentTab}
              onOpenAddEmployee={() => setShowAddEmpModal(true)}
              onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
              onClockIn={handleClockIn}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeesView
              employees={filteredEmployees}
              departments={departments}
              onOpenAddModal={() => setShowAddEmpModal(true)}
              onDeleteEmployee={handleDeleteEmployee}
              search={empSearch}
              setSearch={setEmpSearch}
              selectedDepartment={selectedDept}
              setSelectedDepartment={setSelectedDept}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              attendanceList={attendanceList}
              onClockIn={handleClockIn}
              employees={employees}
            />
          )}

          {currentTab === 'leaves' && (
            <LeavesView
              leaveRequests={leaveRequests}
              leaveTypes={leaveTypes}
              onOpenApplyModal={() => setShowApplyLeaveModal(true)}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              user={user}
            />
          )}

          {currentTab === 'payroll' && (
            <PayrollView
              salaries={salaries}
              employees={employees}
              onGenerateSalary={handleGenerateSalary}
            />
          )}

          {currentTab === 'recruitment' && (
            <RecruitmentView
              jobs={jobs}
              candidates={candidates}
              departments={departments}
              onCreateJob={handleCreateJob}
              onUpdateCandidateStatus={handleUpdateCandidateStatus}
            />
          )}

          {currentTab === 'assets' && (
            <AssetsView assets={assets} onCreateAsset={handleCreateAsset} />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddEmpModal}
        onClose={() => setShowAddEmpModal(false)}
        departments={departments}
        onEmployeeCreated={handleCreateEmployee}
      />

      <ApplyLeaveModal
        isOpen={showApplyLeaveModal}
        onClose={() => setShowApplyLeaveModal(false)}
        leaveTypes={leaveTypes}
        employees={employees}
        onApplyLeave={handleApplyLeave}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.type === 'error' ? (
              <AlertCircle size={18} color="var(--danger)" />
            ) : (
              <CheckCircle2 size={18} color="var(--success)" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
