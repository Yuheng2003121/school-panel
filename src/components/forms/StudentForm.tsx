"use client";

import React, { useActionState, useEffect } from "react";
import { createStudent, updateStudent } from "@/lib/actions/student";
import { toast } from "react-toastify";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { X } from "lucide-react";

interface FormProps {
  type: "update" | "create";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  setOpen: (isOpen: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedData?: any;
}

export default function StudentForm({
  type,
  data,
  setOpen,
  relatedData,
}: FormProps) {
  const [image, setImage] = React.useState<string | null>(data?.img || null);
  const [state, action, pending] = useActionState(
    type === "create" ? createStudent : updateStudent.bind(null, data?.id),
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
          ? `Student created successfully`
          : "Student updated successfully"
      );
      setOpen(false);
    }
  }, [state, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" action={action}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Student" : "Update the Student"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-500"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={data?.username}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "username")?.message}
            </p>
          )}
        </div>

        {type === "create" && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={data?.email}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {state.error && (
              <p className="text-red-500 text-sm">
                {state.error.find((item) => item.path === "email")?.message}
              </p>
            )}
          </div>
        )}

        {type === "create" && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-500"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required={type === "create"}
            />
            {state.error && (
              <p className="text-red-500 text-sm">
                {state.error.find((item) => item.path === "password")?.message}
              </p>
            )}
          </div>
        )}
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col gap-2  relative w-full">
          <input type="hidden" name="img" value={image || ""} />
          <CldUploadWidget
            uploadPreset="next-school"
            onSuccess={(result, { widget }) => {
              setImage((result.info as { secure_url: string }).secure_url);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <label
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                  htmlFor="img"
                  onClick={() => open()}
                >
                  <Image
                    src={"/upload.png"}
                    alt="upload"
                    width={28}
                    height={28}
                  />
                  <span>Upload a photo</span>
                </label>
              );
            }}
          </CldUploadWidget>

          {image && (
            <div className="relative group">
              <Image
                src={image}
                alt="upload"
                width={100}
                height={100}
                className="rounded-md"
              />
              <X
                className="absolute -top-2 -right-2 cursor-pointer hidden group-hover:block"
                onClick={() => setImage("")}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-500">
            First Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={data?.name}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "name")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="surname"
            className="text-sm font-medium text-gray-500"
          >
            Last Name
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            defaultValue={data?.surname}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "surname")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-500">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={data?.phone}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "phone")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-500"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={data?.address}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "address")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="bloodType"
            className="text-sm font-medium text-gray-500"
          >
            Blood Type
          </label>
          <input
            type="text"
            id="bloodType"
            name="bloodType"
            defaultValue={data?.bloodType}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "bloodType")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="parentId"
            className="text-sm font-medium text-gray-500"
          >
            ParentId
          </label>
          <input
            type="text"
            id="parentId"
            name="parentId"
            defaultValue={data?.parentId}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "parentId")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-1/3">
          <label
            htmlFor="birthday"
            className="text-sm font-medium text-gray-500"
          >
            Birthday
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            defaultValue={
              data?.birthday
                ? new Date(data.birthday).toISOString().split("T")[0]
                : ""
            }
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "birthday")?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-1/3">
          <label htmlFor="sex" className="text-sm font-medium text-gray-500">
            Sex
          </label>
          <select
            id="sex"
            name="sex"
            defaultValue={data?.sex || ""}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "sex")?.message}
            </p>
          )}
        </div>

        {relatedData?.grades && (
          <div className="flex flex-col gap-2 w-1/3">
            <label className="text-xs text-gray-500">Grades</label>
            <select
              name="gradeId"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.gradeId}
            >
              {relatedData.grades.map(
                (grade: { id: number; level: number }) => (
                  <option key={grade.id} value={grade.id} className="p-2">
                    {grade.level}
                  </option>
                )
              )}
            </select>
            {state.error && (
              <p className="text-red-500 text-sm">
                {state.error.find((item) => item.path === "gradeId")?.message}
              </p>
            )}
          </div>
        )}

        {relatedData?.classes && (
          <div className="flex flex-col gap-2 w-1/3">
            <label className="text-xs text-gray-500">Classes</label>
            <select
              name="classId"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.gradeId}
            >
              {relatedData.classes.map(
                (item: {
                  id: number;
                  name: string;
                  capacity: number;
                  _count: { students: number };
                }) => (
                  <option key={item.id} value={item.id} className="p-2">
                    {item.name} - {item._count.students + "/" + item.capacity}{" "}
                    Capacity
                  </option>
                )
              )}
            </select>
            {state.error && (
              <p className="text-red-500 text-sm">
                {state.error.find((item) => item.path === "classId")?.message}
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
