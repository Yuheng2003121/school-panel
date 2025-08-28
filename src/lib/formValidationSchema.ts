import z from "zod";

export const subjectsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Subject name is required" })
    .max(20, { message: "Username must be less than 20 characters long" }),
  
});



export type SubjectSchema = z.infer<typeof subjectsSchema>;