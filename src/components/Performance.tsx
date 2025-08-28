"use client"
import Image from 'next/image';
import React from 'react'
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const data = [
  {name: 'Group A', value: 92, fill: "#C3EBFA"},
  {name: 'Group B', value: 8, fill: "#FAE27C"},
]
export default function Performance() {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex justify-center items-center">
        <div className='flex flex-col gap-1 items-center'>
          <h1 className="text-3xl font-bold">9.2</h1>
          <p className="text-xs text-gray-300">of 10 max LTS</p>
        </div>
      </div>

      <p className='font-medium absolute bottom-16 left-0 right-0 flex justify-center'>1st Semester - 2nd Semester</p>
    </div>
  );
}
