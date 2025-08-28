// @/lib/auth.ts
import { auth } from "@clerk/nextjs/server";
// import { cache } from "react";

export const getCurrentUser = async () => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metaData as { role?: string })?.role || null;
  
  const currentUserId = userId
  return { currentUserId, role };
};
