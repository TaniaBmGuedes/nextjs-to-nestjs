import { ManagePostForm } from "@/components/admin/ManagePostForm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Post",
};

export default async function AdminPostNewPage() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-extrabold">Create Form </h1>
        <ManagePostForm mode="create" />
      </div>
    </>
  );
}
