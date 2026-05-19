"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, User } from 'lucide-react';

export default function Dashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get initials for avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  if (isLoading || !token) {
    return (
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <header className="nav-header">
        <div className="logo">
          <ShieldCheck size={28} color="var(--accent-primary)" />
          <span>AuthFlow</span>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-card" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <div className="avatar">
            {getInitials(user?.name, user?.email)}
          </div>
          <h1>Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}!</h1>
          <p className="subtitle" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '2.5rem' }}>
            You have successfully authenticated into your secure dashboard.
          </p>
          
          <div style={{ 
            background: 'var(--input-bg)', 
            padding: '2rem', 
            borderRadius: '16px', 
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--accent-primary)" />
              Profile Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>User ID</span>
                <p style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', marginTop: '0.25rem' }}>
                  {user?.id || 'id_not_provided_by_api'}
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email Address</span>
                <p style={{ fontWeight: '500', marginTop: '0.25rem' }}>{user?.email}</p>
              </div>
              {user?.name && (
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Full Name</span>
                  <p style={{ fontWeight: '500', marginTop: '0.25rem' }}>{user.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
