import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getResults } from "@/lib/api/results";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

type ResultList = {
  id: number;
  title: string;
  score: number;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  subjectName: string;
  className: string;
  startTime: Date;
};


export default async function ResultList({
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
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },

    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },

    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  const renderRow = (item: ResultList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        <td className="px-2 py-4">
          <h3 className="font-semibold">{item.title}</h3>
        </td>

        <td>
          <p className="">{item.studentName + " " + item.studentSurname}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">{item.score}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">{item.teacherName + " " + item.teacherSurname}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">{item.className}</p>
        </td>

        <td className="hidden md:table-cell">
          <p className="">
            {new Intl.DateTimeFormat("en-US").format(item.startTime)}
          </p>
        </td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "teacher") && (
              <>
                <FormModal table="result" type="update" data={item} />
                <FormModal table="result" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ResultWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "student":
            query.studentId = value;
            break;

          case "search":
            query.OR = [
              {
                exam: { title: { contains: value, mode: "insensitive" } },
              },
              {
                student: { name: { contains: value, mode: "insensitive" } },
              },
            ];
        }
      }
    }
  }

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } },
      ];
      break;
    case "student":
      query.studentId = currentUserId!;
    case "parent":
      query.student = { parentId: currentUserId! };
      break;
  }

  const { data: data, isLoading, count } = await getResults(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>

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
            {(role === "admin" || role === "teacher") && (
              <FormModal table="result" type="create" />
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
