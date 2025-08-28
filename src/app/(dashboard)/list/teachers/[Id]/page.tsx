import React from 'react'
import SmallUserCard from './(components)/SmallUserCard';
import SmallInfoCard from './(components)/SmallInfoCard';
import BigCalendar from '@/components/BigCalendar';
import Announcements from '@/components/Announcements';
import Shortcuts from './(components)/Shortcuts';
import Performance from '@/components/Performance';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ Id: string }> }) {
  const { Id } = await params;
  const teacher = await prisma.teacher.findUnique({
    where: {id: Id},
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        }
      }
    }
  })
  if(!teacher) {
    return notFound()
  }

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/*top */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* user card */}
          <div className="flex-1">
            <SmallUserCard data={teacher} />
          </div>

          {/* small card */}
          <div className="flex-1">
            <SmallInfoCard data={teacher} />
          </div>
        </div>

        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer id={Id} type="teacherId" />
        </div>
      </div>

      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* shorcuts */}
        <Shortcuts />

        {/* Performance */}
        <Performance />

        {/* Announcements */}
        <Announcements />
      </div>
    </div>
  );
}
