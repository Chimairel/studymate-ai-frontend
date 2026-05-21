import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number; // percentage (0-100)
  colorClass?: string; // e.g. '--border', '--muted', '--accent'
  opacity?: number;
}

interface ProgressChartProps {
  data?: ChartDataPoint[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const defaultData: ChartDataPoint[] = [
    { label: 'Jan', value: 60, colorClass: 'var(--border)' },
    { label: 'Feb', value: 55, colorClass: 'var(--border)' },
    { label: 'Mar', value: 65, colorClass: 'var(--border)' },
    { label: 'Apr', value: 70, colorClass: 'var(--muted)' },
    { label: 'May', value: 78, colorClass: 'var(--accent)' },
    { label: 'Jun', value: 82, colorClass: 'var(--accent)', opacity: 0.5 },
  ];

  const chartData = data || defaultData;

  const getColorValue = (colorClass: string) => {
    // If it's a CSS variable inside standard design tokens
    if (colorClass.startsWith('var(')) return colorClass;
    return `var(${colorClass})`;
  };

  return (
    <div className="progress-chart-area">
      {chartData.map((item, index) => (
        <div key={`${item.label}-${index}`} className="chart-bar-group">
          <div 
            className="chart-bar" 
            style={{ 
              height: `${item.value}%`, 
              background: getColorValue(item.colorClass || '--accent'),
              opacity: item.opacity ?? 1
            }}
            title={`Score: ${item.value}`}
          />
          <div className="chart-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressChart;
