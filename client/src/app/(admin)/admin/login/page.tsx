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
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Lock, Shield, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Page() {
  // Retrieve session data from next-auth
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Set up react-hook-form with zod validation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Handle form submission using next-auth signIn function
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("adminCredentials", {
        redirect: false,
        id: values.identifier,
        password: values.password,
      });
      
      if (result?.error) {
        toast.error("Login failed: Invalid credentials");
      } else if (result?.ok) {
        toast.success("Login successful! Redirecting...");
        // You can add redirect logic here if needed
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed: An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-5">
      <main className="max-w-md md:max-w-lg w-full rounded-xl shadow-xl border bg-white/95 p-6 md:p-8 lg:p-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-10 w-10 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-gray-600 text-sm md:text-base">Securely access the restaurant management system</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium">Admin ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Enter your admin ID" 
                        className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        {...field} 
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
                        className="pl-10 py-2 md:py-3 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Admin Sign In</span>
                </>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 text-center">
          <Link
            href="/user/sign-in"
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200 text-sm md:text-base"
          >
            Return to User Login
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Page;
