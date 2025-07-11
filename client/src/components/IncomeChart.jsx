import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IncomeChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    totalSales: parseFloat(item.totalSales),
  }));

  return (
    <div className='p-6 bg-gray-800 rounded-lg shadow-lg'>
      <h2 className='text-xl font-bold text-white mb-4'>Daily Income Report</h2>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#4a5568' />
          <XAxis dataKey='date' stroke='#cbd5e0' />
          <YAxis stroke='#cbd5e0' tickFormatter={(value) => `$${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2d3748",
              border: "none",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#a0aec0" }}
          />
          <Legend wrapperStyle={{ color: "#e2e8f0" }} />
          <Bar dataKey='totalSales' fill='#818cf8' name='Total Sales ($)' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
