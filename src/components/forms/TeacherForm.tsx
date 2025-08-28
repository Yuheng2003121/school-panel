"use client";

import React, { useActionState, useEffect } from "react";
import { createTeacher, updateTeacher } from "@/lib/actions/teacher";
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

export default function TeacherForm({
  type,
  data,
  setOpen,
  relatedData,
}: FormProps) {
  const [image, setImage] = React.useState<string | null>(null);
  const [state, action, pending] = useActionState(
    type === "create" ? createTeacher : updateTeacher.bind(null, data?.id),
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
          ? "Teacher created successfully"
          : "Teacher updated successfully"
      );
      setOpen(false);
    }
  }, [state, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" action={action}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Teacher" : "Update the Teacher"}
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
            />
            {state.error && (
              <p className="text-red-500 text-sm">
                {state.error.find((item) => item.path === "email")?.message}
              </p>
            )}
          </div>
        )}

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
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="flex flex-wrap justify-between items-center gap-4">
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

        <div className="flex flex-col gap-2">
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

        {/* <div className="flex flex-col gap-2">
          <label htmlFor="img" className="text-sm font-medium text-gray-500">
            Image URL
          </label>
          <input
            type="url"
            id="img"
            name="img"
            defaultValue={data?.img}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "img")?.message}
            </p>
          )}
        </div> */}
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4 items-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src={"/upload.png"} alt="upload" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input id="img" type="file" className="hidden" />
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "img")?.message}
            </p>
          )}
        </div> */}

        <div className="flex flex-col gap-2 items-center relative">
          <input type="hidden" name="img" value={image || ""}></input>
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
              {/* 删除按钮 */}
              <X
                className="absolute -top-2 -right-2  cursor-pointer hidden group-hover:block"
                onClick={() => setImage("")}
              />
            </div>
          )}
        </div>
      </div>

      {relatedData?.subjects && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Subjects</label>
          <select
            name="subject"
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={
              data?.subjects?.map((s) => s.id) || []
            }
          >
            {relatedData.subjects.map(
              (subject: { id: number; name: string }) => (
                <option key={subject.id} value={subject.id} className="p-2">
                  {subject.name}
                </option>
              )
            )}
          </select>
          {state.error && (
            <p className="text-red-500 text-sm">
              {state.error.find((item) => item.path === "subject")?.message}
            </p>
          )}
        </div>
      )}

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
