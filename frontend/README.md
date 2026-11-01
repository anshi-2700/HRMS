# WorkNest HRMS — Enterprise Web Console (Frontend SPA)

Enterprise Single Page Application (SPA) built with **React 19**, **TypeScript**, and **Tailwind CSS v4**, delivering role-based dashboards, dedicated public portal, and enterprise workforce management for WorkNest HRMS.

---

## Key Features

- **Public Enterprise Portal & Landing Page**: Dedicated homepage (`src/components/HomePage.tsx`) with 1-click role demo switcher, company metrics, open careers, Indian technology hubs, and gazetted holiday calendar.
- **Dedicated Role-Based Dashboards (RBAC)**:
  - **Admin Dashboard** (`src/components/dashboards/AdminDashboard.tsx`): Executive metrics, company payroll ledger (INR ₹), pending approvals, and department distributions.
  - **Manager Dashboard** (`src/components/dashboards/ManagerDashboard.tsx`): Department team roster, direct leave approvals, attendance tracking, and candidate screening.
  - **Employee Dashboard** (`src/components/dashboards/EmployeeDashboard.tsx`): Biometric punch in/out, statutory leave quotas (CL, PL, SL), printable salary slips, and allocated IT assets.
- **Indian Enterprise Localization**: Built-in support for INR currency (`₹`), Indian tax & PF deductions (Basic, HRA, EPF, PT, TDS), PAN, and UAN identifiers.
- **Design System**: Enterprise white surfaces (`#ffffff`, `#f8fafc`), corporate royal blue accents, high-contrast typography, and accessible data tables.

---

## Component Architecture

- `src/App.tsx`: Global layout router and state provider (renders `HomePage` when unauthenticated, and full sidebar + topbar workspace when authenticated).
- `src/components/HomePage.tsx`: Dedicated public portal with quick role logins, careers, and hub locations.
- `src/components/DashboardView.tsx`: Dynamic role-based dispatcher.
- `src/components/dashboards/`: Modular, role-tailored dashboard views.
- `src/components/EmployeesView.tsx`: Personnel directory with PAN/UAN and department filters.
- `src/components/AttendanceView.tsx`: Real-time biometric attendance tracker.
- `src/components/LeavesView.tsx`: Multi-tier statutory leave workflow.
- `src/components/PayrollView.tsx`: Indian payroll breakdown and salary slips.
- `src/components/RecruitmentView.tsx`: Candidate ATS pipeline.
- `src/components/AssetsView.tsx`: IT hardware asset management.
- `src/api.ts`: Typed REST client interfacing with the WorkNest FastAPI backend.

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

&copy; 2026 WorkNest All Rights Reserved.
