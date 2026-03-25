import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <div className="logo-circle">
          <img src="/logo.png" alt="SafarAI" className="logo-img" />
        </div>
        <span className="logo-text">Safar<span style={{color: 'var(--accent)'}}>AI</span></span>
      </div>
      
      <div className="navbar-search">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search destinations, trips..." />
        </div>
      </div>

      <div className="navbar-actions">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <Link to="/profile" className="icon-button profile-btn">
          <User size={20} />
        </Link>
      </div>
    </nav>
  );
}
