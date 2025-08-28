import { PrismaClient } from "@prisma/client";


// 1. 定义一个全局类型，强制转换 `globalThis` 并声明一个 `prisma` 属性
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 2. 导出单例的 Prisma Client
export const prisma = globalForPrisma.prisma || new PrismaClient();

// 3. 开发环境下将实例挂载到全局对象
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
