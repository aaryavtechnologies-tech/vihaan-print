import { getAdminUsers } from "@/features/settings/server/settings-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Settings, Users } from "lucide-react";
import { AdminManagementClient } from "./admin-management-client";
import { ChangePasswordClient } from "./change-password-client";

export const metadata = {
  title: "Settings | VIHAAN ID PRINT",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const admins = await getAdminUsers();

  return (
    <div className="space-y-8 pb-10">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-7 h-7 text-slate-700" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Settings</h1>
        </div>
        <p className="text-slate-500 font-medium">
          Manage administrator accounts and your security preferences.
        </p>
      </div>

      {/* Change own password */}
      <ChangePasswordClient />

      {/* Admin management */}
      <AdminManagementClient
        admins={admins as any}
        currentUserId={session?.user?.id ?? ""}
      />
    </div>
  );
}
