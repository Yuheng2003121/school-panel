import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getAnnouncements = async (page: number, query?: Prisma.AnnouncementWhereInput) => {
  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
       class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.announcement.count({
      where: query,
    }),
  ]);
  const isLoading = data === undefined;

  return { data, isLoading, count };
};


