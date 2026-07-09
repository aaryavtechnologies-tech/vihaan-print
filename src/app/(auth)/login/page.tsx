"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Shield, Zap, Users, IdCard, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
      },
      onError: (ctx) => {
        setIsLoading(false);
        toast.error(ctx.error.message || "Invalid email or password");
      }
    });
  };

  const stats = [
    { icon: Users, value: "14,230+", label: "Students Managed" },
    { icon: IdCard, value: "12,450+", label: "IDs Generated" },
    { icon: Zap, value: "99.9%", label: "Uptime Reliability" },
  ];

  return (
    <div className="w-full min-h-screen flex bg-slate-950">
      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        {/* Animated background glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/25 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Top logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight">VIHAAN ID PRINT</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">All systems operational</span>
            </div>
          </div>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 flex-1 flex flex-col justify-center max-w-lg"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-sm text-blue-300 font-medium mb-8 w-fit">
            <Shield className="h-4 w-4" />
            Enterprise-Grade Security
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            The smartest way to manage{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              student ID cards
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            Generate, manage, and print professional ID cards for thousands of students across multiple schools — all from one powerful dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/8 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10 border-t border-white/10 pt-8"
        >
          <p className="text-slate-400 text-sm italic leading-relaxed">
            &ldquo;VIHAAN ID PRINT revolutionized our admission season. We generated over 2,000 ID cards in a single afternoon.&rdquo;
          </p>
          <p className="text-slate-500 text-xs mt-2 font-medium">— Dr. Rajesh Kumar, Principal, Delhi Public School</p>
        </motion.div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle glow behind card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">VIHAAN ID PRINT</span>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Secure Admin Portal</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 group-focus-within:text-blue-400 transition-colors h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@school.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 focus-visible:border-blue-500/50 focus-visible:bg-white/8 rounded-xl transition-all"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 font-medium px-1">{errors.email.message}</p>}
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                  <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className="pl-10 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 focus-visible:border-blue-500/50 focus-visible:bg-white/8 rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 font-medium px-1">{errors.password.message}</p>}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-500"
                />
                <Label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer select-none">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold text-base transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
            
            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-600 font-medium uppercase tracking-widest">Secured</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Security badges */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                <Shield className="h-3.5 w-3.5" />
                <span>SSL Encrypted</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                <Zap className="h-3.5 w-3.5" />
                <span>Enterprise Grade</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                <Lock className="h-3.5 w-3.5" />
                <span>2FA Ready</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600">
            By accessing this portal, you agree to our{" "}
            <a href="#" className="text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
