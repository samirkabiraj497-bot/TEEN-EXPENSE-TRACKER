# TeenSpend — Teenager Expense Tracker 🚀

> **Track it. Understand it. Spend smarter.**

TeenSpend is a modern, responsive, full-stack personal finance web application built specifically for teenagers. It helps teens understand where their money goes, visualize their daily spending habits, set category budgets with warning alerts, and receive smart, actionable recommendations to build lifelong financial confidence.

---

## 🌟 Key Features

1. **Teen-Friendly Visual Dashboard**:
   - Time range filters (`Today`, `This Week`, `This Month`, `Last Month`, `This Year`).
   - 4 Live Metric Cards: Total Spent, Remaining Budget, Average Daily Spending, and Top Spending Category.
   - Smooth Recharts Area Line Chart showing daily progression.
   - Category Donut breakdown with percentage distribution.
   - Budget progress meters with active warning states.
   - Personalized smart recommendations preview.

2. **Comprehensive Expense Management**:
   - Quick Teen Presets (Pizza, Metro Card, 5G Data Pack, Steam Games, Books, Movies).
   - Multi-field logging: Title, Amount in ₹, Category, Description, Date, and Payment Method (UPI, Cash, Debit Card, Credit Card, Bank Transfer).
   - Search by title or notes.
   - Category and date filtering.
   - Sorting by newest, oldest, highest, and lowest amount.
   - Modal-based editing and safe deletion with confirmation.

3. **Smart Budget System**:
   - Monthly category budget targets (e.g. Food ₹2,500, Transport ₹1,000, Gaming ₹800).
   - Accessible visual progress bars with 4 distinct states:
     - 🟢 **Safe** (< 80%)
     - 🟡 **Warning** (80% - 89%)
     - 🟠 **Near Limit** (90% - 99%)
     - 🔴 **Exceeded** (> 100%) with overspent calculations.

4. **Intelligent Suggestion Engine**:
   - Data-driven, transparent recommendations calculated directly from real expenses.
   - Concentration detection (alerts when single category exceeds 30-50% of total spend).
   - Month-over-month category spike warnings.
   - Digital subscriptions audit rule.
   - Small recurring micro-purchases tracker.
   - 4 Spending Health Indicators: Budget Usage, Savings Potential, Consistency, and Concentration.

5. **Deep Spending Analytics**:
   - Month-to-Month comparison with net differences and percent changes.
   - Category comparison bar charts.
   - 6-month aggregate macro trends.

6. **Enterprise Security & Privacy**:
   - Passwords hashed with `bcryptjs` (salt rounds: 10).
   - Stateless JWT tokens for authentication with expiration.
   - Complete data isolation: Users can access only their own expenses, budgets, and analytics.
   - Built-in Developer Demo Seeder to populate realistic teen data in 1-click for instant evaluation.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM 6
- **Data Fetching**: Axios with JWT request & response interceptors
- **Visuals & Charts**: Recharts (Area, Donut, and Bar charts)
- **Icons**: Lucide React
- **Styling**: Custom Modern Responsive CSS Design System (Dark mode, glassmorphism, mobile drawer/bottom navigation)

### Backend
- **Runtime**: Node.js
- **Server**: Express.js REST API
- **Architecture**: Clean MVC (Model-View-Controller)
- **Security**: bcryptjs, jsonwebtoken, cors
- **Validation**: Dedicated validator middleware suite

### Database
- **Primary**: Supabase (PostgreSQL with Row Level Security, foreign keys & indexes)
- **Zero-Config Fallback**: Built-in local JSON database engine for instant offline testing without configuration barriers

---

## 📁 Project Structure

