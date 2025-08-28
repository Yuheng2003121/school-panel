"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../prisma";
import { clerkClient } from "../clerkClient";

const CreateStudentSchema = z.object({
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
  gradeId: z.coerce.number().min(1, {message: "Graded is required!"}),
  classId: z.coerce.number().min(1, {message: "Class is required!"}),
  parentId: z.string().min(1, {message: "Parent is required!"}),

});

interface InitialState {
  success: boolean;
  error?:  { path?: string; message: string }[];
}

export const createStudent = async (
  initialState: InitialState,
  formData: FormData
): Promise<InitialState> => {
  try {
    // 从 FormData 提取数据
   const rawData = {
     username: formData.get("username"),
     email: formData.get("email"),
     password: formData.get("password"),
     name: formData.get("name"),
     surname: formData.get("surname"),
     phone: formData.get("phone"),
     address: formData.get("address"),
     birthday: formData.get("birthday"),
     bloodType: formData.get("bloodType"),
     sex: formData.get("sex"),
     img: formData.get("img"),
     gradeId: formData.get("gradeId"),
     classId: formData.get("classId"),
     parentId: formData.get("parentId"),
   };


    // 使用 Zod 验证
    const validatedData = CreateStudentSchema.parse(rawData);

    //先检查class是否有space
    const classItem = await prisma.class.findUnique({
      where: {
        id: validatedData.classId,
      },
      include: {
        _count: {
          select: {students: true}
        }
      }
    });

    if(classItem && classItem?._count.students >= classItem.capacity) {
      return {
        success: false,
        error: [
          {
            message: "Class is full",
          },
        ],
      }
    }

    const user = await clerkClient.users.createUser({
      username: validatedData.username,
      password: validatedData.password,
      firstName: validatedData.name,
      lastName: validatedData.surname,
      publicMetadata: { role: "student" },
      emailAddress: validatedData.email ? [validatedData.email] : undefined,
    });

    
    // 创建科目
    await prisma.student.create({
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
        gradeId: validatedData.gradeId,
        classId: validatedData.classId,
        parentId: validatedData.parentId
      },
    });

    revalidatePath("/list/students");
    return { ...initialState, success: true };
  } catch (error) {
    // console.log(error);
    
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

export const updateStudent = async (
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
      // password: formData.get("password"),
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      birthday: formData.get("birthday"),
      bloodType: formData.get("bloodType"),
      sex: formData.get("sex"),
      img: formData.get("img"),
      gradeId: formData.get("gradeId"),
      classId: formData.get("classId"),
      parentId: formData.get("parentId"),
    };
  //  console.log('rawData', rawData)
    

    // 使用 Zod 验证
    const validatedData = CreateStudentSchema.parse(rawData);

    await clerkClient.users.updateUser(id,{
      username: validatedData.username,
      ...(validatedData.password !== '' && {password: validatedData.password}),
      firstName: validatedData.name,
      lastName: validatedData.surname,
    });
    
    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
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
        gradeId: validatedData.gradeId,
        classId: validatedData.classId,
        parentId: validatedData.parentId,
      },
    });

    revalidatePath("/list/students");
    return { ...initialState, success: true };
  } catch (error) {
    // console.log(error);
    
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

export const deleteStudent= async (
  id: number | string
  // initialState: InitialState,
  // formData: FormData
): Promise<InitialState> => {
  try {
    

    await clerkClient.users.deleteUser(id as string);

    await prisma.student.delete({
      where: {
        id: id as string,
      },
    });

    revalidatePath("/list/students");
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
