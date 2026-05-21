"use client";

import React, { useState, useEffect } from 'react';
import { useEssay } from '../../hooks/useEssay';
import ProgressChart from '../../components/progress/ProgressChart';
import AchievementBadge from '../../components/progress/AchievementBadge';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { statsService, Achievement, ProgressStats } from '../../services/statsService';

export const ProgressPage: React.FC = () => {
  const { essays } = useEssay();

  // Dynamic Skill breakdown averages
  const gradedEssays = essays.filter((e) => e.score > 0);
  const totalGraded = gradedEssays.length;

  const [achievementsList, setAchievementsList] = useState<Achievement[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    statsService.getAchievements().then(data => {
      if (data) setAchievementsList(data);
    });
    statsService.getProgress().then(data => {
      if (data) setProgressStats(data);
    });
  }, []);

  const avgSubscores = {
    structure: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.structure || 0), 0) / totalGraded) : 0,
    argument: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.argument || 0), 0) / totalGraded) : 0,
    clarity: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.clarity || 0), 0) / totalGraded) : 0,
    grammar: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.grammar || 0), 0) / totalGraded) : 0,
    evidence: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.evidence || 0), 0) / totalGraded) : 0,
  };

  // Find weakest skill
  const skills = [
    { name: 'Structure', score: avgSubscores.structure, desc: 'focus on outlining paragraphs and reinforcing topic claims' },
    { name: 'Argument', score: avgSubscores.argument, desc: 'try identifying counterarguments and formulating strong rebuttals' },
    { name: 'Clarity', score: avgSubscores.clarity, desc: 'try shortening complex sentences and shifting to active phrasing' },
    { name: 'Grammar', score: avgSubscores.grammar, scoreName: 'Grammar', desc: 'review subject-verb agreement and punctuation details' },
    { name: 'Evidence', score: avgSubscores.evidence, desc: 'ensure you cite credible facts, statistics, or research studies to validate assertions' },
  ];

  const weakestSkill = totalGraded > 0 
    ? skills.reduce((weakest, current) => current.score < weakest.score ? current : weakest, skills[0])
    : { name: 'Writing', desc: 'write some essays to identify areas for improvement!' };

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;
  
  const chartData = progressStats?.scoreTrend?.map((item: any) => ({
    label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.score
  }));

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">My Progress</h1>
          <p className="page-subtitle">Track how your writing has improved over time.</p>
        </div>
      </div>

      <div className="content-body">
        {/* Score History & Skills */}
        <div className="grid-2" style={{ marginBottom: '20px' }}>
          {/* Chart Card */}
          <Card>
            <Card.Header>
              <Card.Title>Score History</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProgressChart data={chartData} />
            </Card.Body>
          </Card>

          {/* Skill Breakdown */}
          <Card>
            <Card.Header>
              <Card.Title>Skill Breakdown</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="sub-scores">
                {skills.map((skill) => (
                  <div key={skill.name} className="sub-score-row">
                    <span className="sub-score-label">{skill.name}</span>
                    <div className="sub-score-bar">
                      <div className="sub-score-fill" style={{ width: `${skill.score}%` }}></div>
                    </div>
                    <span className="sub-score-val">{skill.score}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '14px' }}>
                Your weakest area is <strong>{weakestSkill.name}</strong> — {weakestSkill.desc}.
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Achievements Card */}
        <Card>
          <Card.Header>
            <Card.Title>Achievements</Card.Title>
            <Badge variant="gold">{unlockedCount} Unlocked</Badge>
          </Card.Header>
          <Card.Body>
            <div className="achievement-grid">
              {achievementsList.map((ach, idx) => (
                <AchievementBadge 
                  key={idx}
                  icon={ach.icon === 'pencil' ? '✍️' : ach.icon === 'book' ? '📚' : ach.icon === 'fire' ? '🔥' : ach.icon === 'trophy' ? '🏆' : ach.icon === 'archive' ? '📖' : ach.icon === 'award' ? '🌟' : '🎯'}
                  name={ach.title}
                  desc={ach.description}
                  unlocked={ach.unlocked}
                />
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
