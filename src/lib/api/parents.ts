import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getParents = async (page: number, query?: Prisma.ParentWhereInput) => {
  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.parent.count({
      where: query,
    }),
  ]);
  const isLoading = data === undefined;

  return { data, isLoading, count };
};


