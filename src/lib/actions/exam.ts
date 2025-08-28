"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../prisma";
import { clerkClient } from "../clerkClient";
import { getCurrentUser } from "../auth";

const createExamSchema = z.object({
  title: z.string().min(1, { message: "Exam title is required" }),
  startTime: z.coerce.date({ message: "StartTime is required" }),
  endTime: z.coerce.date({ message: "EndTime is required" }),
  lessonId: z.coerce.number({ message: "LessonId is required" }),
});

interface InitialState {
  success: boolean;
  error?: { path?: string; message: string }[];
}

export const createExam = async (
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
    const rawData = {
      title: formData.get("title"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      lessonId: formData.get("lessonId"),
    };

    // 使用 Zod 验证
    const validatedData = createExamSchema.parse(rawData);

    const { currentUserId, role } = await getCurrentUser();

    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: currentUserId!,
          id: validatedData.lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: [
            {
              message: "You are not the teacher of this lesson",
            },
          ],
        };
      }
    }

    // 创建科目
    await prisma.exam.create({
      data: {
        title: validatedData.title,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        lessonId: validatedData.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { ...initialState, success: true };
  } catch (error) {
    // 处理 Zod 验证错误
    if (error instanceof z.ZodError) {
      const errors = error.issues;
      return {
        success: false,
        error: errors.map((error) => ({
          path: error.path[0] as string,
          message: error.message,
        })),
      };
    }

    // 处理其他错误
    return {
      success: false,
      error: [
        {
          message:
            error instanceof Error ? error.message : "Something went wrong",
        },
      ],
    };
  }
};

export const updateExam = async (
  id: number,
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    if (!id) {
      return { ...initialState, error: [{ message: "id is required" }] };
    }
    const rawData = {
      title: formData.get("title"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      lessonId: formData.get("lessonId"),
    };

    // 使用 Zod 验证
    const validatedData = createExamSchema.parse(rawData);

    const { currentUserId, role } = await getCurrentUser();

    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: currentUserId!,
          id: validatedData.lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: [
            {
              message: "You are not the teacher of this lesson",
            },
          ],
        };
      }
    }

    // 创建科目
    await prisma.exam.update({
      where: {
        id: id,
      },
      data: {
        title: validatedData.title,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        lessonId: validatedData.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { ...initialState, success: true };
  } catch (error) {
    // 处理 Zod 验证错误
    if (error instanceof z.ZodError) {
      const errors = error.issues;
      return {
        success: false,
        error: errors.map((error) => ({
          path: error.path[0] as string,
          message: error.message,
        })),
      };
    }

    // 处理其他错误
    return {
      success: false,
      error: [
        {
          message:
            error instanceof Error ? error.message : "Something went wrong",
        },
      ],
    };
  }
};

export const deleteExam = async (
  id: number | string
  // initialState: InitialState,
  // formData: FormData
): Promise<InitialState> => {
  try {
    const { currentUserId, role } = await getCurrentUser();
    await prisma.exam.delete({
      where: {
        id: id as number,
        //如果当前用户是教师，只能删除自己课程的考试
        ...(role === "teacher"
          ? { lesson: { teacherId: currentUserId! } }
          : {}),
      },
    });

    revalidatePath("/list/exams");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: [
        {
          message:
            error instanceof Error ? error.message : "Something went wrong",
        },
      ],
    };
  }
};
