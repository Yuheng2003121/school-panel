"use client";
import Image from "next/image";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function CountChart({boys, girls}: {boys: number, girls: number}) {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "white",
    },
    {
      name: "Grils",
      count: girls,
      fill: "#fae27c",
    },
    {
      name: "Boys",
      count: boys,
      fill: "#c3ebfa",
    },
  ];
  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff" }}
            background
            dataKey="count"
          />
          {/* <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
            /> */}
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex justify-center items-center">
        <Image
          src={"/maleFemale.png"}
          alt="maleFemale"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}
