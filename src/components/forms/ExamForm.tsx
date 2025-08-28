"use client";

import React, { useActionState, useEffect } from "react";
import { createStudent, updateStudent } from "@/lib/actions/student";
import { toast } from "react-toastify";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { X } from "lucide-react";
import { createExam, updateExam } from "@/lib/actions/exam";

interface FormProps {
  type: "update" | "create";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  setOpen: (isOpen: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedData?: any;
}

export default function ExamForm({
  type,
  data,
  setOpen,
  relatedData,
}: FormProps) {
  const [image, setImage] = React.useState<string | null>(data?.img || null);
  const [state, action, pending] = useActionState(
    type === "create" ? createExam : updateExam.bind(null, data?.id),
    {
      success: false,
      error: [],
    }
  );

  useEffect(() => {
    if (state.error && state.error.length > 0 && !state.success) {
      const firstError = state.error[0];
      toast.error(firstError.message || "An error occurred");
    } else if (state.success) {
      toast.success(
        type === "create"
          ? `Exam created successfully`
          : "Exam updated successfully"
      );
      setOpen(false);
    }
  }, [state, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" action={action}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Exam" : "Update the Exam"}
      </h1>

      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-500">
            Exam title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={data?.title}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "title")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-1/3">
          <label
            htmlFor="startTime"
            className="text-sm font-medium text-gray-500"
          >
            Start time
          </label>
          <input
            type="date"
            id="startTime"
            name="startTime"
            defaultValue={
              data?.startTime
                ? new Date(data.startTime).toISOString().split("T")[0]
                : ""
            }
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "startTime")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-1/3">
          <label
            htmlFor="endTime"
            className="text-sm font-medium text-gray-500"
          >
            End Time
          </label>
          <input
            type="date"
            id="endTime"
            name="endTime"
            defaultValue={
              data?.endTime
                ? new Date(data.endTime).toISOString().split("T")[0]
                : ""
            }
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "endTime")?.message}
            </p>
          )}
        </div>

        {relatedData?.lessons && (
          <div className="flex flex-col gap-2 w-1/3">
            <label className="text-xs text-gray-500">Lessons</label>
            <select
              name="lessonId"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.lessonId}
            >
              {relatedData.lessons.map(
                (lesson: { id: number; name: number }) => (
                  <option key={lesson.id} value={lesson.id} className="p-2">
                    {lesson.name}
                  </option>
                )
              )}
            </select>
            {state.error && (
              <p className="text-red-500 text-sm">
                {state.error.find((item) => item.path === "lessonId")?.message}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-400/80 disabled:opacity-50"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
