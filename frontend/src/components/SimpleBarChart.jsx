import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const SimpleBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis domain={[0, 'dataMax + 1']} />
        <Tooltip />
        <Bar dataKey="value" fill="#4682B4">
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
