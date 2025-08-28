import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getLessons } from "@/lib/api/lessons";
import { getCurrentUser } from "@/lib/auth";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import React from "react";

// export interface Lesson {
//   id: number;
//   subject: string;
//   class: string;
//   teacher: string;
// }
type LessonList = Lesson & {subject: Subject} & {class: Class} & {teacher:Teacher}


export default async function LessonList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, currentUserId } = await getCurrentUser();

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },

    {
      header: "Teacher",
      accessor: "teacher",
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
  const renderRow = (item: LessonList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        <td className="px-2 py-4">
          <h3 className="font-semibold">{item.subject.name}</h3>
        </td>

        <td className="">
          <p className="">{item.class.name}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">{item.teacher.name}</p>
        </td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <FormModal table="lesson" type="update" data={item} />
            )}

            {role === "admin" && (
              <FormModal table="lesson" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.LessonWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.teacherId = value;
            break;
          case "classId":
            query.classId = parseInt(value);
            break;
          case "search": //?search=... 这个可能是subject's name 或者teacher's name
            query.OR = [
              {
                subject: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
              {
                teacher: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
            ];
        }
      }
    }
  }

  const { data: data, isLoading, count } = await getLessons(p, query);
  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>

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
            {role === "admin" && <FormModal table="lesson" type="create" />}
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
