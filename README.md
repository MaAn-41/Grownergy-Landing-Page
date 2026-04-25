# 🌞 Grownergy — Setup Guide

Complete guide to get the project running on any machine.

---

## ⚙️ Prerequisites — Install These First

### 1. Node.js (v20 or higher)
Download from: https://nodejs.org/en/download

Verify installation:
```bash
node -v   # should show v20.x.x
npm -v    # should show 10.x.x
```

### 2. pnpm (Package Manager)
```bash
npm install -g pnpm
```
Verify:
```bash
pnpm -v   # should show 9.x.x
```

---

## 📁 Project Structure

```
Grownergy/
├── artifacts/
│   ├── api-server/        ← Express backend (Node.js)
│   │   ├── src/
│   │   └── package.json
│   └── grownergy/         ← React frontend (Vite)
│       ├── src/
│       └── package.json
├── lib/                   ← Shared libraries
├── package.json           ← Root workspace config
├── pnpm-workspace.yaml
└── .env                   ← Environment variables (you create this)
```

---

## 🔑 Environment Variables Setup

Create a **`.env`** file in the project root by copying the example:

```bash
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# API Server Port
PORT=3000

# Your ERPNext instance URL (no trailing slash)
ERPNEXT_URL=https://your-erpnext-instance.com

# ERPNext API Key & Secret
# Where to find: ERPNext → My Settings → API Access → Generate Keys
ERPNEXT_API_KEY=your_api_key_here
ERPNEXT_API_SECRET=your_api_secret_here

# Frontend ERPNext URL (same as above)
VITE_ERPNEXT_URL=https://your-erpnext-instance.com
```

---

## 🚀 First Time Setup (Only Once)

Navigate to the project folder and run:

```bash
pnpm install
```

This installs all dependencies for both frontend and backend in one command.

---

## ▶️ Running the Project (Daily)

Open **two separate terminals:**

### Terminal 1 — Backend (API Server)
```bash
cd artifacts/api-server
pnpm run dev
```
Backend runs at `http://localhost:3000`

### Terminal 2 — Frontend (React App)
```bash
cd artifacts/grownergy
pnpm run dev
```
Frontend runs at `http://localhost:5173`

**Open in browser:** http://localhost:5173

---

## 🏗️ Production Build (For Deployment)

```bash
# Run from project root
pnpm run build
```

- Frontend build → `artifacts/grownergy/dist/`
- Backend build → `artifacts/api-server/dist/`

---

## 📦 All Dependencies

### 🔵 Frontend — `artifacts/grownergy/`

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.1.0 | UI framework |
| `react-dom` | 19.1.0 | React DOM rendering |
| `vite` | ^7.3.2 | Build tool & dev server |
| `@vitejs/plugin-react` | ^5.0.4 | React support for Vite |
| `tailwindcss` | ^4.1.14 | CSS framework |
| `@tailwindcss/vite` | ^4.1.14 | Tailwind Vite plugin |
| `axios` | ^1.15.2 | HTTP requests |
| `wouter` | ^3.3.5 | Client-side routing |
| `lucide-react` | ^0.545.0 | Icons |
| `framer-motion` | ^12.23.24 | Animations |
| `@tanstack/react-query` | ^5.90.21 | Data fetching & caching |
| `zod` | ^3.25.76 | Schema validation |
| `react-hook-form` | ^7.55.0 | Form management |
| `@hookform/resolvers` | ^3.10.0 | Form validation |
| `sonner` | ^2.0.7 | Toast notifications |
| `next-themes` | ^0.4.6 | Dark/light mode |
| `clsx` | ^2.1.1 | Conditional classes |
| `tailwind-merge` | ^3.3.1 | Tailwind class merging |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `recharts` | ^2.15.2 | Charts |
| `date-fns` | ^3.6.0 | Date utilities |
| `cmdk` | ^1.1.1 | Command menu |
| `vaul` | ^1.1.2 | Drawer component |
| `embla-carousel-react` | ^8.6.0 | Carousel |
| `react-day-picker` | ^9.11.1 | Date picker |
| `react-resizable-panels` | ^2.1.7 | Resizable panels |
| `input-otp` | ^1.4.2 | OTP input |
| `react-icons` | ^5.4.0 | Additional icons |
| `tw-animate-css` | ^1.4.0 | Tailwind animations |
| **Radix UI** (30+ packages) | various | Headless UI components |

### 🟢 Backend — `artifacts/api-server/`

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5 | Web server framework |
| `cors` | ^2 | Cross-Origin requests |
| `dotenv` | ^16.4.5 | Environment variables |
| `pino` | ^9 | Fast logging |
| `pino-http` | ^10 | HTTP request logging |
| `cookie-parser` | ^1.4.7 | Cookie handling |
| `node-fetch` | ^3.3.2 | HTTP fetch |
| `drizzle-orm` | ^0.45.2 | Database ORM |
| `esbuild` | ^0.27.3 | TypeScript bundler |
| `cross-env` | ^10.1.0 | Cross-platform env vars |
| `typescript` | ~5.9.2 | TypeScript compiler |

---

## ❌ Common Errors & Fixes

### `pnpm: command not found`
```bash
npm install -g pnpm
```

### `Cannot find module` or `ERR_MODULE_NOT_FOUND`
```bash
pnpm install   # run again from project root
```

### `PORT environment variable is required`
Check your `.env` file — it must exist in the root folder with `PORT=3000` set.

### No data loading from ERPNext
- Verify your ERPNext instance is running
- Double-check API Key and Secret in `.env`
- Ensure the ERPNext user has Item read permissions

### Frontend works but API calls fail
Both terminals must be running simultaneously. Make sure the backend (Terminal 1) is started before using the app.

---

## 🛠️ Tech Stack

```
Frontend:  React 19 + Vite + Tailwind CSS + shadcn/ui
Backend:   Node.js + Express 5 + TypeScript
Database:  ERPNext (via REST API)
Package:   pnpm (workspace monorepo)
Deploy:    Vercel (frontend) + any Node host (backend)
```

---

## 📞 Quick Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies (run from root) |
| `cd artifacts/api-server && pnpm run dev` | Start backend server |
| `cd artifacts/grownergy && pnpm run dev` | Start frontend app |
| `pnpm run build` | Production build (run from root) |
