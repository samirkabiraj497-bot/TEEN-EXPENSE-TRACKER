import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Sparkles, User, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-logo-icon">
          <Sparkles size={20} />
        </div>
        <span>TeenSpend</span>
      </Link>

      <div className="navbar-user-section">
        <Link to="/add-expense" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PlusCircle size={16} />
          <span>Add Expense</span>
        </Link>

        {user && (
          <Link to="/profile" className="user-badge" style={{ textDecoration: 'none' }}>
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {user.name.split(' ')[0]}
            </span>
          </Link>
        )}

        <button 
          onClick={handleLogout} 
          className="btn btn-secondary btn-sm"
          title="Sign out"
          style={{ padding: '8px 12px' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
