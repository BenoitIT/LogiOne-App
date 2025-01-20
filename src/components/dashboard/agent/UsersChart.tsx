'use client'
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", patients: 20 },
  { month: "Feb", patients: 45 },
  { month: "Mar", patients: 30 },
  { month: "Apr", patients: 50 },
  { month: "May", patients: 70 },
  { month: "Jun", patients: 60 },
  { month: "Jul", patients: 80 },
  { month: "Aug", patients: 65 },
  { month: "Sep", patients: 40 },
  { month: "Oct", patients: 30 },
  { month: "Nov", patients: 50 },
  { month: "Dec", patients: 70 },
];

const UsersChart = () => {
  return (
    <div className="flex flex-col lg:h-full h-[80vh] bg-white lg:w-[60%] w-full pb-2 rounded-md text-sm">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-bold text-black">Users received</h2>
      </div>
      <ResponsiveContainer width="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="patients" fill="#003472" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersChart;
