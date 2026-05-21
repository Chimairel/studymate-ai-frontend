"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: '⊞', href: '/dashboard' },
    { label: 'My Essays', icon: '📄', href: '/dashboard/essays' },
    { label: 'New Essay', icon: '✏️', href: '/dashboard/editor' },
    { label: 'Progress', icon: '📈', href: '/dashboard/progress' },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✍</div>
        <span className="logo-text">EssayMind</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span className="nav-icon">{item.icon}</span> {item.label}
            </Link>
          );
        })}
        <div className="nav-section-label" style={{ marginTop: '8px' }}>Account</div>
        <Link 
          href="/dashboard/profile" 
          className={`nav-item ${pathname === '/dashboard/profile' ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <span className="nav-icon">👤</span> Profile
        </Link>
        <a 
          href="#" 
          onClick={handleLogout} 
          className="nav-item"
          style={{ textDecoration: 'none' }}
        >
          <span className="nav-icon">↩</span> Log Out
        </a>
      </nav>
      <div className="sidebar-footer">
        <div className="avatar-sm">
          {getInitials(user?.name)}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'Guest User'}</div>
          <div className="user-role">{user?.role || 'Member'}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
