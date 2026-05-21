import React from 'react';
import { SubScores } from '../../services/essayService';
import ScoreRing from '../ui/ScoreRing';

interface ScoreTabProps {
  score: number;
  subScores?: SubScores;
}

export const ScoreTab: React.FC<ScoreTabProps> = ({
  score,
  subScores = {
    structure: 0,
    argument: 0,
    clarity: 0,
    grammar: 0,
    evidence: 0
  }
}) => {
  const rows = [
    { label: 'Structure', val: subScores.structure },
    { label: 'Argument', val: subScores.argument },
    { label: 'Clarity', val: subScores.clarity },
    { label: 'Grammar', val: subScores.grammar },
    { label: 'Evidence', val: subScores.evidence },
  ];

  return (
    <div>
      <div className="score-ring-container" style={{ padding: '12px 0' }}>
        <ScoreRing score={score} size={110} />
        
        <div className="sub-scores" style={{ marginTop: '16px', width: '100%' }}>
          {rows.map((row) => (
            <div key={row.label} className="sub-score-row">
              <span className="sub-score-label">{row.label}</span>
              <div className="sub-score-bar">
                <div 
                  className="sub-score-fill" 
                  style={{ width: `${row.val}%` }}
                />
              </div>
              <span className="sub-score-val">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreTab;
