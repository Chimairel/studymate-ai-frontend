import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  className = ''
}) => {
  return (
    <div 
      className={`toggle ${!checked ? 'off' : ''} ${className}`.trim()}
      onClick={() => onChange(!checked)}
    />
  );
};

export default Toggle;
