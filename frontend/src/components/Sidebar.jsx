import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  User,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Add Expense', path: '/add-expense', icon: PlusCircle },
  { name: 'Budgets', path: '/budgets', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: TrendingUp },
  { name: 'Suggestions', path: '/suggestions', icon: Lightbulb },
  { name: 'Profile', path: '/profile', icon: User },
];

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Teen<span style={{ color: 'var(--primary)' }}>Spend</span>
          </span>
          <span style={{ fontSize: '0.65rem', background: 'var(--primary-light)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
            PRO
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <ShieldCheck size={16} color="var(--success)" />
          <span>Private & Encrypted</span>
        </div>
      </div>
    </aside>
  );
};

export const MobileBottomNav = () => {
  return (
    <div className="mobile-bottom-nav">
      {navItems.filter(i => i.name !== 'Add Expense').map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
