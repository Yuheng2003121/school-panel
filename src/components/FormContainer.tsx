import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";
import { getCurrentUser } from "@/lib/auth";

export type FormModalProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  id?: number | string;
};

export default async function FormContainer({
  table,
  type,
  data,
  id,
}: FormModalProps) {
  let relatedData = {};
  if(type !== 'delete') {
    switch (table) {
      case 'subject':
        const subjectTeachers = await prisma.teacher.findMany({
          select: {id: true, name: true, surname: true}
        })
        relatedData = { teachers: subjectTeachers };
        break;
      
      case 'class':
        const classGrades = await prisma.grade.findMany({
          select: {id: true, level: true}
        })
        const teachers = await prisma.teacher.findMany({
          select: {id: true, name: true, surname: true}
        })
        relatedData = { grades: classGrades, teachers: teachers };
        break;
      
      case "teacher": 
        const teacherSubjects = await prisma.subject.findMany({
          select: {id: true, name: true}
        })
        relatedData = {subjects: teacherSubjects}
        break;

      case "student": 
        const studentGrades = await prisma.grade.findMany({
          select: {id: true, level: true}
        });
        const studentClasses = await prisma.class.findMany({
          include: {_count: {select: {students: true}}}
        })

        relatedData = { classes: studentClasses, grades: studentGrades };
        break;

      case "exam": 
        const {currentUserId, role} = await getCurrentUser()
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === 'teacher' ? {teacherId: currentUserId!}: {})
          },
          select: {id: true, name: true}
        })
        relatedData = {lessons: examLessons}
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData}/>
    </div>
  );
}
