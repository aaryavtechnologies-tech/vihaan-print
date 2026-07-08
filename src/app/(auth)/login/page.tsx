"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false }
  });

  const onSubmit = async (data: LoginInput) => {
    await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    }, {
      onRequest: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        toast.success("Successfully logged in");
        router.push("/dashboard");
        // We don't set isLoading(false) here because we want the spinner to stay while redirecting
      },
      onError: (ctx) => {
        setIsLoading(false);
        toast.error(ctx.error.message || "Invalid email or password");
      }
    });
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-white dark:bg-slate-950">
      {/* Left side: Branding / Image */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white dark:border-r lg:relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-950 opacity-90 z-0" />
        
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/20 blur-3xl z-0" />
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-3xl z-0" />

        <div className="relative z-10 flex items-center text-lg font-medium">
          <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3 border border-white/30 shadow-sm">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          VIHAAN ID PRINT
        </div>
        
        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed tracking-tight">
              &ldquo;The ultimate enterprise solution for generating, managing, and printing high-quality student ID cards at scale.&rdquo;
            </p>
            <footer className="text-sm text-blue-200 mt-4">
              Secure Admin Portal
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[450px]">
          
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-8 sm:p-10">
            <div className="flex flex-col space-y-3 text-center mb-8">
              <div className="lg:hidden flex justify-center mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your credentials to access the secure admin portal
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@school.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-600 rounded-xl transition-all"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium px-1">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-600 rounded-xl transition-all"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium px-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center space-x-3 pt-1 pb-2">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <Label htmlFor="rememberMe" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  Remember me for 30 days
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-base transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
            
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-semibold tracking-wider">
                  Secure Enterprise Connection
                </span>
              </div>
            </div>
          </div>
          
          <p className="px-8 mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            By accessing this portal, you agree to the{" "}
            <a href="#" className="underline underline-offset-4 hover:text-blue-600 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
