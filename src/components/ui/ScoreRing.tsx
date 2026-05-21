import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  className = ''
}) => {
  const radius = 52;
  const strokeWidth = 8;
  const center = size / 2;
  
  // Circumference
  const circumference = 2 * Math.PI * radius; // ~326.72
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className={`score-ring ${className}`.trim()} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <circle 
          className="ring-bg" 
          cx="60" 
          cy="60" 
          r={radius} 
          strokeWidth={strokeWidth}
        />
        <circle 
          className="ring-fill" 
          cx="60" 
          cy="60" 
          r={radius} 
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-center">
        <div className="score-num">{score}</div>
        <div className="score-denom">/ 100</div>
      </div>
    </div>
  );
};

export default ScoreRing;
