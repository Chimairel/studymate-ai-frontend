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
  if (!data || data.length === 0) {
    return (
      <div className="progress-chart-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', minHeight: '200px' }}>
        No score history available yet.
      </div>
    );
  }

  const chartData = data;

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
