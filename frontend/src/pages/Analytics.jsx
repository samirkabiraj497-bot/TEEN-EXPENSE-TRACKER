import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import SpendingChart from '../components/SpendingChart';
import { formatCurrency } from '../utils/currency';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  Activity,
  Layers
} from 'lucide-react';

const CATEGORY_COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#3b82f6'];

const Analytics = () => {
  const [range, setRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [pastSixMonths, setPastSixMonths] = useState([]);
  const [comparison, setComparison] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, catRes, trendRes, compRes] = await Promise.all([
        analyticsService.getSummary({ range }),
        analyticsService.getCategoryBreakdown({ range }),
        analyticsService.getMonthlyTrend(),
        analyticsService.getComparison()
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (catRes.success) setCategories(catRes.data.categories);
      if (trendRes.success) {
        setTrendData(trendRes.data.currentMonthDays);
        setPastSixMonths(trendRes.data.pastSixMonths);
      }
      if (compRes.success) setComparison(compRes.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  if (loading && !summary) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Spending Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Deep dive into your financial habits and trends.
          </p>
        </div>

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

      {/* Month-over-Month Comparison Card */}
      {comparison && (
        <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(145deg, #182235, #121a29)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: comparison.difference.increased ? 'var(--danger-bg)' : 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {comparison.difference.increased ? (
                <ArrowUpRight size={20} color="var(--danger)" />
              ) : (
                <ArrowDownRight size={20} color="var(--success)" />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Month-to-Month Comparison</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {comparison.currentMonth.name} vs {comparison.previousMonth.name}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
            <div style={{ padding: '14px 18px', backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This Month's Spending</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
                {formatCurrency(comparison.currentMonth.total)}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comparison.currentMonth.count} transactions</span>
            </div>

            <div style={{ padding: '14px 18px', backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last Month's Spending</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
                {formatCurrency(comparison.previousMonth.total)}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comparison.previousMonth.count} transactions</span>
            </div>

            <div style={{ padding: '14px 18px', backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Net Difference</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: comparison.difference.increased ? '#f87171' : '#34d399' }}>
                {comparison.difference.increased ? '+' : '-'}{formatCurrency(comparison.difference.amount)}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {comparison.difference.percentChange}% {comparison.difference.increased ? 'increase' : 'decrease'}
              </span>
            </div>

            <div style={{ padding: '14px 18px', backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Transaction</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
                {formatCurrency(comparison.currentMonth.avgTransaction)}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vs {formatCurrency(comparison.previousMonth.avgTransaction)} last month</span>
            </div>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)' }}>
            ℹ️ {comparison.difference.summary}
          </div>
        </div>
      )}

      {/* Daily Progression Chart */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Current Month Daily Spending</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Daily fluctuations in rupees</p>
        <SpendingChart data={trendData} height={280} />
      </div>

      {/* Category Bar Comparison Chart */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Category Spending Comparison</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>How much money was spent across different categories</p>
        
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No category data available for this range.</div>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Total Spent']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#334155', borderRadius: '10px' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {categories.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 6-Month Macro Trend */}
      {pastSixMonths.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Past 6 Months Overview</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Monthly aggregate spending pattern</p>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pastSixMonths} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="monthName" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Spent']} contentStyle={{ backgroundColor: '#111827', borderColor: '#334155', borderRadius: '10px' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
