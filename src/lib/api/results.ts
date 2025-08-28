import { Prisma } from "@prisma/client";
import { prisma } from "../prisma"
import { ITEM_PER_PAGE } from "../setting";

export const getResults = async (page: number, query?: Prisma.ResultWhereInput) => {
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: {select:{name: true, surname: true}},
        exam: {
          include: {
            lesson: {
              select: {
                class: {select: {name: true}},
                teacher: {select: {name: true, surname: true}}
              }
            }
          }
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: {select: {name: true}},
                teacher: {select: {name: true, surname: true}}
              }
            }
          }
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataRes.map(item => {
    const assessment = item.assignment || item.exam;
    if(!assessment) return null;

    const isExam = 'startTime' in assessment;
    return {
      id: item.id,
      title: assessment.title,
      score: item.score,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      subjectName: assessment.lesson.class.name,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
      
    }
  })
  const isLoading = data === undefined;

  return { data, isLoading, count };
};


