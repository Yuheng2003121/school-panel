import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FormModal from "@/components/FormModal";
import { Class, Prisma, Student } from "@prisma/client";
import { getStudents } from "@/lib/api/students";
import Loading from "@/components/Loading";
import { getCurrentUser } from "@/lib/auth";
import FormContainer from "@/components/FormContainer";

// export interface Student {
//   id: number;
//   studentId: string;
//   name: string;
//   email?: string;
//   photo: string;
//   phone: string;
//   grade: number;
//   class: string;
//   address: string;
// }

type StudentList = Student & { class: Class };


export default async function StudentList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role } = await getCurrentUser();

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
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

  const renderRow = (item: StudentList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurpleLight"
      >
        {/* selfinfo */}
        <td className="px-2 py-4">
          <div className="flex gap-4  ">
            <Image
              src={item.img || "/noAvatar.png"}
              alt={item.name}
              width={40}
              height={40}
              className="rounded-full object-cover md:hidden xl:block"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.class.name}</p>
            </div>
          </div>
        </td>

        {/* infos */}
        <td className="hidden md:table-cell">{item.username}</td>
        <td className="hidden md:table-cell">{item.class.name[0]}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>

        {/* actions */}
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/students/${item.id}`}>
              <button className="w-7 h-7 rounded-full flex items-center justify-center bg-mySky">
                <Image src={"/view.png"} alt="view" width={16} height={16} />
              </button>
            </Link>

            {role === "admin" && (
              // <button className="w-7 h-7 rounded-full flex items-center justify-center bg-myPurple">
              //   <Image src={"/delete.png"} alt="view" width={16} height={16} />
              // </button>
              <FormContainer table="student" type="delete" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };
  //获取查询参数
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.StudentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId": // 如果searchParams包含?teacherId=...
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
              },
            };
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
        }
      }
    }
  }
  //根据查询参查询
  const { data, isLoading, count } = await getStudents(p, query);

  return (
    <div className="bg-white p-4 rounded-md  m-4 mt-0">
      {/* top header */}
      <div className="flex justify-between items-center">
        {/* title */}
        <h1 className="hidden md:block text-lg font-semibold">All students</h1>

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
              <FormContainer table="student" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* list */}
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <Table columns={columns} renderRow={renderRow} data={data} />
        )}
      </div>

      {/* pagination */}
      <div>
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}
