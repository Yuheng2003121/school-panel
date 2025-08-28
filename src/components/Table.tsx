// import { Parent } from '@/app/(dashboard)/list/parents/page';
// import { Student } from '@/app/(dashboard)/list/students/page';
// import { Teacher } from '@/app/(dashboard)/list/teachers/page';
import React from 'react'

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  // renderRow: (item: Teacher | Student | Parent) => React.ReactNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderRow: (item: any) => React.ReactNode;

  // data: (Teacher | Student | Parent)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}
export default function Table({ columns, renderRow, data }: TableProps) {
  return (
    <table className="w-full mt-4">
      {/* 头部 */}
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((column, index) => (
            <th key={index} className={`${column.className}`}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      {/* 列表 */}
      <tbody className='mt-2'>
        {data.map((item) => renderRow(item))}
      </tbody>
    </table>
  );
}
