"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../prisma";

const CreateClassSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name is required")
    .max(100, "Subject name is too long"),
  capacity: z.coerce.number().min(1, "Capacity is required"),
  gradeId: z.coerce.number().min(1, "Grade is required"),
  supervisorId: z.coerce.string().optional(),
});

interface InitialState {
  success: boolean;
  error?:  { path?: string; message: string }[];
}

export const createClass = async (
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
    const rawData = {
      name: formData.get("name"),
      capacity: formData.get("capacity"),
      gradeId: formData.get("grade"),
      supervisorId: formData.get("supervisor"),
    };

    // 使用 Zod 验证
    const validatedData = CreateClassSchema.parse(rawData);

    // 创建科目
    await prisma.class.create({
      data: validatedData,
    });

    revalidatePath("/list/classes");
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

export const updateClass = async (
  id: number,
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
    const rawData = {
      name: formData.get("name"),
      capacity: formData.get("capacity"),
      gradeId: formData.get("grade"),
      supervisorId: formData.get("supervisor"),
    };
   
    

    // 使用 Zod 验证
    const validatedData = CreateClassSchema.parse(rawData);

    // 创建科目
    await prisma.class.update({
      where: {
        id: id,
      },
      data: validatedData,
    });

    revalidatePath("/list/classes");
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

export const deleteClass = async (
  id: number | string
  // initialState: InitialState,
  // formData: FormData
): Promise<InitialState> => {
  try {
    // 创建科目
    await prisma.class.delete({
      where: {
        id: id as number,
      },
    });

    revalidatePath("/list/classes");
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
