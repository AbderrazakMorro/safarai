import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Plane, Heart, Settings, Backpack } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/destinations', icon: <Map size={20} />, label: 'Destinations' },
    { path: '/trips', icon: <Plane size={20} />, label: 'Trips' },
    { path: '/backpack', icon: <Backpack size={20} />, label: 'Backpack' },
    { path: '/favorites', icon: <Heart size={20} />, label: 'Favorites' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar glass">
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="ai-status">
          <div className="status-dot pulsing"></div>
          <span>AI Assistant Active</span>
        </div>
      </div>
    </aside>
  );
}
