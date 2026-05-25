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
  const { essays, setCurrentEssay, isLoading } = useEssay();
  
  const [activeTab, setActiveTab] = React.useState<'recent' | 'favorites'>('recent');
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('studymate_favorite_essays');
      if (stored) {
        try {
          setFavoriteIds(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const favoriteEssays = essays.filter(e => favoriteIds.includes(e.id));

  if (isLoading) {
    return (
      <div>
        <div className="content-header">
          <div>
            <div className="skeleton" style={{ height: '32px', width: '250px', marginBottom: '8px' }}></div>
            <div className="skeleton" style={{ height: '18px', width: '380px' }}></div>
          </div>
          <div className="skeleton" style={{ height: '40px', width: '130px', borderRadius: '8px' }}></div>
        </div>

        <div className="content-body">
          {/* KPI metrics skeleton */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }}></div>
            ))}
          </div>

          <div className="grid-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Overview Skeleton */}
              <Card>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ height: '20px', width: '120px' }}></div>
                </Card.Header>
                <Card.Body style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div className="skeleton" style={{ height: '120px', width: '120px', borderRadius: '50%' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: '20px', width: '100px', marginBottom: '12px' }}></div>
                    <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ height: '14px', width: '80%' }}></div>
                  </div>
                </Card.Body>
              </Card>

              {/* Recent Drafts Skeleton */}
              <Card>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ height: '20px', width: '140px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '70px' }}></div>
                </Card.Header>
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="skeleton" style={{ height: '70px', borderRadius: '8px' }}></div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Coach Tips Skeleton */}
              <Card>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ height: '20px', width: '110px' }}></div>
                </Card.Header>
                <Card.Body>
                  <div className="skeleton" style={{ height: '90px', borderRadius: '8px', marginBottom: '12px' }}></div>
                  <div className="skeleton" style={{ height: '90px', borderRadius: '8px' }}></div>
                </Card.Body>
              </Card>

              {/* Writing Streak Skeleton */}
              <Card>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton" style={{ height: '20px', width: '130px' }}></div>
                  <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '12px' }}></div>
                </Card.Header>
                <Card.Body>
                  <div className="skeleton" style={{ height: '80px', borderRadius: '8px' }}></div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const now = new Date();
  const essaysThisMonth = essays.filter(e => {
    if (!e.createdAt) return false;
    const createdDate = new Date(e.createdAt);
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length;

  // Get first graded essay for latest score ring detail
  const latestGradedEssay = essays.find(e => e.score > 0) || essays[0];

  const handleEssayClick = (essay: any) => {
    setCurrentEssay(essay);
    router.push(`/dashboard/editor?id=${essay.id}`);
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
            changeText={essaysThisMonth > 0 ? `${essaysThisMonth} this month` : "No essays this month"}
            changeType={essaysThisMonth > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Avg. Score"
            value={avgScore || '--'}
            changeText={avgScore > 0 ? "Current average" : "No grades yet"}
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
            value={totalEssays}
            changeText={totalEssays > 0 ? "1 per essay" : "No sessions yet"}
            changeType={totalEssays > 0 ? "neutral" : "neutral"}
          />
        </div>

        {/* Recent Essays & Latest Score */}
        <div className="grid-2">
          {/* Recent Essays */}
          <Card>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '18px' }}>
                <span 
                  onClick={() => setActiveTab('recent')}
                  style={{
                    fontSize: '14.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: activeTab === 'recent' ? 'var(--ink)' : 'var(--muted)',
                    borderBottom: activeTab === 'recent' ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                    paddingBottom: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  Recent Essays
                </span>
                <span 
                  onClick={() => setActiveTab('favorites')}
                  style={{
                    fontSize: '14.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: activeTab === 'favorites' ? 'var(--ink)' : 'var(--muted)',
                    borderBottom: activeTab === 'favorites' ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                    paddingBottom: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  Favorites
                </span>
              </div>
              <Link href="/dashboard/essays" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                View All
              </Link>
            </Card.Header>
            <Card.Body style={{ paddingBottom: 0 }}>
              {activeTab === 'recent' ? (
                essays.length === 0 ? (
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
                )
              ) : (
                favoriteEssays.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--muted)' }}>
                    <p style={{ fontSize: '13.5px' }}>No favorite essays yet. Mark some essays as favorites in the My Essays tab!</p>
                  </div>
                ) : (
                  favoriteEssays.slice(0, 4).map((essay) => (
                    <EssayListItem
                      key={essay.id}
                      essay={essay}
                      onClick={() => handleEssayClick(essay)}
                    />
                  ))
                )
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
              {totalEssays > 0 ? (
                <>
                  <div className="quick-tip">
                    <div className="tip-label">📌 Structure</div>
                    <p>Your topic sentences are strong, but your body paragraphs sometimes drift off-topic. Try restating the paragraph's main claim in the closing sentence.</p>
                  </div>
                  <div className="quick-tip" style={{ background: 'var(--blue-light)', borderLeftColor: 'var(--blue)' }}>
                    <div className="tip-label" style={{ color: 'var(--blue)' }}>💬 Argumentation</div>
                    <p>Consider adding counterarguments to your essays. Acknowledging the opposing view and refuting it strengthens your credibility significantly.</p>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '36px 12px', color: 'var(--muted)', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💡</div>
                  <p style={{ fontSize: '13px', lineHeight: 1.5 }}>
                    No coach tips yet! Write your first essay and get AI feedback to see dynamic writing tips.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Writing Streak */}
          <Card>
            <Card.Header>
              <Card.Title>Writing Streak</Card.Title>
              <Badge variant={(user?.streak || 0) > 0 ? "gold" : "muted"} style={{ opacity: (user?.streak || 0) > 0 ? 1 : 0.6 }}>
                🔥 {user?.streak || 0} {(user?.streak || 0) === 1 ? 'Day' : 'Days'}
              </Badge>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: i < Math.min(user?.streak || 0, 7) ? 'var(--green)' : 'var(--border)',
                      borderRadius: '4px',
                      height: '8px'
                    }}
                  ></div>
                ))}
              </div>
              {(user?.streak || 0) > 0 ? (
                <p className="text-muted" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  You've written for <strong>{user?.streak} consecutive {(user?.streak || 0) === 1 ? 'day' : 'days'}</strong>. Keep it up — consistent practice is the fastest path to improvement.
                </p>
              ) : (
                <p className="text-muted" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  Start your writing streak today! Write and analyze an essay to get your daily streak started.
                </p>
              )}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {totalEssays >= 1 ? (
                  <Badge variant="gold">🏆 First Essay</Badge>
                ) : (
                  <Badge variant="muted" style={{ opacity: 0.5 }}>🏆 First Essay (Locked)</Badge>
                )}
                {totalEssays >= 5 ? (
                  <Badge variant="green">📚 5 Essays Written</Badge>
                ) : (
                  <Badge variant="muted" style={{ opacity: 0.5 }}>📚 5 Essays (Locked)</Badge>
                )}
                {totalWords >= 10000 ? (
                  <Badge variant="blue">✏️ 10k Words</Badge>
                ) : (
                  <Badge variant="muted" style={{ opacity: 0.5 }}>✏️ 10k Words (Locked)</Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
