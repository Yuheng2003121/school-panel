import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getTeachers = async (page: number, query?:Prisma.TeacherWhereInput) => {
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.teacher.count({
      where: query,
    }),
  ]);
  const isLoading = data === undefined;


  return { data, isLoading, count };
}


