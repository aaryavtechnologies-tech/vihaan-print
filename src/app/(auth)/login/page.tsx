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
    setIsLoading(true);
    try {
      const { data: signInData, error } = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
      } else {
        toast.success("Successfully logged in");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@school.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="rememberMe" 
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal">Remember me for 30 days</Label>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
