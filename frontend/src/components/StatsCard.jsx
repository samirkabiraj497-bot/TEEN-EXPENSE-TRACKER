import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'var(--primary)', badge }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: 'var(--radius-md)', 
              background: `rgba(${color === 'var(--primary)' ? '99, 102, 241' : color === 'var(--success)' ? '16, 185, 129' : '245, 158, 11'}, 0.12)`, 
              color: color, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Icon size={19} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {value}
        </h3>
        {badge && (
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
