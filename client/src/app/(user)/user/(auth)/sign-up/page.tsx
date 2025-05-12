// page.tsx (Client-side)
"use client";

import { useState } from "react";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import SignUp from "@/components/signup/SignUp";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { User } from "next-auth";  
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";


// FIXME: All thinks working else verification redirecting after registration
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession(); 
  
  //   assert user is of type User;
  const user: User = session?.user as User;  

  async function handleFormSubmit(values: z.infer<typeof signUpSchema>) {
    try { 
      setIsLoading(true);
      
      // FIXME: apply axios instead of normal fetch

      const response = await axios.post("/api/sign-up", values).then((res) => {

        // console.log("User registered successfully", res.data?.user);
        localStorage.setItem('userInfo', JSON.stringify(values));

        toast("User registered, Verification code sent to your email");
        router.replace(`/user/verify/${res.data?.user?.uid}`);
        return res.data?.user;

      }).catch((err) => {
        console.log("Error logging in, in signup");
        toast("Username or email already exists"); 
      });   
 

      // FIXME: Redirect to verification page or login router.push("/verification-pending");
   
    } catch (error) {
      console.error("Error submitting form", error);
      toast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signIn("google", { callbackUrl: `/user/p` }); 
      
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-[45rem] mx-auto p-6">  
      <SignUp onSubmit={handleFormSubmit} isLoading={isLoading} handleGoogleSignIn={handleGoogleSignIn} />
 
    </div>
  );
}
