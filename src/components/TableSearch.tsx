"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function TableSearch() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null); 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;

    const params = new URLSearchParams(window.location.search);
    params.set("search", searchValue);
    params.set("page", "1"); //重置页码
    router.push(`${window.location.pathname}/?${params}`);

    //清空表单
    formRef?.current?.reset();
  };
  return (
    <form
      className="w-full md:w-auto flex items-center gap-2 border-[1.5px] text-xs border-gray-300 rounded-full p-2"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <Image src={"/search.png"} alt="search" width={14} height={14} />
      <input
        name="search"
        type="text"
        placeholder="Search.."
        className="outline-none min-w-[200px]"
      />
    </form>
  );
}
