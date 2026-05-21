"use client";

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEssay } from '../../hooks/useEssay';
import Toggle from '../../components/ui/Toggle';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { essays } = useEssay();

  // Initial Form State
  const initialFirstName = user?.firstName || user?.name?.split(' ')[0] || '';
  const initialLastName = user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'College Student');
  const [bio, setBio] = useState(user?.bio || '3rd year BS Computer Science student who loves writing about tech and society.');

  // Preference State
  const [realTimeFeedback, setRealTimeFeedback] = useState(
    user?.preferences?.realTimeFeedback ?? true
  );
  const [grammarHighlights, setGrammarHighlights] = useState(
    user?.preferences?.grammarHighlights ?? true
  );
  const [weeklyReport, setWeeklyReport] = useState(
    user?.preferences?.weeklyReport ?? false
  );
  const [darkMode, setDarkMode] = useState(
    user?.preferences?.darkMode ?? false
  );
  const [defaultEssayMode, setDefaultEssayMode] = useState(
    user?.preferences?.defaultEssayMode || 'Argumentative'
  );

  // Status Notification
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Calculate dynamic stats
  const totalEssays = essays.length;
  const gradedEssays = essays.filter(e => e.score > 0);
  const avgScore = gradedEssays.length > 0 
    ? Math.round(gradedEssays.reduce((sum, e) => sum + e.score, 0) / gradedEssays.length)
    : 78; // Default mock average if none written yet, mirroring index.html default
  
  const totalWords = essays.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const wordsFormatted = totalWords >= 1000 
    ? (totalWords / 1000).toFixed(1) + 'k' 
    : totalWords > 0 ? totalWords.toString() : '14k'; // default mock words if none written, mirroring index.html

  const handleSaveChanges = () => {
    try {
      const updatedData = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim() || user?.name || 'User',
        email,
        role,
        bio,
        preferences: {
          realTimeFeedback,
          grammarHighlights,
          weeklyReport,
          darkMode,
          defaultEssayMode
        }
      };

      updateUser(updatedData);

      // Handle dark mode side effects if needed (applying class to document)
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setStatusMessage({ type: 'success', text: 'Profile changes saved successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Failed to update profile settings.' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const getAvatarChar = () => {
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account and preferences.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      <div className="content-body">
        {statusMessage && (
          <div 
            className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              background: statusMessage.type === 'success' ? 'var(--green-light)' : 'var(--accent-light)',
              color: statusMessage.type === 'success' ? 'var(--green)' : 'var(--accent)',
              border: `1px solid ${statusMessage.type === 'success' ? 'var(--green)' : 'var(--accent)'}`,
              transition: 'opacity 0.3s ease'
            }}
          >
            {statusMessage.type === 'success' ? '✓' : '✗'} {statusMessage.text}
          </div>
        )}

        <div className="profile-header-card">
          <div className="profile-avatar">{getAvatarChar()}</div>
          <div>
            <div className="profile-name">{firstName || lastName ? `${firstName} ${lastName}`.trim() : (user?.name || 'User')}</div>
            <div className="profile-email">{email || user?.email || 'user@example.com'}</div>
            <div className="profile-badges">
              <div className="profile-badge">{role}</div>
              <div className="profile-badge">🔥 {totalEssays > 0 ? '5-Day Streak' : '0-Day Streak'}</div>
              <div className="profile-badge">Member since Jan 2025</div>
            </div>
          </div>
          <div className="profile-stats">
            <div>
              <div className="profile-stat-val">{totalEssays > 0 ? totalEssays : 12}</div>
              <div className="profile-stat-label">Essays</div>
            </div>
            <div>
              <div className="profile-stat-val">{avgScore}</div>
              <div className="profile-stat-label">Avg Score</div>
            </div>
            <div>
              <div className="profile-stat-val">{wordsFormatted}</div>
              <div className="profile-stat-label">Words</div>
            </div>
          </div>
        </div>

        <div className="grid-equal">
          <div className="card card-padded">
            <div className="settings-title">Personal Information</div>
            <div className="form-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Role</label>
              <select 
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="High School Student">High School Student</option>
                <option value="College Student">College Student</option>
                <option value="Graduate Student">Graduate Student</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea 
                className="form-input" 
                rows={3}
                style={{ resize: 'none' }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="card card-padded">
            <div className="settings-title">Preferences</div>
            <div className="settings-section">
              <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div className="settings-row-label">Real-time Feedback</div>
                  <div className="settings-row-desc">Get suggestions as you type</div>
                </div>
                <Toggle checked={realTimeFeedback} onChange={setRealTimeFeedback} />
              </div>
              
              <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div className="settings-row-label">Grammar Highlights</div>
                  <div className="settings-row-desc">Underline grammar issues in editor</div>
                </div>
                <Toggle checked={grammarHighlights} onChange={setGrammarHighlights} />
              </div>

              <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div className="settings-row-label">Weekly Report</div>
                  <div className="settings-row-desc">Email summary of your progress</div>
                </div>
                <Toggle checked={weeklyReport} onChange={setWeeklyReport} />
              </div>

              <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div className="settings-row-label">Dark Mode</div>
                  <div className="settings-row-desc">Switch to dark theme</div>
                </div>
                <Toggle checked={darkMode} onChange={setDarkMode} />
              </div>
            </div>
            
            <div className="settings-title" style={{ marginTop: '24px', marginBottom: '12px' }}>Default Essay Mode</div>
            <select 
              className="form-input" 
              value={defaultEssayMode} 
              onChange={(e) => setDefaultEssayMode(e.target.value)}
            >
              <option value="Argumentative">Argumentative</option>
              <option value="Expository">Expository</option>
              <option value="Analytical">Analytical</option>
              <option value="Narrative">Narrative</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
