import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getClasses } from "@/lib/api/classes";
import { getCurrentUser } from "@/lib/auth";
import { Class, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import React from "react";

// export interface Class {
//   id: number;
//   name: string;
//   capacity: number;
//   grade: string;
//   supervisor: string;
// }
type ClassList = Class & {supervisor: Teacher}


export default async function ClassList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, currentUserId } = await getCurrentUser();
  const columns = [
    {
      header: "Class Name",
      accessor: "classname",
    },
    {
      header: "Capacity",
      accessor: "Capacity",
      className: "hidden md:table-cell",
    },

    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Supervisor",
      accessor: "supervisor",
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
  const renderRow = (item: ClassList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        {/* selfinfo */}
        {/* selfinfo */}
        <td className="px-2 py-4">
          <h3 className="font-semibold">{item.name}</h3>
        </td>

        <td className="hidden md:table-cell">
          <p className="">{item.capacity}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">{item.gradeId}</p>
        </td>
        <td className="hidden md:table-cell">
          <p className="">{item.supervisor.name}</p>
        </td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <FormContainer table="class" type="update" data={item} />
            )}

            {role === "admin" && (
              <FormContainer table="class" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ClassWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
        }
      }
    }
  }

  const { data: data, isLoading, count } = await getClasses(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>

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
            {role === "admin" && <FormContainer table="class" type="create" />}
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
