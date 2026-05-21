import React from 'react';

interface AchievementProps {
  icon: string;
  name: string;
  desc: string;
  unlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementProps> = ({
  icon,
  name,
  desc,
  unlocked
}) => {
  return (
    <div className={`achievement ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="ach-icon">{icon}</div>
      <div className="ach-name">{name}</div>
      <div className="ach-desc">{desc}</div>
    </div>
  );
};

export default AchievementBadge;
