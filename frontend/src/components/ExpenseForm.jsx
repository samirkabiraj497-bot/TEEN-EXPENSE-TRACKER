import React, { useState } from 'react';
import { getTodayString } from '../utils/date';

const CATEGORIES = [
  { name: 'Food', emoji: '🍔' },
  { name: 'Transport', emoji: '🚌' },
  { name: 'Education', emoji: '📚' },
  { name: 'Entertainment', emoji: '🎬' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Subscriptions', emoji: '📱' },
  { name: 'Mobile/Data', emoji: '📶' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Travel', emoji: '✈️' },
  { name: 'Personal Care', emoji: '✨' },
  { name: 'Gifts', emoji: '🎁' },
  { name: 'Other', emoji: '💳' }
];

const PAYMENT_METHODS = ['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

const ExpenseForm = ({ initialData = {}, onSubmit, submitLabel = 'Save Expense', loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    amount: initialData.amount || '',
    category: initialData.category || 'Food',
    description: initialData.description || '',
    expense_date: initialData.expense_date ? initialData.expense_date.split('T')[0] : getTodayString(),
    payment_method: initialData.payment_method || 'UPI'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required (e.g. Pizza, Metro, Notebook)';
    }
    const num = parseFloat(formData.amount);
    if (!formData.amount || isNaN(num) || num <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.category) {
      errs.category = 'Please select a category';
    }
    if (!formData.expense_date) {
      errs.expense_date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="expense-title">Expense Title *</label>
        <input 
          id="expense-title"
          name="title"
          type="text"
          className="form-input"
          placeholder="e.g. Pizza with friends, Bus pass, Steam game"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="expense-amount">Amount (₹) *</label>
          <input 
            id="expense-amount"
            name="amount"
            type="number"
            step="any"
            className="form-input"
            placeholder="250"
            value={formData.amount}
            onChange={handleChange}
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-category">Category *</label>
          <select 
            id="expense-category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.name} value={cat.name}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="expense-date">Date *</label>
          <input 
            id="expense-date"
            name="expense_date"
            type="date"
            className="form-input"
            value={formData.expense_date}
            onChange={handleChange}
          />
          {errors.expense_date && <span className="form-error">{errors.expense_date}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-payment">Payment Method</label>
          <select 
            id="expense-payment"
            name="payment_method"
            className="form-select"
            value={formData.payment_method}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="expense-desc">Description (Optional)</label>
        <textarea 
          id="expense-desc"
          name="description"
          rows={3}
          className="form-textarea"
          placeholder="Add any extra notes, tags or friend names..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ExpenseForm;
