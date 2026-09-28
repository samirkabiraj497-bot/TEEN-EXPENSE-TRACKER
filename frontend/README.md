# TeenSpend Frontend

Modern, responsive web application for **TeenSpend** (Teenager Expense Tracker) built with React, Vite, React Router, Recharts, and Lucide React.

---

## 🛠️ Tech Stack

- **React 18** with functional components & hooks
- **Vite 6** for lightning-fast build and Hot Module Replacement
- **React Router 6** for route protection and navigation
- **Recharts** for interactive Area, Donut, and Bar charts
- **Axios** with automatic JWT authentication interceptors
- **Modern Responsive CSS Design System** with dark mode aesthetics, mobile bottom navigation, and accessible budget status badges

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default:
```text
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Pages & Features

- **`/login` & `/register`**: Full authentication flow with form validation.
- **`/dashboard`**: Daily greeting, 4 quick stat cards (Total Spent, Remaining Budget, Avg Daily, Top Category), spending overview line chart, category donut breakdown, budget progress meters, smart suggestions, and recent expenses list.
- **`/expenses`**: Search, category filter, date filter, sort (newest, oldest, highest, lowest), add expense button, inline edit modal, and confirmation delete modal.
- **`/add-expense`**: Quick teen tags (Pizza, Metro pass, Steam game, Data booster), payment methods (UPI, Cash, Debit Card), amount, and notes.
- **`/budgets`**: Monthly category budgets with color-coded and icon-indicated progress bars (Safe, Warning, Near Limit, Exceeded).
- **`/analytics`**: Month-to-month comparison cards, daily spending trends, category comparison bar chart, and 6-month macro chart.
- **`/suggestions`**: Transparent rule-based suggestion engine and 4 Spending Health Indicators (Budget Usage, Savings Potential, Spending Consistency, Category Concentration).
- **`/profile`**: Account info, currency configuration, data privacy policy, and 1-click sample demo data loader.
