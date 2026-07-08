"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  UserPlus,
  Trash2,
  Loader2,
  AlertTriangle,
  Shield,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminUser, deleteAdminUser } from "@/features/settings/server/settings-actions";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  image: string | null;
};

interface AdminManagementClientProps {
  admins: AdminUser[];
  currentUserId: string;
}

export function AdminManagementClient({ admins: initial, currentUserId }: AdminManagementClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [admins, setAdmins] = useState(initial);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<{
    name: string; email: string; password: string; confirmPassword: string;
  }>({ defaultValues: { name: "", email: "", password: "", confirmPassword: "" } });

  const pwd = watch("password");

  const onSubmit = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsCreating(true);
    const result = await createAdminUser({ name: data.name, email: data.email, password: data.password });
    setIsCreating(false);
    if (result.success) {
      toast.success("Admin user created successfully!");
      reset();
      startTransition(() => router.refresh());
    } else {
      toast.error(result.error || "Failed to create admin");
    }
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteAdminUser(id);
      if (result.success) {
        toast.success("Admin user removed.");
        setAdmins(prev => prev.filter(a => a.id !== id));
        setDeleteConfirm(null);
      } else {
        toast.error(result.error || "Failed to remove user.");
      }
    });
  };

  const roleColor = (role: string) =>
    role === "SUPER_ADMIN"
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : "bg-blue-100 text-blue-700 border-blue-200";

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

  const strength = pwdStrength(pwd);

  return (
    <div className="space-y-8">
      {/* Create new admin */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Create New Admin
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add a new administrator to the system. They will be able to log in immediately.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="admin-name"
                placeholder="e.g. Rajesh Sharma"
                className="pl-9 rounded-xl border-slate-200"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@school.edu"
                className="pl-9 rounded-xl border-slate-200"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="pl-9 pr-10 rounded-xl border-slate-200"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="admin-confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                className="pl-9 pr-10 rounded-xl border-slate-200"
                {...register("confirmPassword", { required: "Please confirm password" })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirm(p => !p)}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Button
              id="create-admin-btn"
              type="submit"
              disabled={isCreating}
              className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20"
            >
              {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : <><UserPlus className="w-4 h-4 mr-2" /> Create Admin</>}
            </Button>
          </div>
        </form>
      </div>

      {/* Admin list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Admin Users ({admins.length})
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {admins.map((admin) => {
            const isSelf = admin.id === currentUserId;
            return (
              <div key={admin.id} className="flex items-center gap-4 px-6 py-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {admin.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800 truncate">{admin.name}</p>
                    {isSelf && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">You</span>
                    )}
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${roleColor(admin.role)}`}>
                      {admin.role === "SUPER_ADMIN" && <Crown className="w-3 h-3" />}
                      {admin.role.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{admin.email}</p>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block flex-shrink-0">
                  Added {new Date(admin.createdAt).toLocaleDateString()}
                </p>
                {!isSelf && admin.role !== "SUPER_ADMIN" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                    onClick={() => setDeleteConfirm(admin.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Remove Admin?</h3>
                <p className="text-sm text-slate-500 mt-0.5">This admin will lose all access to the system immediately.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <Button variant="outline" className="rounded-xl" onClick={() => setDeleteConfirm(null)} disabled={isPending}>Cancel</Button>
              <Button variant="destructive" className="rounded-xl" disabled={isPending} onClick={() => handleDelete(deleteConfirm)}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove Admin"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
