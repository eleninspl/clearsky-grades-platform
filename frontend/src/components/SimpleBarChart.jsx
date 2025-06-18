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

const SimpleBarChart = ({ data, height = 200 }) => {
  const isTotalChart = data?.[0]?.label && ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(data[0].label);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis
          domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
          allowDecimals={false}
        />
        <Tooltip />
        <Bar dataKey="value" fill="#4682B4">
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};


export default SimpleBarChart;
