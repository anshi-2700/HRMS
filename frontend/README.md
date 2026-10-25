# Nexus Workforce OS — Web Console (Frontend SPA)

Enterprise Single Page Application (SPA) built with **React 19** and **Vite**, providing a glassmorphic user interface for Nexus Workforce OS.

---

## Architecture

- **UI Framework**: React 19 Single Page Application
- **Build System**: Vite 6.x
- **Styling**: Modern Vanilla CSS Token Design System (`src/index.css`) with Dark and Light mode support
- **State & Communication**: Unified REST Client (`src/api.js`) consuming typed Django Ninja endpoints
- **Component Hierarchy**:
  - `Sidebar.jsx`: Dynamic navigation across Dashboard, Employees, Attendance, Leaves, Payroll, ATS Recruitment, and Assets.
  - `Topbar.jsx`: Global search, quick metrics, theme toggler, and user session management.
  - `DashboardView.jsx`: Real-time KPI widgets and workforce status counters.
  - `EmployeesView.jsx`: Corporate personnel directory with filtering and modal insertion.
  - `AttendanceView.jsx`: Time-clock punch console and daily audit logs.
  - `LeavesView.jsx`: Leave request submission and managerial approval workflow.
  - `PayrollView.jsx`: Compensation registry and net salary slips.
  - `RecruitmentView.jsx`: Candidate ATS pipeline and job requisitions.
  - `AssetsView.jsx`: IT hardware equipment allocation and tracking.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server on port 5173
npm run dev

# Compile production bundle
npm run build
```

---

&copy; 2026 Nexus Global Technologies Inc. All Rights Reserved. Proprietary and Confidential.
