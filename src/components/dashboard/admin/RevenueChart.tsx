"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Chartbar {
  month: string;
  revenue: number;
}
interface chartRecords{
  data:Chartbar[]
}

const RevenueChart = ({data}:chartRecords) => {
  return (
    <div className="flex flex-col lg:h-full h-[60vh] bg-white lg:w-[60%] w-full pb-2 rounded-md text-sm">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Revenue generated (USD)
        </h2>
      </div>
      <ResponsiveContainer width="100%" className="text-sm">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#003472" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
