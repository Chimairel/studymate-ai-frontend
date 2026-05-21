"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, user, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('College Student');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab with search params
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'register' || tabParam === 'login') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      router.push('/dashboard');
    } catch (err: any) {
      const responseData = err?.response?.data;
      let errorMessage = responseData?.message || 'Invalid email or password. Please try again.';
      
      if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        errorMessage = responseData.errors.map((e: any) => e.message).join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !registerEmail || !registerPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (registerPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signup({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        role
      });
      router.push('/dashboard');
    } catch (err: any) {
      const responseData = err?.response?.data;
      let errorMessage = responseData?.message || 'Failed to create account. Email may already be taken.';
      
      // Extract detailed Zod validation errors if present
      if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        errorMessage = responseData.errors.map((e: any) => e.message).join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="page-auth" className="page active" style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <div style={{ position: 'absolute', top: '20px', left: '24px' }}>
        <Link href="/" className="btn btn-ghost btn-sm">← Back to Home</Link>
      </div>

      <div className="auth-container">
        {/* Left Testimonial Panel */}
        <div className="auth-left">
          <div>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>✍️</div>
            <h2 className="auth-left-title">Write with <em>confidence.</em><br />Edit with clarity.</h2>
            <p className="auth-left-desc">EssayMind coaches you through every sentence — so you learn while you write, not after.</p>
            
            <div className="auth-testimonial">
              <p>"My argumentative essays went from a C to an A in just 3 weeks of using EssayMind. The AI coach is actually helpful, not just generic tips."</p>
              <div className="attr">— Maria L., 3rd Year BS Communications</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(200,192,176,0.5)' }}>© 2026 EssayMind. All rights reserved.</div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right">
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(null); }}
            >
              Log In
            </div>
            <div 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(null); }}
            >
              Create Account
            </div>
          </div>

          {error && (
            <div style={{ 
              background: 'var(--accent-light)', 
              color: 'var(--accent)', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              marginBottom: '18px',
              borderLeft: '3px solid var(--accent)'
            }}>
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} id="auth-login">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="you@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="flex-between mt-6" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent)' }} /> Remember me
                </label>
                <a href="#" style={{ fontSize: '13px', color: 'var(--accent)' }} onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Log In to EssayMind →'}
              </button>
              
              <div className="auth-divider">or continue with</div>
              
              <button 
                type="button" 
                className="btn btn-outline auth-submit" 
                style={{ marginTop: 0 }}
                onClick={() => {
                  setError('OAuth is disabled in this environment. Please use email and password.');
                }}
              >
                <img src="https://www.google.com/favicon.ico" style={{ width: '14px', height: '14px', marginRight: '4px' }} alt="Google icon" /> 
                Continue with Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} id="auth-register">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Dela Cruz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="you@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Create a strong password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={isSubmitting}
                  minLength={8}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">I am a...</label>
                <select 
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="High School Student">High School Student</option>
                  <option value="College Student">College Student</option>
                  <option value="Graduate Student">Graduate Student</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create My Account →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
