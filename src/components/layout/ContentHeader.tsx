import React from 'react';

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  title,
  subtitle,
  children
}) => {
  return (
    <div className="content-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default ContentHeader;
