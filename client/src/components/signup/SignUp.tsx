"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Loader2, Mail, Lock, User, UserCircle, LogIn } from "lucide-react";
import { signUpSchema } from "@/schemas/signUpSchema";
import Link from "next/link";

interface SignUpProps {
  onSubmit: (values: z.infer<typeof signUpSchema>) => void;
  isLoading?: boolean;
  handleGoogleSignIn: () => void;
}

export default function SignUp({ onSubmit, isLoading = false, handleGoogleSignIn }: SignUpProps) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: z.infer<typeof signUpSchema>) {
    onSubmit(values);
  }

  return (
    <main className="max-w-md md:max-w-lg lg:max-w-xl mx-auto w-full rounded-xl shadow-xl border bg-white/95 p-6 md:p-8 lg:p-10 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Create an Account</h1>
        <p className="text-gray-600 text-sm md:text-base">Join us to discover amazing dishes and experiences</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 md:space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base font-medium">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Enter your username"
                      className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base font-medium">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Enter your name"
                      className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base font-medium">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Enter your email"
                      className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      {...field}
                      type="email"
                      disabled={isLoading}
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
                      placeholder="Enter your password"
                      className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      {...field}
                      type="password"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg sm:w-1/2 w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Signing up...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign Up</span>
                  </>
                )}
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg sm:w-1/2 w-full"
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#ffffff" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span>Sign Up with Google</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
      
      <div className="mt-8 text-center">
        <p className="text-sm md:text-base text-gray-600">
          Already have an account?{" "}
          <Link
            href="/user/sign-in"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
