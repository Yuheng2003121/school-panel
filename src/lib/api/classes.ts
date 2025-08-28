import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getClasses = async (page: number, query?: Prisma.ClassWhereInput) => {
  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.class.count({
      where: query,
    }),
  ]);
  const isLoading = data === undefined;

  return { data, isLoading, count };
};


