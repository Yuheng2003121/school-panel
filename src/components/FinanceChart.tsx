"use client";
import Image from "next/image";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    income: 60,
    expense: 20,
  },
  {
    name: "Feb",
    income: 70,
  expenset: 5,
  },
  {
    name: "Mar",
    income: 90,
    expense: 15,
  },
  {
    name: "Apr",
    income: 80,
    expense: 12,
  },
  {
    name: "May",
    income: 67,
    expense: 17,
  },
  {
    name: "Jun",
    income: 67,
    expense: 17,
  },
  {
    name: "Jul",
    income: 67,
    expense: 17,
  },
  {
    name: "Aug",
    income: 67,
    expense: 17,
  },
  {
    name: "Sep",
    income: 67,
    expense: 17,
  },
  {
    name: "Oct",
    income: 67,
    expense: 17,
  },
  {
    name: "Nov",
    income: 67,
    expense: 17,
  },
  {
    name: "Dec",
    income: 67,
    expense: 17,
  },
];

export default function FinanceChart() {
  return (
    <div className="w-full h-full bg-white p-4">
      {/* title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">student</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>

      {/* chart */}
      <div className="w-full h-[80%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#fff"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={20}
            />
            <Tooltip />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#C3EBFA"
              strokeWidth={5}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#cfceff"
              strokeWidth={5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
