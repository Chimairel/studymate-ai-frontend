import React from 'react';

interface BadgeProps {
  variant?: 'green' | 'red' | 'blue' | 'gold' | 'muted';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'muted',
  className = '',
  style,
  children,
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const combinedClasses = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClasses} style={style}>
      {children}
    </span>
  );
};

export default Badge;
