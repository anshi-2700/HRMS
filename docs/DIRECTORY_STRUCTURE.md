# Nexus Workforce OS — Directory Structure

This document details the layout and architecture of the Nexus Workforce OS repository.

```
nexus-workforce-os/
├── backend/                  # Python & Django Ninja REST API service
│   ├── apps/                 # Modular domain applications
│   │   ├── asset/            # Corporate hardware inventory & depreciation
│   │   ├── candidate/        # Candidate recruitment pipeline
│   │   ├── client/           # Client portal & account isolation
│   │   ├── employee/         # Staff directory, attendance register, leaves
│   │   ├── hrms/             # Core HRMS administration
│   │   ├── job/              # Job postings & requisitions
│   │   ├── main/             # Global company models & utilities
│   │   ├── payroll/          # Remuneration & salary slips
│   │   └── user/             # RBAC authentication & authorization
│   ├── config/               # System configuration & routing
│   │   ├── api.py            # Typed Django Ninja REST API & OpenAPI docs
│   │   ├── settings/         # Base, local, and production settings
│   │   ├── urls.py           # Core URL dispatcher
│   │   └── celery.py         # Asynchronous task queue configuration
│   ├── compose/              # Container build definitions & entrypoints
│   ├── requirements/         # Split dependencies (base.txt, local.txt, production.txt)
│   └── manage.py             # CLI entrypoint
│
├── frontend/                 # Modern React 19 + Vite Single Page Application (SPA)
│   ├── src/
│   │   ├── components/       # Dedicated UI views & modals
│   │   ├── api.js            # Unified REST client with session handling
│   │   ├── index.css         # Tokenized design system (Dark & Light modes)
│   │   └── App.jsx           # Main application state machine
│   ├── package.json          # Frontend dependencies & scripts
│   └── vite.config.js        # Vite dev server & API proxy
│
├── docker-compose.yml        # Orchestration for Backend, Frontend, Postgres, & Redis
├── start-all.bat             # 1-Click launcher using Docker Compose
├── start-local.bat           # 1-Click launcher for local dev
├── start-backend.bat         # Backend standalone launcher
├── start-frontend.bat        # Frontend standalone launcher
└── stop-all.bat              # Stop running containers
```
