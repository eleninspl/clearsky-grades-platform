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
  // 🔢 Δημιουργία πλήρους label set [0, 1, ..., 10]
  const completeLabels = Array.from({ length: 11 }, (_, i) => i);

  // 🎯 Αντιστοίχιση δεδομένων στα labels (με 0 για όσα λείπουν)
  const completeData = completeLabels.map(label => {
    const found = data.find(d => Number(d.label) === label);
    return { label, value: found ? found.value : 0 };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={completeData}
        margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        barCategoryGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" interval="preserveStartEnd" />
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
