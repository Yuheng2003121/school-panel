import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getSubjects = async (page: number, query?: Prisma.SubjectWhereInput) => {
  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.subject.count({
      where: query,
    }),
  ]);
  const isLoading = data === undefined;

  return { data, isLoading, count };
};


