import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { parentsData, role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import FormModal from "@/components/FormModal";
import { Parent, Prisma, Student } from "@prisma/client";
import { getParents } from "@/lib/api/parents";
import { getCurrentUser } from "@/lib/auth";

// export interface Parent {
//   id: number;
//   name: string;
//   students: string[];
//   phone: string;
//   email?: string;
//   address: string;
// }

type ParentList = Parent & {students: Student[]} 

export default async function ParentList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, currentUserId } = await getCurrentUser();
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student Names",
      accessor: "studentname",
      className: "hidden md:table-cell",
    },

    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
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
  const renderRow = (item: ParentList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        {/* selfinfo */}
        <td className="px-2 py-4">
          <div className="flex gap-4  ">
            <div className="flex flex-col">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.email}</p>
            </div>
          </div>
        </td>

        {/* infos */}
        <td className="hidden md:table-cell">
          {item.students.map((student) => student.name).join(",")}
        </td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <FormModal table="parent" type="update" data={item} />
            )}

            {role === "admin" && (
              <FormModal table="parent" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };
  //获取查询参数
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ParentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }
  //根据查询参查询
  const { data, isLoading, count } = await getParents(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>

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
              // <button className="size-8 rounded-full flex items-center justify-center bg-myYellow">
              //   <Plus size={16} strokeWidth={1.5} />
              // </button>
              <FormModal table="parent" type="create" />
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
