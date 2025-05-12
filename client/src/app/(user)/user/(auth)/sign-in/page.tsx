"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getUser } from "@/helpers/getUser";
import axiosInstance from "@/lib/axios";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, LogIn, UserCog } from "lucide-react";
import { User } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function Page() {
  // Retrieve session data from next-auth
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: user } = useSession();

  // Set up react-hook-form with zod validation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Handle form submission using next-auth signIn function
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      console.error("result", result.error);
      toast(result.error);
      setIsSubmitting(false);
    }
    if (result?.ok) {
      localStorage.removeItem("userInfo");
      toast("Login successful");
      setIsSubmitting(false);
      router.replace(`/user/p`);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/user/p" });
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-5">
      <main className="max-w-md md:max-w-lg w-full rounded-xl shadow-xl border bg-white/95 p-6 md:p-8 lg:p-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm md:text-base">Sign in to continue your culinary journey</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        type="email"
                        className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                        className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                  </>
                )}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#ffffff" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span>Sign In with Google</span>
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm md:text-base text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/user/sign-up"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
          
          <div className="pt-2 border-t border-gray-200">
            <Button 
              onClick={handleAdminLogin}
              variant="outline" 
              className="mt-4 text-gray-700 border-gray-300 hover:bg-gray-100 transition-all duration-200"
            >
              <UserCog className="mr-2 h-4 w-4" />
              <span>Admin Login</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
