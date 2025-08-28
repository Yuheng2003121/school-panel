import { prisma } from '@/lib/prisma';
import Image from 'next/image'
import React from 'react'

export default async function UserCard({type, color}: {type: "admin" | 'teacher' | 'student' | 'parent', color:string}) {
  const modalMap: Record<typeof type, { count: () => Promise<number> }> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };
  const count = await modalMap[type].count();

  return (
    <div className={`rouned-2xl ${color} p-4 rounded-2xl flex-1 min-w-[130px]`}>
      {/* top */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600">
            2025/8/12
          </span>
          <Image src="/more.png" alt="more" width={20} height={20} />
        </div>
        <h1 className="text-2xl font-semibold my-4">{count}</h1>
        <h2 className="capitalize font-medium text-sm text-gray-500 ">
          {type}
        </h2>
      </div>
    </div>
  );
}
