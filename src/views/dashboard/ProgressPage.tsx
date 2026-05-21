"use client";

import React from 'react';
import { useEssay } from '../../hooks/useEssay';
import ProgressChart from '../../components/progress/ProgressChart';
import AchievementBadge from '../../components/progress/AchievementBadge';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

export const ProgressPage: React.FC = () => {
  const { essays } = useEssay();

  // Dynamic Skill breakdown averages
  const gradedEssays = essays.filter((e) => e.score > 0);
  const totalGraded = gradedEssays.length;

  const avgSubscores = {
    structure: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.structure || 0), 0) / totalGraded) : 85,
    argument: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.argument || 0), 0) / totalGraded) : 80,
    clarity: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.clarity || 0), 0) / totalGraded) : 72,
    grammar: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.grammar || 0), 0) / totalGraded) : 90,
    evidence: totalGraded > 0 ? Math.round(gradedEssays.reduce((sum, e) => sum + (e.subScores?.evidence || 0), 0) / totalGraded) : 68,
  };

  // Find weakest skill
  const skills = [
    { name: 'Structure', score: avgSubscores.structure, desc: 'focus on outlining paragraphs and reinforcing topic claims' },
    { name: 'Argument', score: avgSubscores.argument, desc: 'try identifying counterarguments and formulating strong rebuttals' },
    { name: 'Clarity', score: avgSubscores.clarity, desc: 'try shortening complex sentences and shifting to active phrasing' },
    { name: 'Grammar', score: avgSubscores.grammar, scoreName: 'Grammar', desc: 'review subject-verb agreement and punctuation details' },
    { name: 'Evidence', score: avgSubscores.evidence, desc: 'ensure you cite credible facts, statistics, or research studies to validate assertions' },
  ];

  const weakestSkill = skills.reduce((weakest, current) => current.score < weakest.score ? current : weakest, skills[0]);

  // Calculate stats for achievements
  const totalWords = essays.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const highestScore = essays.reduce((max, e) => e.score > max ? e.score : max, 0);

  const achievementsList = [
    { icon: '✍️', name: 'First Draft', desc: 'Submitted your first essay', unlocked: essays.length >= 1 },
    { icon: '📚', name: 'Prolific Writer', desc: 'Wrote 5 essays', unlocked: essays.length >= 5 },
    { icon: '🎯', name: 'Score 80+', desc: 'Achieved an 80+ score', unlocked: highestScore >= 80 },
    { icon: '🔥', name: '5-Day Streak', desc: 'Wrote 5 days in a row', unlocked: true }, // Default unlocked as in mockup
    { icon: '🏆', name: 'Score 90+', desc: 'Achieve a 90+ score', unlocked: highestScore >= 90 },
    { icon: '📖', name: 'Novelist', desc: 'Write 50,000 words', unlocked: totalWords >= 50000 },
    { icon: '🌟', name: 'Perfect Essay', desc: 'Score 100/100', unlocked: highestScore === 100 },
    { icon: '📅', name: '30-Day Streak', desc: 'Write 30 days straight', unlocked: false }
  ];

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

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
              <Badge variant="green">↑ +14 pts this month</Badge>
            </Card.Header>
            <Card.Body>
              <ProgressChart />
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
                  icon={ach.icon}
                  name={ach.name}
                  desc={ach.desc}
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
