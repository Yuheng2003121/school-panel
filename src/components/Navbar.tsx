import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";

export default async function Navbar() {
   const user = await currentUser();
   
  return (
    <div className="flex items-center justify-between p-4">
      {/* search bar */}
      <div className="hidden md:flex items-center gap-2 border-[1.5px] text-xs border-gray-300 rounded-full p-2">
        <Image src={"/search.png"} alt="search" width={14} height={14} />
        <input type="text" placeholder="Search.." className="outline-none w-[200px]" />
      </div>

      {/* icons and users */}
      <div className="flex ml-auto items-center gap-6">
        <div className="bg-white rounded-full size-8 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="message" width={20} height={20}/>
        </div>
        <div className="relative bg-white rounded-full size-8 flex items-center justify-center cursor-pointer">
          <Image src="/announcement.png" alt="message" width={20} height={20}/>
          <div className="absolute -top-3 -right-2 bg-purple-500 rounded-full size-5 text-xs flex items-center justify-center text-white">1</div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-xs text-gray-500">{user?.publicMetadata.role as string}</span>
        </div>

        <div className="size-9 relative">
          {/* <Image src="/avatar.png" alt="avatar" fill className="rounded-full"/> */}
          <UserButton/>
        </div>
      </div>

    </div>
  );
}
