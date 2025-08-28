"use client";
import { useConfirm } from "@/lib/hooks/useConfirm";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import ParentForm from "./forms/ParentForm";
import ClassForm from "./forms/ClassForm";
import SubjectForm from "./forms/SubjectForm";
import LessonForm from "./forms/LessonForm";
import ExamForm from "./forms/ExamForm";
import AssignmentForm from "./forms/AssignmentForm";
import ResultForm from "./forms/ResultForm";
import AttandanceForm from "./forms/AttendanceForm";
import EventForm from "./forms/EventForm";
import AnnouncementForm from "./forms/AnnouncementForm";
import { deleteSubject } from "@/lib/actions/subject";
import { set } from "zod";
import { toast } from "react-toastify";
import { FormModalProps } from "./FormContainer";
import { deleteClass } from "@/lib/actions/class";
import { deleteTeacher } from "@/lib/actions/teacher";
import { deleteStudent } from "@/lib/actions/student";
import { deleteExam } from "@/lib/actions/exam";
// import TeacherForm from './forms/TeacherForm';
// import StudentForm from './forms/StudentForm';

// 懒加载+suspense (可选)
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    setOpen: (isOpen: boolean) => void,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    relatedData?: any
  ) => React.ReactNode;
} = {
  teacher: (type, data, setOpen, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (type, data, setOpen, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  subject: (type, data, setOpen, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (type, data, setOpen, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),

  class: (type, data, setOpen, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  // parent: (type, data) => <ParentForm type={type} data={data}/>,
  // class: (type, data) => <ClassForm type={type} data={data}/>,
  // lesson: (type, data) => <LessonForm type={type} data={data}/>,
  // exam: (type, data) => <ExamForm type={type} data={data}/>,
  // assignment: (type, data) => <AssignmentForm type={type} data={data}/>,
  // result: (type, data) => <ResultForm type={type} data={data}/>,
  // attendance: (type, data) => <AttandanceForm type={type} data={data}/>,
  // event: (type, data) => <EventForm type={type} data={data}/>,
  // announcement: (type, data) => <AnnouncementForm type={type} data={data}/>,
};

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteSubject,
  lesson: deleteSubject,
  exam: deleteExam,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
}: //eslint-disable-next-line @typescript-eslint/no-explicit-any
FormModalProps & { relatedData?: any }) {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgCol =
    type === "create"
      ? "bg-myYellow"
      : type === "update"
      ? "bg-mySky"
      : "bg-myPurple";
  const [open, setOpen] = useState(false);
  const [confirm, ConfirmDialog] = useConfirm(
    "Delete",
    `Are you sure you want to delete this ${table}?`
  );

  const handleOnDelete = async () => {
    const isConfirmed = await confirm();
    if (isConfirmed) {
      const result = await deleteActionMap[table](id!);

      if (result.success) {
        toast.success(`${table} deleted successfully`);
      } else if (!result.success && result.error) {
        toast.error(result.error instanceof Array ? result.error.map(item => item.message).join(' '):result.error);
      }
    }
  };

  return (
    <>
      <button
        className={`${size} ${bgCol} flex items-center justify-center rounded-full`}
        onClick={() => {
          if (type !== "delete") setOpen(true);
          else if (type === "delete") handleOnDelete();
        }}
      >
        <Image src={`/${type}.png`} alt={type} width={16} height={16} />
      </button>

      {/* 专门负责删除确认的弹框 */}
      <ConfirmDialog />

      {/* 只有type不是删除的才会显示这个弹框 */}
      {open && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/60 z-50"
          onClick={() => setOpen(false)}
        >
          {/* 主要内容 */}
          <div
            className="bg-white p-4 rounded-md relative w-[90%]  md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]  "
            onClick={(e) => e.stopPropagation()}
          >
            {/* 右上角关闭x */}
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </div>

            {/* <div>Create or Update this {table}</div> */}
            <div className="max-h-[80vh] overflow-y-auto p-4">
              {/* <TeacherForm type="create" data={data}/> */}
              {forms[table](
                type as "create" | "update",
                data,
                setOpen,
                relatedData
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
