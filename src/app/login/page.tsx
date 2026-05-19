"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <>
      {/* Decorative blurred background blobs - kept strictly as a background layer */}
      <div className="mesh-bg-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Interactive UI - device-frame layout */}
      <div className="app-container">
        <div className="device-frame">
          <div className="auth-card">
          {/* Left Pane: Brand column with 3D illustration and copywriting */}
          <div className="illustration-pane">
            <div className="pane-mesh-overlay"></div>
            <div className="illustration-content">
              <div className="illustration-badge">Secure Access</div>
              <h2 className="illustration-heading">Welcome to Messimo</h2>
              <p className="illustration-description">
                Experience secure, seamless, and lightning-fast authentication designed for modern web applications.
              </p>
            </div>
            <Image 
              src="/auth_illustration.png" 
              alt="3D Auth Illustration" 
              className="illustration-img"
              width={500}
              height={500}
              priority
            />
          </div>

          {/* Right Pane: Login Form */}
          <div className="form-pane">
            <div className="logo-container">
              <div className="logo-icon"></div>
              <span className="logo-text">messimo</span>
            </div>

            <h1 className="form-title">Log in</h1>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email input */}
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="form-input with-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : "Log in"}
              </button>
            </form>

            <p className="legal-text">
              By logging in you agree to Messimo's<br />
              <a href="#" className="legal-link">Terms of Services</a> and <a href="#" className="legal-link">Privacy Policy</a>.
            </p>

            <p className="switch-auth-text">
              Don't have an account? 
              <Link href="/signup" className="switch-auth-link">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
