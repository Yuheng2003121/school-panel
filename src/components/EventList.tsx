import { prisma } from "@/lib/prisma";
import Image from "next/image";
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
export default async function EventList({ dateParam }: { dateParam: string | undefined }) {
  const date = dateParam ? new Date(dateParam) : new Date();
  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  
  return (
    <div>
      {/* title */}
      <div className="flex justify-between items-center py-4">
        <h1 className="text-lg font-semibold">Events</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {data.map((event) => (
          <div
            key={event.id}
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-mySky even:border-t-myPurple"
          >
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-sm">
                {event.startTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm ">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}