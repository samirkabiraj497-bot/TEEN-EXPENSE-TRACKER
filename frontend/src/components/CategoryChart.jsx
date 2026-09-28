import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '../utils/currency';

const CATEGORY_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#64748b'  // Slate
];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
      }}>
        <p style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>
          {data.name}
        </p>
        <p style={{ color: data.payload.fill, fontWeight: 700, fontSize: '1rem' }}>
          {formatCurrency(data.value)} ({data.payload.percentage || 0}%)
        </p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No category breakdown available.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="amount"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                stroke="#182235"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
