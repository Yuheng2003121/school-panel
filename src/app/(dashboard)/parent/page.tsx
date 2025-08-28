import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import React from "react";

export default function Page() {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* left */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedual (Yuheng Li)</h1>
          <BigCalendarContainer type="classId" id={1}/>
        </div>
      </div>

      {/* right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div>
          <EventCalendar />
          <Announcements />
        </div>
      </div>
    </div>
  );
}
