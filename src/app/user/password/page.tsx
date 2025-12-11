import { UpdatePasswordForm } from "@/components/admin/UpdatePassword";
import { SpinLoader } from "@/components/SpinLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trocar senha",
};

export default async function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className="mb-16" />}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
