import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

export default async function EventCalendarContainer({date}: {date: string | undefined}) {


  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar/>
      <EventList dateParam={date}/>
    </div>
  );
}