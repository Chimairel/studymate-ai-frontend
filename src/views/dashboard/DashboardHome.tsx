"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useEssay } from '../../hooks/useEssay';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import ScoreRing from '../../components/ui/ScoreRing';
import EssayListItem from '../../components/essays/EssayListItem';
import Badge from '../../components/ui/Badge';
import Link from 'next/link';

export const DashboardHome: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { essays, setCurrentEssay } = useEssay();

  // Calculate dynamic stats
  const totalEssays = essays.length;
  const gradedEssays = essays.filter(e => e.score > 0);
  const avgScore = gradedEssays.length > 0 
    ? Math.round(gradedEssays.reduce((sum, e) => sum + e.score, 0) / gradedEssays.length)
    : 0;
  
  const totalWords = essays.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const wordsFormatted = totalWords >= 1000 
    ? (totalWords / 1000).toFixed(1) + 'k' 
    : totalWords.toString();

  // Get first graded essay for latest score ring detail
  const latestGradedEssay = essays.find(e => e.score > 0) || essays[0];

  const handleEssayClick = (essay: any) => {
    setCurrentEssay(essay);
    router.push('/dashboard/editor');
  };

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">Good afternoon, {user?.name?.split(' ')[0] || 'User'} ☀️</h1>
          <p className="page-subtitle">
            You have {essays.filter(e => !e.score).length} draft {essays.filter(e => !e.score).length === 1 ? 'essay' : 'essays'} pending AI coach analysis.
          </p>
        </div>
        <Link href="/dashboard/editor" onClick={() => setCurrentEssay(null)} className="btn btn-primary">
          + New Essay
        </Link>
      </div>

      <div className="content-body">
        {/* KPI metrics */}
        <div className="stats-grid">
          <StatCard 
            label="Essays Written" 
            value={totalEssays} 
            changeText="↑ 3 this month" 
            changeType="up" 
          />
          <StatCard 
            label="Avg. Score" 
            value={avgScore || '--'} 
            changeText={avgScore > 0 ? "↑ +6 vs last month" : "No grades yet"} 
            changeType={avgScore > 0 ? "up" : "neutral"} 
          />
          <StatCard 
            label="Words Written" 
            value={wordsFormatted} 
            changeText="This semester" 
            changeType="neutral" 
          />
          <StatCard 
            label="Coach Sessions" 
            value={totalEssays > 0 ? totalEssays * 3 + 2 : 0} 
            changeText="Active learner ✦" 
            changeType="up" 
          />
        </div>

        {/* Recent Essays & Latest Score */}
        <div className="grid-2">
          {/* Recent Essays */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Essays</Card.Title>
              <Link href="/dashboard/essays" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                View All
              </Link>
            </Card.Header>
            <Card.Body style={{ paddingBottom: 0 }}>
              {essays.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '13.5px' }}>No essays written yet. Get started by clicking "+ New Essay"!</p>
                </div>
              ) : (
                essays.slice(0, 4).map((essay) => (
                  <EssayListItem 
                    key={essay.id} 
                    essay={essay} 
                    onClick={() => handleEssayClick(essay)} 
                  />
                ))
              )}
            </Card.Body>
          </Card>

          {/* Latest Essay Score breakdown */}
          <Card>
            <Card.Header>
              <Card.Title>Latest Essay Score</Card.Title>
            </Card.Header>
            <Card.Body>
              {latestGradedEssay && latestGradedEssay.score > 0 ? (
                <div className="score-ring-container">
                  <ScoreRing score={latestGradedEssay.score} size={120} />
                  
                  <div className="sub-scores" style={{ width: '220px', marginTop: '16px' }}>
                    <div className="sub-score-row">
                      <span className="sub-score-label">Structure</span>
                      <div className="sub-score-bar">
                        <div className="sub-score-fill" style={{ width: `${latestGradedEssay.subScores?.structure || 0}%` }}></div>
                      </div>
                      <span className="sub-score-val">{latestGradedEssay.subScores?.structure || 0}</span>
                    </div>
                    <div className="sub-score-row">
                      <span className="sub-score-label">Argument</span>
                      <div className="sub-score-bar">
                        <div className="sub-score-fill" style={{ width: `${latestGradedEssay.subScores?.argument || 0}%` }}></div>
                      </div>
                      <span className="sub-score-val">{latestGradedEssay.subScores?.argument || 0}</span>
                    </div>
                    <div className="sub-score-row">
                      <span className="sub-score-label">Clarity</span>
                      <div className="sub-score-bar">
                        <div className="sub-score-fill" style={{ width: `${latestGradedEssay.subScores?.clarity || 0}%` }}></div>
                      </div>
                      <span className="sub-score-val">{latestGradedEssay.subScores?.clarity || 0}</span>
                    </div>
                    <div className="sub-score-row">
                      <span className="sub-score-label">Grammar</span>
                      <div className="sub-score-bar">
                        <div className="sub-score-fill" style={{ width: `${latestGradedEssay.subScores?.grammar || 0}%` }}></div>
                      </div>
                      <span className="sub-score-val">{latestGradedEssay.subScores?.grammar || 0}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px 0', color: 'var(--muted)', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                  <p style={{ fontSize: '13px' }}>No graded essays available. Write and analyze an essay to view scoring breakdowns here.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Tips + Streak */}
        <div className="grid-equal">
          {/* Coach Tips */}
          <Card>
            <Card.Header>
              <Card.Title>AI Coach Tips for You</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="quick-tip">
                <div className="tip-label">📌 Structure</div>
                <p>Your topic sentences are strong, but your body paragraphs sometimes drift off-topic. Try restating the paragraph's main claim in the closing sentence.</p>
              </div>
              <div className="quick-tip" style={{ background: 'var(--blue-light)', borderLeftColor: 'var(--blue)' }}>
                <div className="tip-label" style={{ color: 'var(--blue)' }}>💬 Argumentation</div>
                <p>Consider adding counterarguments to your essays. Acknowledging the opposing view and refuting it strengthens your credibility significantly.</p>
              </div>
            </Card.Body>
          </Card>

          {/* Writing Streak */}
          <Card>
            <Card.Header>
              <Card.Title>Writing Streak</Card.Title>
              <Badge variant="gold">🔥 5 Days</Badge>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: 'var(--green)', borderRadius: '4px', height: '8px' }}></div>
                <div style={{ flex: 1, background: 'var(--green)', borderRadius: '4px', height: '8px' }}></div>
                <div style={{ flex: 1, background: 'var(--green)', borderRadius: '4px', height: '8px' }}></div>
                <div style={{ flex: 1, background: 'var(--green)', borderRadius: '4px', height: '8px' }}></div>
                <div style={{ flex: 1, background: 'var(--green)', borderRadius: '4px', height: '8px' }}></div>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', height: '8px' }}></div>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', height: '8px' }}></div>
              </div>
              <p className="text-muted" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                You've written for <strong>5 consecutive days</strong>. Keep it up — consistent practice is the fastest path to improvement.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <Badge variant="gold">🏆 First Essay</Badge>
                <Badge variant="green">📚 5 Essays Written</Badge>
                <Badge variant="blue">✏️ 10k Words</Badge>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
