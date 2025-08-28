import FormContainer from '@/components/FormContainer';
import FormModal from '@/components/FormModal';
import { getCurrentUser } from '@/lib/auth';
import { Student, Teacher } from '@prisma/client';
import Image from 'next/image'
import React from 'react'

export default async function SmallUserCard({
  data,
}: {
  data:
    | (Teacher & {
        _count: { subjects: number; classes: number; lessons: number };
      })
    | Student;
}) {
  const { role } = await getCurrentUser();
  return (
    <div className=" bg-mySky py-6 px-3 rounded-md flex gap-4">
      {/* user image */}
      <div className="w-1.2/3">
        <Image
          src={data.img || "/noAvatar.png"}
          alt="user"
          width={148}
          height={148}
          className="size-37 rounded-full object-cover"
        />
      </div>

      {/* user info */}
      <div className="flex-1 flex flex-col gap-2 ">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">
            {data.name + " " + data.surname}
          </h1>
          {role === "admin" && (
            <FormContainer table="teacher" type="update" data={data} />
          )}
        </div>
        <p className="text-sm text-gray-500">better tide fell </p>
        <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap font-medium">
          <div className="flex gap-2 items-center w-full md:w-1/3 lg:w-full ">
            <Image src={"/blood.png"} alt="blood" width={14} height={14} />
            <span className="text-sm">{data.bloodType}</span>
          </div>
          <div className="flex gap-2 items-center w-full md:w-1/3 lg:w-full ">
            <Image src={"/date.png"} alt="blood" width={14} height={14} />
            <span className="text-sm">
              {data.birthday.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex gap-2 items-center w-full md:w-1/3 lg:w-full ">
            <Image src={"/mail.png"} alt="blood" width={14} height={14} />
            <span className="text-sm">{data.email || '-'}</span>
          </div>
          <div className="flex gap-2 items-center w-full md:w-1/3 lg:w-full ">
            <Image src={"/phone.png"} alt="blood" width={14} height={14} />
            <span className="text-sm ">{data.phone || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
