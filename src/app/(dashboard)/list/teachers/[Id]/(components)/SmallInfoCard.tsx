import { Student, Teacher } from "@prisma/client";
import Image from "next/image";
import React from "react";

export default function SmallInfoCard({
  data,
}: {
  data:
     (Teacher & {
        _count: { subjects: number; classes: number; lessons: number };
      })
    
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between flex-wrap">
      <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 flex items-center gap-4 rounded-md">
        <Image
          src={"/singleAttendance.png"}
          alt="singleAttendance"
          width={24}
          height={24}
          className="size-6"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">-</h1>
          <span className="text-sm text-gray-500">Attendence</span>
        </div>
      </div>

      <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 flex items-center gap-4">
        <Image
          src={"/singleBranch.png"}
          alt="singleBranch"
          width={24}
          height={24}
          className="size-6"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{data._count.subjects}</h1>
          <span className="text-sm text-gray-500">Branches</span>
        </div>
      </div>
      <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 flex items-center gap-4">
        <Image
          src={"/singleLesson.png"}
          alt="singleLesson"
          width={24}
          height={24}
          className="size-6"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{data._count.lessons}</h1>
          <span className="text-sm text-gray-500">Lessons</span>
        </div>
      </div>
      <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 flex items-center gap-4">
        <Image
          src={"/singleClass.png"}
          alt="singleClass"
          width={24}
          height={24}
          className="size-6"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{data._count.classes}</h1>
          <span className="text-sm text-gray-500">Classes</span>
        </div>
      </div>
    </div>
  );
}
