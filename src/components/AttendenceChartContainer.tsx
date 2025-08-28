import Image from "next/image";
import AttendenceChart from "./AttendenceChart";
import { prisma } from "@/lib/prisma";

export default async function AttendenceChartContainer() {
  const dayOfWekk = new Date().getDay();
  const daySinceMonday = dayOfWekk === 0 ? 6 : dayOfWekk - 1;
  const lastMonday = new Date(new Date().setDate(new Date().getDate() - daySinceMonday));

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });


  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);

    // 只处理周一到周五（1~5）
    if (itemDate.getDay() >= 1 && itemDate.getDay() <= 5) {
      const dayName = daysOfWeek[itemDate.getDay() - 1]; // 转换为 "Mon", "Tue" 等

      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="w-full h-full bg-white rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendence</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>

      <AttendenceChart data={data} />
    </div>
  );
}
