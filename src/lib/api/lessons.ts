import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getLessons = async (page: number, query?: Prisma.LessonWhereInput) => {
  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        teacher: { select: { name: true, surname: true } },
        subject: { select: { name: true } },
        class: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.lesson.count({
      where: query,
    }),
  ]);
  const isLoading = data === undefined;

  return { data, isLoading, count };
};


