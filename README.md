# SpendWise: Modern MERN Expense Tracker

A full-stack financial tracking and analytics platform built with the **MERN Stack (MongoDB, Express, React, Node.js)**. Designed and implemented for the **Full Stack Frameworks Mini Project Evaluation**.

[![Repository](https://img.shields.io/badge/GitHub-mern--expense--tracker-blue?logo=github)](https://github.com/aksharsakhi/mern-expense-tracker)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render%20Cloud-success?logo=render)](https://mern-expense-tracker-jskq.onrender.com)
[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20|%20Express%20|%20React%20|%20Node.js-green)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> 🌐 **Live Online Application URL:** [https://mern-expense-tracker-jskq.onrender.com](https://mern-expense-tracker-jskq.onrender.com)  
> The full MERN application (React frontend, Express REST API, and MongoDB Atlas database) is live online and accessible globally over HTTPS on Render Cloud.

---

## 📌 Project Overview

SpendWise empowers users to manage their daily finances effortlessly. It provides an intuitive, high-performance dashboard to track daily income and expenses, categorize transactions, visualize spending patterns through dynamic charts, and gain deep insights via MongoDB aggregation pipelines.

### Key Highlights
- **Full CRUD Operations**: Create, Read, Update, and Delete income and expense transactions.
- **Monthly Summary & Filtering**: Filter transactions seamlessly by month (`YYYY-MM`), category, type (income/expense), and keyword search.
- **MongoDB Aggregation Pipelines**: Multi-stage aggregation pipelines computing total income, total expenses, net balance, savings rate, category-wise breakdowns, and daily spending velocity.
- **Data Visualization**: Interactive Donut charts (category distribution) and Bar charts (income vs. expense & daily burn) powered by Chart.js.
- **Responsive UI/UX**: Premium modern interface featuring dark/light modes, glassmorphism, fluid micro-animations, and toast feedback.
- **Export & Demo Seed**: Export transaction history to CSV and instant one-click seed button for live presentation demonstration.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Frontend: React + Vite                   │
│   • Dashboard UI, Metric Cards, Chart.js Visuals       │
│   • FilterBar, Transaction Table, Modal Forms          │
│   • Axios / Fetch API Service Layer                    │
└───────────────────────────▲────────────────────────────┘
                            │  HTTP / REST (JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Backend: Node.js + Express                │
│   • RESTful Controllers & Input Validation             │
│   • Advanced MongoDB Aggregation Engine                │
│   • CORS & Error Handling Middleware                   │
└───────────────────────────▲────────────────────────────┘
                            │  Mongoose ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Database: MongoDB                      │
│   • Indexed Transaction Schema                         │
│   • $facet, $group, $sort, $project Aggregations       │
└────────────────────────────────────────────────────────┘
```

---

## 🔌 REST API Specification

| Method | Endpoint | Description | Query / Body Params |
|--------|----------|-------------|---------------------|
| `GET` | `/api/transactions` | List transactions with filters | `?month=2026-10&category=&type=&search=&sort=&page=1&limit=20` |
| `GET` | `/api/transactions/summary` | Aggregated monthly financial summary | `?month=2026-10` |
| `POST` | `/api/transactions` | Create a new transaction | `{ amount, type, category, date, paymentMethod, note }` |
| `GET` | `/api/transactions/:id` | Retrieve transaction by ID | URL parameter `:id` |
| `PUT` | `/api/transactions/:id` | Update an existing transaction | `{ amount, type, category, date, paymentMethod, note }` |
| `DELETE` | `/api/transactions/:id` | Delete a transaction | URL parameter `:id` |
| `POST` | `/api/transactions/seed` | Seed realistic mock data for evaluation | None |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Chart.js, React-Chartjs-2, Lucide Icons, Modern Vanilla CSS Design Tokens.
- **Backend**: Node.js, Express.js, Mongoose 8.
- **Database**: MongoDB 8.x with native aggregation framework.
- **DevOps & Deployment**: Docker (Multi-stage builds), Docker Compose, Nginx, Render Blueprint, Vercel.
- **Presentations**:
  - **LaTeX Beamer Slide Deck**: [`presentation/presentation.pdf`](./presentation/presentation.pdf) (Source: [`presentation/presentation.tex`](./presentation/presentation.tex))
  - **PowerPoint Slide Deck**: [`presentation/Mini_Project_Evaluation_Expense_Tracker.pptx`](./presentation/Mini_Project_Evaluation_Expense_Tracker.pptx)

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally at `mongodb://localhost:27017` (or MongoDB Atlas URI)

### 2. Installation
```bash
git clone https://github.com/aksharsakhi/mern-expense-tracker.git
cd mern-expense-tracker

npm run install-all
```

### 3. Environment Setup
```bash
cp server/.env.example server/.env
```
Default `.env` configuration:
```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/expense_tracker_mern
NODE_ENV=development
```

### 4. Running Locally
Run both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173/`
- Backend API: `http://localhost:5050/api`

---

## 🐳 Production Deployment Strategies

### Option A: Complete Docker Compose Stack (Recommended for Containers)
Launches the full containerized ecosystem: MongoDB database, Express API service, and React frontend served via Nginx reverse proxy on port 8080:

```bash
docker compose up --build -d
```
- Access Frontend Application: `http://localhost:8080/`
- Access Backend API directly: `http://localhost:5050/api`
- Stop containers: `docker compose down`

### Option B: Single-Instance Unified Production Server
In production mode, Express automatically serves the pre-compiled React build from `client/dist` and handles single-page routing:

```bash
# 1. Build the production React frontend bundle
cd client && npm run build && cd ..

# 2. Start the Express server in production mode
NODE_ENV=production PORT=5050 npm start
```
The application is now accessible on `http://localhost:5050/`.

### Option C: Cloud Deployment via Render Blueprint
Deploy directly to [Render](https://render.com) using the included [`render.yaml`](./render.yaml):
1. Push repository to GitHub.
2. In Render Dashboard, click **New +** -> **Blueprint**.
3. Connect your repository `mern-expense-tracker`.
4. Render will automatically provision both the `spendwise-api` web service and `spendwise-client` static site. Set your `MONGO_URI` to a free MongoDB Atlas connection string.

### Option D: Cloud Deployment via Vercel
Deploy the frontend to [Vercel](https://vercel.com) using the preconfigured [`client/vercel.json`](./client/vercel.json):
```bash
cd client
npx vercel
```

---

## 🎓 Evaluation Presentations

### 1. LaTeX Beamer Presentation (PDF)
Located at: [`presentation/presentation.pdf`](./presentation/presentation.pdf)
- **Source**: [`presentation/presentation.tex`](./presentation/presentation.tex)
- **Recompile**:
  ```bash
  cd presentation
  tectonic presentation.tex   # or pdflatex presentation.tex
  ```

### 2. PowerPoint Presentation (.pptx)
Located at: [`presentation/Mini_Project_Evaluation_Expense_Tracker.pptx`](./presentation/Mini_Project_Evaluation_Expense_Tracker.pptx)
- **Regenerate**:
  ```bash
  cd presentation
  python3 generate_presentation.py
  ```