```text
teen-expense-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                # Environment variables parser
│   │   │   ├── supabase.js           # Supabase client initializer
│   │   │   └── localDb.js            # Offline local fallback database
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Me, Demo Seeder
│   │   │   ├── expenseController.js  # User-scoped expense CRUD
│   │   │   ├── budgetController.js   # Budget CRUD & spending progress
│   │   │   ├── categoryController.js # Category retrieval & creation
│   │   │   └── analyticsController.js# Summary, trends, comparison & suggestions
│   │   ├── models/
│   │   │   ├── userModel.js          # User queries
│   │   │   ├── expenseModel.js       # Expense queries & filtering
│   │   │   ├── budgetModel.js        # Budget limits & period queries
│   │   │   └── categoryModel.js      # Category queries
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Bearer JWT verification
│   │   │   ├── errorMiddleware.js    # 404 & Centralized error handler
│   │   │   └── validationMiddleware.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── expenseValidator.js
│   │   │   └── budgetValidator.js
│   │   ├── services/
│   │   │   ├── suggestionService.js  # Smart recommendations rule engine
│   │   │   └── seedService.js        # Sample teen expense generator
│   │   ├── utils/
│   │   │   ├── jwt.js                # Token signer & verifier
│   │   │   └── password.js           # Bcrypt hasher & comparer
│   │   ├── app.js                    # Express app & route mounting
│   │   └── server.js                 # HTTP listener entry point
│   ├── data/                         # Local data store
│   ├── schema.sql                    # PostgreSQL Supabase DDL
│   ├── .env                          # Backend secrets (ignored by git)
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx            # Top navbar & user avatar
    │   │   ├── Sidebar.jsx           # Desktop sidebar & Mobile bottom bar
    │   │   ├── ExpenseCard.jsx       # Individual transaction card
    │   │   ├── ExpenseForm.jsx       # Form with inputs & validation
    │   │   ├── BudgetCard.jsx        # Budget card with progress & status
    │   │   ├── SpendingChart.jsx     # Recharts Area spending chart
    │   │   ├── CategoryChart.jsx     # Recharts Donut category chart
    │   │   ├── StatsCard.jsx         # Metric card with badge & icon
    │   │   ├── ProtectedRoute.jsx    # Auth route guard
    │   │   └── Modal.jsx             # Reusable accessible dialog modal
    │   ├── pages/
    │   │   ├── Login.jsx             # Authentication
    │   │   ├── Register.jsx          # New user registration
    │   │   ├── Dashboard.jsx         # Main finance overview
    │   │   ├── Expenses.jsx          # Search, filter, edit & delete
    │   │   ├── AddExpense.jsx        # Logging form with quick presets
    │   │   ├── Budgets.jsx           # Monthly category budget limits
    │   │   ├── Analytics.jsx         # Charts & Month-over-Month
    │   │   ├── Suggestions.jsx       # Rule engine & health indicators
    │   │   └── Profile.jsx           # Preferences & 1-click demo seeder
    │   ├── services/
    │   │   ├── api.js                # Axios instance with interceptors
    │   │   ├── authService.js
    │   │   ├── expenseService.js
    │   │   ├── budgetService.js
    │   │   └── analyticsService.js
    │   ├── context/
    │   │   └── AuthContext.jsx       # User session state
    │   ├── hooks/
    │   │   └── useAuth.js            # Consumer hook
    │   ├── utils/
    │   │   ├── currency.js           # ₹ INR formatting
    │   │   └── date.js               # Date helpers
    │   ├── App.jsx                   # Route provider
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Custom CSS design system
    ├── .env                          # Frontend environment
    ├── .env.example
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend Server

Open a terminal:
```bash
cd teen-expense-tracker/backend
npm install
npm run dev
```
The backend starts at `http://localhost:5000`.

### 2. Start the Frontend Development Server

Open a second terminal:
```bash
cd teen-expense-tracker/frontend
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

TeenSpend works instantly out-of-the-box. To connect your live Supabase cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `teen-expense-tracker/backend/schema.sql` and run all SQL queries to create the `users`, `expenses`, `budgets`, and `categories` tables, indexes, triggers, and default seeds.
4. Copy your **Project URL** and **Service Role Secret Key** from **Project Settings > API**.
5. Update `teen-expense-tracker/backend/.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```
6. Restart the backend server. It will automatically detect Supabase and run against your live cloud database!

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Bcrypt with salted rounds. Plaintext passwords are never stored or logged.
- **Stateless Authorization**: All protected endpoints enforce valid JWT tokens.
- **Strict Authorization Boundary**: The backend extracts `user_id` strictly from the verified JWT payload (`req.user.id`). Client-provided IDs in the request body are never trusted.
- **Service Role Key Isolation**: Backend-only access for database maintenance; the React frontend never touches service role keys.
- **Safe Error Responses**: Sensitive internal server error stack traces are suppressed in production.
- **Input Sanitization**: Backend validation checks ensure positive amounts and valid dates.

---

## 🧪 Testing the Application

1. Open `http://localhost:5173/register` and create an account (e.g. `Sayan Sharma`, `sayan@example.com`, password `secret123`).
2. After registration, you are redirected to the Dashboard.
3. Visit **Profile** from the top right and click **"Load Sample Teen Expenses & Budgets"**.
4. Navigate to **Dashboard**, **Expenses**, **Budgets**, **Analytics**, and **Suggestions** to see live charts, progress bars, month-over-month comparisons, and personalized recommendations!
