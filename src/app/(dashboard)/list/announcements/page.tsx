import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getAnnouncements } from "@/lib/api/announcements";
import { getCurrentUser } from "@/lib/auth";
// import { role } from "@/lib/utils";
import { Announcement, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

// export interface Announcement {
//   id: number;
//   title: string;
//   class: string;
//   date: string;
// }
type AnnouncementList = Announcement & { class: Class };

// const { role } = await getCurrentUser();


export default async function AnnouncementList({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | undefined }>;
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

    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  const renderRow = (item: AnnouncementList) => {
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
          {/* <p className="">{item.date.toLocaleString()}</p> */}
          <p className="">
            {new Intl.DateTimeFormat("en-US").format(item.date)}
          </p>
        </td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <FormModal table="announcement" type="update" data={item} />
            )}

            {role === "admin" && (
              <FormModal table="announcement" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.AnnouncementWhereInput = {};
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

  const { data: data, isLoading, count } = await getAnnouncements(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcement
        </h1>

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
            {role === "admin" && (
              <FormModal table="announcement" type="create" />
            )}
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
