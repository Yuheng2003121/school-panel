import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import React from "react";
import { Prisma, Subject, Teacher } from "@prisma/client";
import { getSubjects } from "@/lib/api/subjects";
import { getCurrentUser } from "@/lib/auth";
import FormContainer from "@/components/FormContainer";

// export interface Subject {
//   id: number;
//   name: string;
//   teachers: string[];
// }

type SubjectList = Subject & {teachers: Teacher[]}


export default async function SubjectList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, currentUserId } = await getCurrentUser();

  const columns = [
    {
      header: "Subject Name",
      accessor: "subject name",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "actions",
    },
  ];
  const renderRow = (item: SubjectList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        {/* selfinfo */}
        <td className="px-2 py-4">
          <h3 className="font-semibold">{item.name}</h3>
        </td>

        <td className="hidden md:table-cell">
          <p className="">
            {item.teachers.map((teacher) => teacher.name).join(",")}
          </p>
        </td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <FormContainer table="subject" type="update" data={item} />
            )}

            {role === "admin" && (
              <FormContainer table="subject" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };
  //获取查询参数
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};
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
  const { data, isLoading, count } = await getSubjects(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>

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
              <FormContainer table="subject" type="create" />
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
