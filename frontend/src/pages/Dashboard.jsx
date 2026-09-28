import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import analyticsService from '../services/analyticsService';
import expenseService from '../services/expenseService';
import budgetService from '../services/budgetService';
import StatsCard from '../components/StatsCard';
import SpendingChart from '../components/SpendingChart';
import CategoryChart from '../components/CategoryChart';
import ExpenseCard from '../components/ExpenseCard';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/currency';
import { 
  Wallet, 
  Calendar, 
  PieChart as PieChartIcon, 
  Flame, 
  PlusCircle, 
  ArrowRight, 
  Lightbulb, 
  AlertTriangle 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [range, setRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, expense: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, catRes, trendRes, budgetRes, expRes, sugRes] = await Promise.all([
        analyticsService.getSummary({ range }),
        analyticsService.getCategoryBreakdown({ range }),
        analyticsService.getMonthlyTrend(),
        budgetService.getBudgets(),
        expenseService.getExpenses({ limit: 5, sort: 'newest' }),
        analyticsService.getSuggestions()
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (catRes.success) setCategories(catRes.data.categories);
      if (trendRes.success) setTrendData(trendRes.data.currentMonthDays);
      if (budgetRes.success) setBudgets(budgetRes.data.budgets || []);
      if (expRes.success) setRecentExpenses(expRes.data.expenses || []);
      if (sugRes.success) setSuggestions(sugRes.data.suggestions || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.expense) return;
    try {
      setActionLoading(true);
      await expenseService.deleteExpense(deleteModal.expense.id);
      setDeleteModal({ isOpen: false, expense: null });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading && !summary) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Friend';

  return (
    <div className="page-wrapper">
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Here's how your money is doing.
          </p>
        </div>

        {/* Time Filters */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'year', label: 'This Year' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className="btn btn-sm"
              style={{
                backgroundColor: range === item.id ? 'var(--primary)' : 'transparent',
                color: range === item.id ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: range === item.id ? 700 : 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <StatsCard 
          title="Total Spent"
          value={formatCurrency(summary?.totalSpent || 0)}
          subtitle={`Today's spending: ${formatCurrency(summary?.todaySpent || 0)}`}
          icon={Wallet}
          color="var(--primary)"
        />
        <StatsCard 
          title="Remaining Budget"
          value={formatCurrency(Math.max(0, summary?.remainingBudget || 0))}
          subtitle={summary?.totalBudget > 0 ? `Total Limit: ${formatCurrency(summary.totalBudget)}` : 'Set budgets to track'}
          icon={Calendar}
          color={summary?.remainingBudget < 0 ? 'var(--danger)' : 'var(--success)'}
          badge={summary?.remainingBudget < 0 ? 'Over Limit' : 'Available'}
        />
        <StatsCard 
          title="Average Daily Spending"
          value={formatCurrency(summary?.avgDailySpent || 0)}
          subtitle={`Calculated over ${summary?.period?.days || 1} day period`}
          icon={Flame}
          color="var(--warning)"
        />
        <StatsCard 
          title="Top Spending Category"
          value={summary?.topCategory?.category || 'None'}
          subtitle={summary?.topCategory?.amount > 0 ? `${formatCurrency(summary.topCategory.amount)} (${summary.topCategory.percentage}% of total)` : 'No expenses recorded'}
          icon={PieChartIcon}
          color="#ec4899"
        />
      </div>

      {/* Spending Overview Line Chart */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Spending Overview</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily spending progression across this month</p>
          </div>
          <Link to="/analytics" style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Full Analytics <ArrowRight size={15} />
          </Link>
        </div>
        <SpendingChart data={trendData} height={260} />
      </div>

      {/* Category Breakdown & Budget Progress Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Category Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Category Breakdown</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: {formatCurrency(summary?.totalSpent || 0)}
            </span>
          </div>

          <CategoryChart data={categories} height={220} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {categories.slice(0, 4).map((cat) => (
              <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formatCurrency(cat.amount)} ({cat.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Budget Progress</h3>
            <Link to="/budgets" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Manage Budgets
            </Link>
          </div>

          {budgets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '12px' }}>No budgets set for this month.</p>
              <Link to="/budgets" className="btn btn-secondary btn-sm">
                + Create Budget
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {budgets.slice(0, 4).map((b) => (
                <div key={b.id || b.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{b.category}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {formatCurrency(b.spent)} / {formatCurrency(b.amount)} ({b.percent}%)
                    </span>
                  </div>
                  <div className="progress-container" style={{ margin: 0 }}>
                    <div 
                      className={`progress-bar progress-${b.status}`} 
                      style={{ width: `${Math.min(100, b.percent)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Smart Suggestions Snippet */}
      {suggestions.length > 0 && (
        <div className="card" style={{ marginBottom: '28px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                <Lightbulb size={18} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Smart Suggestions for You</h3>
            </div>
            <Link to="/suggestions" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              View All Tips
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {suggestions.slice(0, 2).map((sug) => (
              <div key={sug.id} style={{ backgroundColor: '#111827', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{sug.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{sug.title}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {sug.message}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#818cf8', fontWeight: 500 }}>
                  💡 {sug.actionTip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Expenses List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Expenses</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your latest transactions</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/expenses" className="btn btn-secondary btn-sm">
              View All
            </Link>
            <Link to="/add-expense" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Add Expense
            </Link>
          </div>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🎉</span>
            <h4 className="empty-state-title">No expenses yet</h4>
            <p className="empty-state-desc">
              Start tracking your first expense and we'll help you understand your spending habits.
            </p>
            <Link to="/add-expense" className="btn btn-primary" style={{ marginTop: '8px' }}>
              <PlusCircle size={18} /> Add Your First Expense
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentExpenses.map((exp) => (
              <ExpenseCard 
                key={exp.id} 
                expense={exp} 
                onDelete={(e) => setDeleteModal({ isOpen: true, expense: e })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expense: null })}
        title="Delete this expense?"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{deleteModal.expense?.title}"</strong> (₹{deleteModal.expense?.amount})? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={() => setDeleteModal({ isOpen: false, expense: null })}
            className="btn btn-secondary"
            disabled={actionLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteConfirm}
            className="btn btn-danger"
            disabled={actionLoading}
          >
            {actionLoading ? 'Deleting...' : 'Delete Expense'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
