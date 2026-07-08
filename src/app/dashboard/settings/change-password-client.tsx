"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Key, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({ defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  const newPwd = watch("newPassword");

  const pwdStrength = (p: string) => {
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-400", w: "25%" };
    if (score === 2) return { label: "Fair", color: "bg-amber-400", w: "50%" };
    if (score === 3) return { label: "Good", color: "bg-blue-400", w: "75%" };
    return { label: "Strong", color: "bg-emerald-500", w: "100%" };
  };
  const strength = pwdStrength(newPwd);

  const onSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      // @ts-ignore
      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password updated successfully!");
        reset();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-500" />
          Change Your Password
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Update your own account password. You will remain logged in on this device.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-w-md">
        {/* Current Password */}
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              placeholder="Your current password"
              className="pr-10 rounded-xl border-slate-200"
              {...register("currentPassword", { required: "Current password is required" })}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowCurrent(p => !p)}>
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="pr-10 rounded-xl border-slate-200"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowNew(p => !p)}>
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {strength && (
            <div className="mt-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.w }} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Strength: <span className="font-medium">{strength.label}</span></p>
            </div>
          )}
          {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat new password"
            className="rounded-xl border-slate-200"
            {...register("confirmPassword", { required: "Please confirm new password" })}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          id="save-password-btn"
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20"
        >
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><ShieldCheck className="w-4 h-4 mr-2" /> Save Password</>}
        </Button>
      </form>
    </div>
  );
}
