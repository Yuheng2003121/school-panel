"use client";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Mon",
//     present: 60,
//     absent: 20,
//   },
//   {
//     name: "Tue",
//     present: 70,
//     absent: 5,
//   },
//   {
//     name: "Wed",
//     present: 90,
//     absent: 15,
//   },
//   {
//     name: "Thu",
//     present: 80,
//     absent: 12,
//   },
//   {
//     name: "Fri",
//     present: 67,
//     absent: 17,
//   },
// ];

interface Props {
  data: { name: string; present: number; absent: number }[];
}
export default function AttendenceChart({data}: Props) {
  return (
    <div className="w-full h-[90%]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} allowDecimals={false} />
          <Tooltip />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="present"
            fill="#c3ebfa"
            // activeBar={<Rectangle fill="pink" stroke="blue" />}
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#fae27c"
            // activeBar={<Rectangle fill="gold" stroke="purple" />}
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
