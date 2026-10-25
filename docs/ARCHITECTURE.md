# Nexus Workforce OS — Technical Architecture

Nexus Workforce OS is an enterprise-grade workforce intelligence platform built on a modern decoupled architecture.

---

## 🏛️ System Overview

The system is split into two primary layers:

### 1. Presentation Layer (`frontend/`)
- **Technology**: React 19, Vite, Vanilla CSS Design System.
- **Role**: Single Page Application (SPA) offering real-time user experiences for attendance, workforce analytics, leave tracking, and payroll.
- **API Connection**: Interacts with the backend via typed REST calls with credentials and session preservation.

### 2. Business Logic & API Layer (`backend/`)
- **Technology**: Python 3.11, Django 5, Django Ninja REST API, PostgreSQL 15, Redis 7.
- **Role**: Domain services, permission validation, persistence, and automated Swagger `/api/docs` generation.

---

## 📦 Domain Modules

| Domain Module | Underlying App | Responsibilities |
| :--- | :--- | :--- |
| **Identity & Access** | `apps.user` | RBAC roles (Admin, Client, Employee), session authentication |
| **Workforce & Staff** | `apps.employee` | Profiles, department hierarchy, designations |
| **Attendance Clock** | `apps.employee` | Daily attendance register, clock-in / clock-out |
| **Leave Management** | `apps.employee` | Leave categories, balances, approval workflows |
| **Payroll Engine** | `apps.payroll` | Fixed-point salary calculation, disbursements |
| **Talent Acquisition** | `apps.job` & `candidate` | Job requisitions, applicant tracking pipeline |
| **Asset Register** | `apps.asset` | Hardware inventory, salvage values, straight-line depreciation |

---

## ⚡ Deployment & Orchestration

- **Containerization**: Standard Docker and Docker Compose orchestration.
- **Database**: PostgreSQL with connection pooling.
- **Cache & Queue**: Redis for Celery asynchronous tasks and caching.
