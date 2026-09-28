import React from 'react';
import { formatCurrency } from '../utils/currency';
import { AlertTriangle, AlertCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';

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

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { category, amount, spent = 0, percent = 0, status = 'safe', alertMessage } = budget;
  const emoji = CATEGORY_EMOJIS[category] || '🎯';

  const getStatusBadge = () => {
    switch (status) {
      case 'exceeded':
        return (
          <span className="badge badge-exceeded">
            <AlertCircle size={12} /> Exceeded
          </span>
        );
      case 'near_limit':
        return (
          <span className="badge badge-near_limit">
            <AlertTriangle size={12} /> Near Limit
          </span>
        );
      case 'warning':
        return (
          <span className="badge badge-warning">
            <AlertTriangle size={12} /> Warning
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="badge badge-safe">
            <CheckCircle size={12} /> Safe
          </span>
        );
    }
  };

  const cappedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{category}</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Monthly Budget</span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(spent)}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {' / '}{formatCurrency(amount)}
          </span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: status === 'exceeded' ? 'var(--danger)' : status === 'warning' || status === 'near_limit' ? 'var(--warning)' : 'var(--text-secondary)' }}>
          {percent}%
        </span>
      </div>

      {/* Visual progress bar with accessible status states */}
      <div className="progress-container">
        <div 
          className={`progress-bar progress-${status}`} 
          style={{ width: `${cappedPercent}%` }}
        />
      </div>

      {alertMessage && (
        <div style={{
          backgroundColor: status === 'exceeded' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          borderLeft: `3px solid ${status === 'exceeded' ? 'var(--danger)' : 'var(--warning)'}`,
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: status === 'exceeded' ? '#fca5a5' : '#fde047'
        }}>
          {alertMessage}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        {onEdit && (
          <button 
            onClick={() => onEdit(budget)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <Edit2 size={13} /> Edit
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => onDelete(budget)}
            className="btn btn-danger btn-sm"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
