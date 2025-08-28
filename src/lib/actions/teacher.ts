"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../prisma";
import { clerkClient } from "../clerkClient";

const CreateTeacherSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be less than 20 characters long" }),
  email: z
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required" }),
  surname: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().optional(),
  address: z.string(),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(), //[subjectId,...]
});

interface InitialState {
  success: boolean;
  error?:  { path?: string; message: string }[];
}

export const createTeacher = async (
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
   const rawData = {
     username: String(formData.get("username") || ""),
     email: String(formData.get("email") || ""),
     password: String(formData.get("password") || ""),
     name: String(formData.get("name") || ""),
     surname: String(formData.get("surname") || ""),
     phone: String(formData.get("phone") || ""),
     address: String(formData.get("address") || ""),
     birthday: String(formData.get("birthday") || ""),
     bloodType: String(formData.get("bloodType") || ""),
     sex: String(formData.get("sex") || ""),
     img: String(formData.get("img") || ""),
     subjects: formData.getAll("subject") as string[],
   };
   

    // 使用 Zod 验证
    const validatedData = CreateTeacherSchema.parse(rawData);

    const user = await clerkClient.users.createUser({
      username: validatedData.username,
      password: validatedData.password,
      firstName: validatedData.name,
      lastName: validatedData.surname,
      publicMetadata: { role: "teacher" },
      emailAddress: validatedData.email ? [validatedData.email] : undefined,
    });

    
    // 创建科目
    await prisma.teacher.create({
      data: {
        id: user.id,
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        birthday: validatedData.birthday,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        img: validatedData.img || null,
        subjects: {
          connect: validatedData.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    revalidatePath("/list/teachers");
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

export const updateTeacher = async (
  id: string,
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    if(!id) {
      return {...initialState, error: [{message: 'id is required'}]}
    }
    // 从 FormData 提取数据
    const rawData = {
      username: formData.get("username"),
      // email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      birthday: formData.get("birthday"),
      bloodType: formData.get("bloodType"),
      sex: formData.get("sex"),
      img: formData.get("img"),
      subjects: formData.getAll("subject"),
    };
   
    

    // 使用 Zod 验证
    const validatedData = CreateTeacherSchema.parse(rawData);

    await clerkClient.users.updateUser(id,{
      username: validatedData.username,
      ...(validatedData.password !== '' && {password: validatedData.password}),
      firstName: validatedData.name,
      lastName: validatedData.surname,
    });
    
    await prisma.teacher.update({
      where: {
        id: id,
      },
      data: {
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        // email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        birthday: validatedData.birthday,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        img: validatedData.img || null,
        subjects: {
          connect: validatedData.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    revalidatePath("/list/teachers");
    return { ...initialState, success: true };
  } catch (error) {
    console.log(error);
    
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

export const deleteTeacher = async (
  id: number | string
  // initialState: InitialState,
  // formData: FormData
): Promise<InitialState> => {
  try {

    await clerkClient.users.deleteUser(id as string);
  
    await prisma.teacher.delete({
      where: {
        id: id as string,
      },
    });

    revalidatePath("/list/teachers");
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
