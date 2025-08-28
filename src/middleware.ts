import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/setting";
import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher(["/admin", "/teacher"]);
// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect(); //这里会跳转到NEXT_PUBLIC_CLERK_SIGN_IN_URL
// });

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher(route),
  allowedRoles: routeAccessMap[route],
}));


// Clerk 中间件主逻辑
export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  //需要在Clerk User的Metadata,  还有session中配置role属性
  const role = (sessionClaims?.metaData as { role?: string })?.role;

  // 遍历所有路由规则进行权限校验
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`${role}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
