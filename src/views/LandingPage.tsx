"use client";

import React from 'react';
import Link from 'next/link';
import Badge from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div id="page-landing" className="page active">
      {/* Landing Navbar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--accent)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
          }}>
            ✍
          </div>
          Study<span className="logo-dot">Mate</span>
        </div>
        <div className="landing-nav-links">
          <a className="btn btn-ghost" href="#features">Features</a>
          <Link className="btn btn-outline btn-sm" href="/auth?tab=login">Log In</Link>
          <Link className="btn btn-primary btn-sm" href="/auth?tab=register">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div>
          <div className="hero-eyebrow">✦ AI-Powered Writing Coach</div>
          <h1 className="hero-title">Write essays that actually <em>matter.</em></h1>
          <p className="hero-desc">
            StudyMate gives you real-time feedback on structure, argumentation, clarity, and
            grammar — like having a writing coach read over your shoulder, without the judgment.
          </p>
          <div className="hero-cta">
            <Link 
              className="btn btn-primary" 
              href="/auth?tab=register"
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              Start Writing Free
            </Link>
            <Link 
              className="btn btn-outline" 
              href="/auth?tab=login"
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              See How It Works
            </Link>
          </div>
          <p className="hero-note" style={{ marginTop: '14px' }}>No credit card. No install. Works in your browser.</p>
        </div>

        {/* Demo Visual */}
        <div className="hero-visual">
          <div className="hero-visual-header">
            <div className="dot dot-red"></div>
            <div className="dot dot-yellow"></div>
            <div className="dot dot-green"></div>
            <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px' }}>Essay Editor</span>
          </div>
          <div className="mock-textarea">
            Climate change is a big problem. <span className="highlight">Many scientists says</span> it will affect
            everyone. We need to do something about this because <span className="highlight">its</span> getting
            worse every year...
          </div>
          <div className="coach-feedback">
            <div className="coach-label">✦ AI Coach Feedback</div>
            <p>
              Your opening paragraph states the topic but lacks a <strong>hook</strong> and a clear thesis. Try
              leading with a specific statistic or scenario to immediately engage the reader.
            </p>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <Badge variant="red">2 Grammar</Badge>
            <Badge variant="blue">1 Structure</Badge>
            <Badge variant="gold">Clarity: 72%</Badge>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="features-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-label">What We Offer</div>
          <div className="section-title">Everything your essays need to excel.</div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI Writing Coach</h3>
              <p>Get contextual, paragraph-level feedback on your arguments, transitions, and voice — not just spellcheck.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Score & Analytics</h3>
              <p>Understand your writing strengths with detailed scoring across structure, grammar, clarity, and depth.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Coach Chat</h3>
              <p>Ask questions about your essay in real-time. Your AI coach explains its feedback and helps you revise.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Progress Tracking</h3>
              <p>See how your writing improves over time with visual score history and achievement milestones.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Essay Library</h3>
              <p>All your essays saved in one place — with version history, score snapshots, and coach notes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Essay Type Modes</h3>
              <p>Argumentative, expository, narrative, analytical — the AI adapts its coaching style to your essay's goal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'white', marginBottom: '8px' }}>
          StudyMate
        </div>
        AI Writing & Essay Coach · Built for students who want to grow.
      </footer>
    </div>
  );
};

export default LandingPage;
