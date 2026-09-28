import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import Modal from '../components/Modal';
import { PlusCircle, Search, Filter, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Education', 'Entertainment', 'Shopping', 'Gaming', 'Subscriptions', 'Mobile/Data', 'Sports', 'Travel', 'Personal Care', 'Gifts', 'Other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [editModal, setEditModal] = useState({ isOpen: false, expense: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, expense: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseService.getExpenses({
        category: category !== 'All' ? category : undefined,
        search: search || undefined,
        sort,
        from: fromDate || undefined,
        to: toDate || undefined,
        limit: 100
      });

      if (res.success && res.data) {
        setExpenses(res.data.expenses);
        setTotalCount(res.data.pagination.totalCount);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, sort, fromDate, toDate]);

  const handleEditSubmit = async (formData) => {
    if (!editModal.expense) return;
    try {
      setActionLoading(true);
      await expenseService.updateExpense(editModal.expense.id, formData);
      setEditModal({ isOpen: false, expense: null });
      fetchExpenses();
    } catch (err) {
      console.error('Failed to update expense:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.expense) return;
    try {
      setActionLoading(true);
      await expenseService.deleteExpense(deleteModal.expense.id);
      setDeleteModal({ isOpen: false, expense: null });
      fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>All Expenses</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Showing {expenses.length} of {totalCount} tracked transactions
          </p>
        </div>

        <Link to="/add-expense" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </Link>
      </div>

      {/* Filters and Controls Card */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by title or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select 
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>

          {/* Sort dropdown */}
          <select 
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest">Sort: Highest Amount</option>
            <option value="lowest">Sort: Lowest Amount</option>
          </select>

          {/* Date range */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="date"
              className="form-input"
              placeholder="From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input 
              type="date"
              className="form-input"
              placeholder="To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {loading ? (
        <div className="loader-spinner"></div>
      ) : expenses.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-state-icon">🔍</span>
          <h4 className="empty-state-title">No matching expenses found</h4>
          <p className="empty-state-desc">
            Try adjusting your search query, category filter or date range.
          </p>
          <button 
            onClick={() => { setSearch(''); setCategory('All'); setFromDate(''); setToDate(''); }}
            className="btn btn-secondary"
            style={{ marginTop: '8px' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {expenses.map((exp) => (
            <ExpenseCard 
              key={exp.id} 
              expense={exp} 
              onEdit={(e) => setEditModal({ isOpen: true, expense: e })}
              onDelete={(e) => setDeleteModal({ isOpen: true, expense: e })}
            />
          ))}
        </div>
      )}

      {/* Edit Expense Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, expense: null })}
        title="Edit Expense"
      >
        {editModal.expense && (
          <ExpenseForm 
            initialData={editModal.expense}
            onSubmit={handleEditSubmit}
            submitLabel="Update Expense"
            loading={actionLoading}
          />
        )}
      </Modal>

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

export default Expenses;
