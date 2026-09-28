import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import BudgetCard from '../components/BudgetCard';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/currency';
import { getCurrentMonthAndYear, getMonthName } from '../utils/date';
import { Target, PlusCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Education', 'Entertainment', 'Shopping', 'Gaming', 'Subscriptions', 'Mobile/Data', 'Sports', 'Travel', 'Personal Care', 'Gifts', 'Other'];

const Budgets = () => {
  const current = getCurrentMonthAndYear();
  const [month, setMonth] = useState(current.month);
  const [year, setYear] = useState(current.year);
  const [budgets, setBudgets] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, budget: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, budget: null });

  // Form states
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: ''
  });
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgets({ month, year });
      if (res.success && res.data) {
        setBudgets(res.data.budgets || []);
        setTotalBudget(res.data.totalBudget || 0);
        setTotalSpent(res.data.totalSpentOnBudgets || 0);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid budget amount greater than 0.');
      return;
    }

    try {
      setActionLoading(true);
      await budgetService.createBudget({
        category: formData.category,
        amount: numAmount,
        month,
        year
      });
      setAddModalOpen(false);
      setFormData({ category: 'Food', amount: '' });
      fetchBudgets();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create budget.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal.budget) return;
    setFormError('');

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid amount.');
      return;
    }

    try {
      setActionLoading(true);
      await budgetService.updateBudget(editModal.budget.id, {
        category: formData.category,
        amount: numAmount
      });
      setEditModal({ isOpen: false, budget: null });
      fetchBudgets();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update budget.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.budget) return;
    try {
      setActionLoading(true);
      await budgetService.deleteBudget(deleteModal.budget.id);
      setDeleteModal({ isOpen: false, budget: null });
      fetchBudgets();
    } catch (err) {
      console.error('Failed to delete budget:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount
    });
    setFormError('');
    setEditModal({ isOpen: true, budget });
  };

  const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Monthly Budgets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Set category spending targets and avoid overspending.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Month selector */}
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>

          <button 
            onClick={() => { setFormData({ category: 'Food', amount: '' }); setFormError(''); setAddModalOpen(true); }}
            className="btn btn-primary"
          >
            <PlusCircle size={17} />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {getMonthName(month)} {year} Combined Budget
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
                {formatCurrency(totalSpent)}
              </h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                / {formatCurrency(totalBudget)}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: overallPercent > 100 ? 'var(--danger)' : overallPercent >= 80 ? 'var(--warning)' : 'var(--success)' }}>
              {overallPercent}%
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {totalBudget > totalSpent ? `${formatCurrency(totalBudget - totalSpent)} remaining` : `Exceeded by ${formatCurrency(totalSpent - totalBudget)}`}
            </p>
          </div>
        </div>

        <div className="progress-container" style={{ height: '12px' }}>
          <div 
            className={`progress-bar progress-${overallPercent > 100 ? 'exceeded' : overallPercent >= 80 ? 'warning' : 'safe'}`}
            style={{ width: `${Math.min(100, overallPercent)}%` }}
          />
        </div>
      </div>

      {/* Budgets Grid */}
      {loading ? (
        <div className="loader-spinner"></div>
      ) : budgets.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-state-icon">🎯</span>
          <h4 className="empty-state-title">No category budgets set yet</h4>
          <p className="empty-state-desc">
            Allocating budgets helps you track your limits on food, shopping, games, and transit!
          </p>
          <button 
            onClick={() => { setFormData({ category: 'Food', amount: '' }); setFormError(''); setAddModalOpen(true); }}
            className="btn btn-primary"
            style={{ marginTop: '8px' }}
          >
            <PlusCircle size={18} /> Set Your First Budget
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {budgets.map((b) => (
            <BudgetCard 
              key={b.id} 
              budget={b} 
              onEdit={openEditModal}
              onDelete={(budget) => setDeleteModal({ isOpen: true, budget })}
            />
          ))}
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={`Set Budget for ${getMonthName(month)} ${year}`}
      >
        <form onSubmit={handleCreateSubmit}>
          {formError && (
            <div style={{ backgroundColor: 'var(--danger-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.85rem', marginBottom: '14px' }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="budget-category">Category</label>
            <select 
              id="budget-category"
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="budget-amount">Monthly Budget Limit (₹)</label>
            <input 
              id="budget-amount"
              type="number"
              step="any"
              className="form-input"
              placeholder="e.g. 2500"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={actionLoading}
            style={{ width: '100%', padding: '12px' }}
          >
            {actionLoading ? 'Saving...' : 'Set Budget'}
          </button>
        </form>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, budget: null })}
        title={`Edit ${editModal.budget?.category} Budget`}
      >
        <form onSubmit={handleEditSubmit}>
          {formError && (
            <div style={{ backgroundColor: 'var(--danger-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.85rem', marginBottom: '14px' }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Category</label>
            <input 
              type="text"
              className="form-input"
              value={formData.category}
              disabled
              style={{ opacity: 0.7 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-budget-amount">New Monthly Limit (₹)</label>
            <input 
              id="edit-budget-amount"
              type="number"
              step="any"
              className="form-input"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={actionLoading}
            style={{ width: '100%', padding: '12px' }}
          >
            {actionLoading ? 'Updating...' : 'Update Budget'}
          </button>
        </form>
      </Modal>

      {/* Delete Budget Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, budget: null })}
        title="Delete this budget?"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Are you sure you want to remove the monthly budget for <strong style={{ color: 'var(--text-primary)' }}>{deleteModal.budget?.category}</strong>?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={() => setDeleteModal({ isOpen: false, budget: null })}
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
            {actionLoading ? 'Deleting...' : 'Delete Budget'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Budgets;
