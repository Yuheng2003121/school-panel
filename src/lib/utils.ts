import { auth } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// const { sessionClaims, userId } = await auth();
// export const role = (sessionClaims?.metaData as { role: string })?.role;
// export const currentUserId = userId;

const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);

  //根据当前日期调整到最近的周一：
  if (dayOfWeek === 0) {
    // 周日
    startOfWeek.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) {
    // 周六
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    // 周一至周五
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 4)
  endOfWeek.setHours(23, 59, 59, 999);


  return {startOfWeek, endOfWeek};
};

export const adjustScheduleToCurrentWeek = (lessons: {title: string; start: Date; end: Date}[]) => {
  const {startOfWeek, endOfWeek} = currentWorkWeek()

  return lessons.map(lesson => {
    const lessonDayOfWeek = lesson.start.getDay()

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1

    const adjustedStartDate = new Date(startOfWeek)
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday)
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(), 
      lesson.start.getSeconds(), 
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate
    }
  })
}