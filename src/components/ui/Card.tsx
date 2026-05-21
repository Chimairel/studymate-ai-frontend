import React from 'react';

interface CardProps {
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<{ className?: string; children: React.ReactNode }>;
  Title: React.FC<{ className?: string; children: React.ReactNode }>;
  Body: React.FC<{ className?: string; style?: React.CSSProperties; children: React.ReactNode }>;
} = ({
  padded = false,
  className = '',
  children,
}) => {
  const combinedClasses = `card ${padded ? 'card-padded' : ''} ${className}`.trim();
  return <div className={combinedClasses}>{children}</div>;
};

const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children
}) => {
  return <div className={`card-header ${className}`.trim()}>{children}</div>;
};

const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children
}) => {
  return <span className={`card-title ${className}`.trim()}>{children}</span>;
};

const CardBody: React.FC<{ className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  className = '',
  style,
  children
}) => {
  return <div className={`card-body ${className}`.trim()} style={style}>{children}</div>;
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;

export default Card;
