import React from 'react';

interface BadgeProps {
  variant?: 'green' | 'red' | 'blue' | 'gold' | 'muted';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'muted',
  className = '',
  children,
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const combinedClasses = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};

export default Badge;
