import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
const announcements = [
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
export default async function Announcements() {
  const { currentUserId, role } = await getCurrentUser();

  const roleCondition = {
    admin: {},
    teacher: { lessons: { some: { teacherId: currentUserId } } },
    student: { students: { some: { id: currentUserId } } },
    parent: { students: { some: { parentId: currentUserId } } },
  };

  const announcements = await prisma.announcement.findMany({
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleCondition[role as keyof typeof roleCondition] || {} },
        ],
      }),
    },
    take: 3,
    orderBy: { date: "desc" },
  });


  return (
    <div className="bg-white p-4 rounded-md">
      {/* tittle */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Announcements </h1>
        <span className="text-xs text-gray-400">view all</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {announcements.map((announcement) => (
          <div
            className="odd:bg-mySkyLight even:bg-myPurpleLight rounded-md p-4"
            key={announcement.id}
          >
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-gray-600">
                {announcement.title}
              </h1>
              <span className="text-gray-300 text-sm p-0.5 rounded-md bg-white">
                {announcement.date.toLocaleString("en-US", { dateStyle: "short" })}
              </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm ">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
