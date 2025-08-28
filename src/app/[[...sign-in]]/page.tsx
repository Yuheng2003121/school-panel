"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  // return <SignIn />;
  const {isLoaded, isSignedIn, user} = useUser()
  
  
  const router = useRouter()
  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-mySkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-3"
        >
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            School
          </h1>
          <h2 className="text-gray-400">Sign in to your accound</h2>

          <Clerk.GlobalError className="text-sm text-red-400" />

          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username or Email address
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 w-[270px]"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <SignIn.Action submit className="bg-blue-500 text-white my-1 rounded-md text-sm py-2" >Sign In</SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
