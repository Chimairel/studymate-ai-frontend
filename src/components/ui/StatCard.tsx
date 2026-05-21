import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  changeText: string;
  changeType?: 'up' | 'neutral' | 'down';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  changeText,
  changeType = 'neutral',
  className = ''
}) => {
  const changeClass = changeType === 'up' ? 'stat-change up' : changeType === 'down' ? 'stat-change red' : 'stat-change neutral';
  
  return (
    <div className={`stat-card ${className}`.trim()}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={changeClass}>
        {changeType === 'up' && '↑ '}
        {changeType === 'down' && '↓ '}
        {changeText}
      </div>
    </div>
  );
};

export default StatCard;
