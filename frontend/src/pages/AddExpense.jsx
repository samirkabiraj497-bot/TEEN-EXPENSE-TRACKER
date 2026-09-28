import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

const QUICK_TAGS = [
  { title: 'Pizza with friends', amount: 250, category: 'Food', method: 'UPI' },
  { title: 'Bus/Metro pass', amount: 80, category: 'Transport', method: 'Cash' },
  { title: 'Mobile 5G Data Pack', amount: 199, category: 'Mobile/Data', method: 'UPI' },
  { title: 'Steam Video Game', amount: 450, category: 'Gaming', method: 'Debit Card' },
  { title: 'Stationery & Pens', amount: 120, category: 'Education', method: 'Cash' },
  { title: 'Movie Ticket', amount: 300, category: 'Entertainment', method: 'UPI' }
];

const AddExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedQuickTag, setSelectedQuickTag] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await expenseService.createExpense(formData);
      setSuccessMsg('Expense added successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      console.error('Failed to create expense:', err);
      alert(err.response?.data?.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '720px' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Add New Expense</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
          Record where your money went in seconds.
        </p>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: 'var(--success-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Teen Templates */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Quick Presets
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {QUICK_TAGS.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedQuickTag({ ...tag, key: Date.now() })}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.82rem', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}
            >
              {tag.title} (₹{tag.amount})
            </button>
          ))}
        </div>
      </div>

      {/* Main Expense Form */}
      <div className="card" style={{ padding: '28px' }}>
        <ExpenseForm 
          key={selectedQuickTag?.key || 'new-expense-form'}
          initialData={selectedQuickTag || {}}
          onSubmit={handleSubmit}
          submitLabel="Save & Log Expense"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddExpense;
