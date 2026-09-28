import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import { 
  Lightbulb, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Info,
  Layers,
  PiggyBank
} from 'lucide-react';

const Suggestions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getSuggestions();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  const { suggestions = [], healthIndicators = {} } = data || {};

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Lightbulb size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Smart Suggestions</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Actionable insights derived directly from your spending activity.
            </p>
          </div>
        </div>
      </div>

      {/* Spending Health Indicators Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="var(--primary)" />
          Spending Health Indicators
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          {/* 1. Budget Usage */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Budget Usage</span>
              <span className={`badge badge-${healthIndicators.budgetUsage?.status || 'safe'}`}>
                {healthIndicators.budgetUsage?.label}
              </span>
            </div>
            <div className="progress-container" style={{ margin: '8px 0' }}>
              <div 
                className={`progress-bar progress-${healthIndicators.budgetUsage?.status || 'safe'}`} 
                style={{ width: `${healthIndicators.budgetUsage?.score || 85}%` }} 
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {healthIndicators.budgetUsage?.detail}
            </p>
          </div>

          {/* 2. Savings Potential */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Savings Potential</span>
              <span className={`badge badge-${healthIndicators.savingsPotential?.status || 'safe'}`}>
                {healthIndicators.savingsPotential?.label}
              </span>
            </div>
            <div className="progress-container" style={{ margin: '8px 0' }}>
              <div 
                className={`progress-bar progress-${healthIndicators.savingsPotential?.status || 'safe'}`} 
                style={{ width: `${healthIndicators.savingsPotential?.score || 75}%` }} 
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {healthIndicators.savingsPotential?.detail}
            </p>
          </div>

          {/* 3. Spending Consistency */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Consistency</span>
              <span className="badge badge-safe">
                {healthIndicators.consistency?.label}
              </span>
            </div>
            <div className="progress-container" style={{ margin: '8px 0' }}>
              <div 
                className="progress-bar progress-safe" 
                style={{ width: `${healthIndicators.consistency?.score || 80}%` }} 
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {healthIndicators.consistency?.detail}
            </p>
          </div>

          {/* 4. Category Concentration */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Concentration</span>
              <span className={`badge badge-${healthIndicators.concentration?.status || 'safe'}`}>
                {healthIndicators.concentration?.label}
              </span>
            </div>
            <div className="progress-container" style={{ margin: '8px 0' }}>
              <div 
                className={`progress-bar progress-${healthIndicators.concentration?.status || 'safe'}`} 
                style={{ width: `${healthIndicators.concentration?.score || 85}%` }} 
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {healthIndicators.concentration?.detail}
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Suggestions List */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--primary)" />
          Personalized Recommendations ({suggestions.length})
        </h3>

        {suggestions.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-state-icon">✨</span>
            <h4 className="empty-state-title">Great spending discipline!</h4>
            <p className="empty-state-desc">
              No anomalies, budget warnings or excessive spikes detected in your current expenses.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {suggestions.map((sug) => {
              const borderColors = {
                danger: 'var(--danger)',
                warning: 'var(--warning)',
                success: 'var(--success)',
                info: 'var(--primary)'
              };

              return (
                <div 
                  key={sug.id}
                  className="card"
                  style={{ 
                    borderLeft: `4px solid ${borderColors[sug.severity] || 'var(--primary)'}`,
                    padding: '22px 24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{sug.icon}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sug.title}</h4>
                    </div>
                    <span className={`badge badge-${sug.severity === 'danger' ? 'exceeded' : sug.severity === 'warning' ? 'warning' : 'safe'}`}>
                      {sug.category}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '14px', lineHeight: 1.6 }}>
                    {sug.message}
                  </p>

                  <div style={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    <span style={{ fontSize: '0.88rem', color: '#c7d2fe', fontWeight: 500 }}>
                      <strong style={{ color: '#ffffff' }}>Action Tip:</strong> {sug.actionTip}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transparent Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 18px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>{healthIndicators.disclaimer || 'These indicators and tips are rule-based recommendations calculated strictly from your recorded expenses for educational money-habits training.'}</span>
      </div>
    </div>
  );
};

export default Suggestions;
