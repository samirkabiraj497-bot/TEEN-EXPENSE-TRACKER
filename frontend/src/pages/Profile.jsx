import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/date';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  CheckCircle2,
  DollarSign,
  Lock
} from 'lucide-react';

const Profile = () => {
  const { user, logout, seedDemoData } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  const handleSeed = async () => {
    try {
      setSeeding(true);
      setSeedSuccess('');
      const res = await seedDemoData();
      setSeedSuccess(res.message || 'Demo teen expenses and budgets loaded successfully! Check Dashboard and Analytics.');
    } catch (err) {
      console.error('Failed to load demo data:', err);
      alert('Failed to load demo data.');
    } finally {
      setSeeding(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account & Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Manage your personal profile and application preferences.
        </p>
      </div>

      {seedSuccess && (
        <div style={{
          backgroundColor: 'var(--success-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <CheckCircle2 size={18} />
          <span>{seedSuccess}</span>
        </div>
      )}

      {/* User Card */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'white',
          boxShadow: '0 4px 14px var(--primary-glow)'
        }}>
          {getInitials(user?.name)}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name || 'TeenSpend User'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            <Mail size={15} />
            <span>{user?.email}</span>
          </div>
          {user?.created_at && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              <Calendar size={14} />
              <span>Joined on {formatDate(user.created_at)}</span>
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Demo Data Seeder Card */}
      <div className="card" style={{ marginBottom: '24px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'linear-gradient(135deg, #182235, #141c2c)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Sparkles size={18} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Developer & Portfolio Demo Seeder</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Evaluating or testing TeenSpend? With 1 click, populate 19 realistic teenager expenses (Pizza, Metro, Steam Games, Movie tickets, Subscriptions) and 6 category budgets to instantly experience all charts, progress bars, and suggestions!
        </p>

        <button 
          onClick={handleSeed}
          disabled={seeding}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={16} />
          <span>{seeding ? 'Generating Sample Data...' : 'Load Sample Teen Expenses & Budgets'}</span>
        </button>
      </div>

      {/* Preferences Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>Preferences</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Currency Symbol</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Default display currency</p>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--primary)', padding: '6px 14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)' }}>
            ₹ INR (Indian Rupee)
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Account Security</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passwords are salted & hashed with bcrypt</p>
          </div>
          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
            <Lock size={14} /> Active
          </span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldCheck size={18} color="var(--success)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Data Privacy Notice</h4>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
          TeenSpend is designed with strict data isolation. Every expense and budget record is strictly scoped to your authenticated account ID via JWT tokens and backend authorization checks. No user can view, edit, or access another user’s financial records.
        </p>
      </div>
    </div>
  );
};

export default Profile;
