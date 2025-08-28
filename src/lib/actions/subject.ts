// "use server"

// import { revalidatePath } from "next/cache";
// import { CreateSubjectSchema } from "./formValidationSchema";
// import { prisma } from "./prisma";

// interface InitialState {
//   success: boolean;
//   error: string;
// }

// //这里data已经是校验过的
// export const createSubject = async (
//   initialState: InitialState,
//   data: CreateSubjectSchema,
// ): Promise<InitialState> => {
//   try {
//     await prisma.subject.create({
//       data: {
//         name: data.name,
//       },
//     });
//     revalidatePath("/");
//     return { ...initialState, success: true };
//   } catch (error) {
//     return {
//       ...initialState,
//       error: error instanceof Error ? error.message : "Something went wrong",
//       success: false,
//     };
//   }
// };

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../prisma";

// Zod 验证 schema
const CreateSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name is required")
    .max(100, "Subject name is too long"),
});

interface InitialState {
  success: boolean;
  error: string;
}

export const createSubject = async (
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
    const rawData = {
      name: formData.get("name") as string,
      teachers: formData.getAll("teachers") as string[],
    };

    // 使用 Zod 验证
    const validatedData = CreateSubjectSchema.parse(rawData);

    // 创建科目
    await prisma.subject.create({
      data: {
        name: validatedData.name,
        teachers: {
          connect: rawData.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/");
    return { success: true, error: "" };
  } catch (error) {
    // 处理 Zod 验证错误
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Validation failed",
      };
    }

    // 处理其他错误
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const updateSubject = async (
  id: number,
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
    const rawData = {
      name: formData.get("name") as string,
      teachers: formData.getAll("teachers") as string[],
    };

    // 使用 Zod 验证
    const validatedData = CreateSubjectSchema.parse(rawData);

    // 创建科目
    await prisma.subject.update({
      where: {
        id: id,
      },
      data: {
        name: validatedData.name,
        teachers: {
          set: rawData.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/");
    return { success: true, error: "" };
  } catch (error) {
    // 处理 Zod 验证错误
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Validation failed",
      };
    }

    // 处理其他错误
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const deleteSubject = async (
  id: number | string
  // initialState: InitialState,
  // formData: FormData
): Promise<InitialState> => {
  try {
    // 创建科目
    await prisma.subject.delete({
      where: {
        id: id as number,
      },
    });

    revalidatePath("/");
    return { success: true, error: "" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
