"use client";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { useRouter } from "next/navigation";
import React from "react";

interface PaginationProps {
  count: number;
  page: number;
}
export default function Pagination({ count, page }: PaginationProps) {
  const router = useRouter();
  const changePage = (newPage: string) => {
    // 跳转时保留已有的searchParams
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage);
    router.push(`${window.location.pathname}/?${params}`);
  };

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibol disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(String(page - 1))}
      >
        prev
      </button>

      <div className="flex gap-2 items-center">
        {Array.from(
          { length: Math.ceil(count / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                className={`px-2 rounded-md  text-sm ${
                  page === pageIndex && "bg-mySky"
                }`}
                key={pageIndex}
                onClick={() => changePage(String(pageIndex))}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>

      <button
        disabled={!hasNext}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibol disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(String(page + 1))}
      >
        next
      </button>
    </div>
  );
}
