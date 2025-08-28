import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getEvents } from "@/lib/api/events";
import { getCurrentUser } from "@/lib/auth";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// export interface Event {
//   id: number;
//   title: string;
//   class: string;
//   date: string;
//   startTime: string;
//   endTime: string;
// }
type EventList = Event & { class: Class };

export default async function EventList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, currentUserId } = await getCurrentUser();

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },

    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];
  const renderRow = (item: EventList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        <td className="px-2 py-4">
          <h3 className="font-semibold">{item.title}</h3>
        </td>

        <td>
          <p className="">{item.class?.name || "-"}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">
            {new Intl.DateTimeFormat("en-US").format(item.startTime)}
          </p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">
            {new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).format(item.startTime)}
          </p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">
            {new Date(item.endTime).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <FormModal table="event" type="update" data={item} />
            )}

            {role === "admin" && (
              <FormModal table="event" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.EventWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
        }
      }
    }
  }

  const roleCondition = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { studentId: currentUserId! } } },
    parent: {
      students: { some: { students: { some: { parentId: currentUserId! } } } },
    },
  };

  query.OR = [
    { classId: null },
    {
      class: roleCondition[role!] || {},
    },
  ];
  // switch (role) {
  //   case 'admin':
  //     break;
  //   case 'teacher': //作为 老师（teacher），你应该能看到： 1.所有 不属于任何班级的公共事件（classId = null）2. 所有 你所教班级的专属事件
  //     query.OR = [
  //       {classId: null},
  //       {class: {lessons: { some: { teacherId: currentUserId! } }}}
  //     ]
  //     break;
  // }

  const { data: data, isLoading, count } = await getEvents(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>

        {/* search bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="ml-auto flex items-center gap-4">
            <button className="size-8 rounded-full flex items-center justify-center bg-myYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="size-8 rounded-full flex items-center justify-center bg-myYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>

      {/* list */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* pagination */}
      <div>
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}
