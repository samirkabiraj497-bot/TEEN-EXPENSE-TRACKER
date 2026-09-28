# TeenSpend Backend REST API

Production-grade MVC REST API for **TeenSpend** (Teenager Expense Tracker) built with Node.js, Express.js, Supabase PostgreSQL, bcryptjs, and JWT.

---

## 🛠️ Architecture

```text
backend/
├── src/
│   ├── config/          # Environment & Supabase initialization
│   ├── controllers/     # HTTP request & response handlers
│   ├── models/          # Database queries & data persistence
│   ├── routes/          # Express route definitions
│   ├── middleware/      # JWT auth, validation, centralized error handler
│   ├── validators/      # Input validation logic
│   ├── services/        # Smart Spending Suggestion engine & Seed service
│   ├── utils/           # JWT & Bcrypt password helpers
│   ├── app.js           # Express app instance & middleware stack
│   └── server.js        # Server listener
├── data/                # Local persistent fallback data storage
├── schema.sql           # Complete Supabase PostgreSQL schema with RLS
├── .env                 # Environment variables (ignored by git)
└── .env.example         # Environment template
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration works instantly out-of-the-box using the built-in local JSON database engine.
To connect to your cloud Supabase database, paste your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`.

### 3. Run Supabase Database Migration (Optional when using Supabase)
Run the SQL queries in `schema.sql` inside your Supabase project's SQL Editor.

### 4. Start Development Server
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new teenager account
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/auth/me` - Get current user profile (Protected)
- `POST /api/auth/seed-demo` - Load realistic sample teen expenses & budgets (Protected)

### Expenses
- `GET /api/expenses` - Get user expenses with filtering, search & sorting
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses` - Add a new expense
- `PUT /api/expenses/:id` - Update existing expense
- `DELETE /api/expenses/:id` - Delete an expense

### Budgets
- `GET /api/budgets` - Get budgets for current/selected month with spending progress
- `POST /api/budgets` - Create or allocate a monthly budget
- `PUT /api/budgets/:id` - Update budget amount
- `DELETE /api/budgets/:id` - Delete budget

### Categories
- `GET /api/categories` - List all default and custom spending categories
- `POST /api/categories` - Add a custom category

### Analytics & Smart Suggestions
- `GET /api/analytics/summary` - Comprehensive summary statistics
- `GET /api/analytics/category` - Category spending breakdown & percentages
- `GET /api/analytics/monthly` - Daily spending trend & 6-month macro trend
- `GET /api/analytics/comparison` - Current month vs previous month comparison
- `GET /api/analytics/suggestions` - Dynamic rule-based suggestions & health indicators
