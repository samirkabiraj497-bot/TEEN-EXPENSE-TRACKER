import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Edit2, Trash2, CreditCard } from 'lucide-react';

const CATEGORY_EMOJIS = {
  Food: '🍔',
  Transport: '🚌',
  Education: '📚',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Gaming: '🎮',
  Subscriptions: '📱',
  'Mobile/Data': '📶',
  Sports: '⚽',
  Travel: '✈️',
  'Personal Care': '✨',
  Gifts: '🎁',
  Other: '💳'
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const emoji = CATEGORY_EMOJIS[expense.category] || '💳';

  return (
    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: 'var(--radius-md)', 
          backgroundColor: '#111827', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0
        }}>
          {emoji}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {expense.title}
            </h4>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
              {expense.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{formatDate(expense.expense_date)}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CreditCard size={12} /> {expense.payment_method || 'UPI'}
            </span>
            {expense.description && (
              <>
                <span>•</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {expense.description}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {formatCurrency(expense.amount)}
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          {onEdit && (
            <button 
              onClick={() => onEdit(expense)}
              className="btn btn-secondary btn-sm"
              title="Edit expense"
              style={{ padding: '6px 8px' }}
            >
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(expense)}
              className="btn btn-danger btn-sm"
              title="Delete expense"
              style={{ padding: '6px 8px' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
