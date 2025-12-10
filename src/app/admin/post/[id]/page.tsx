import { ManagePostForm } from "@/components/admin/ManagePostForm";
import { findPostByIdAdmin } from "@/lib/post/queries/admin";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { makePublicPostFromDb } from "../dto/post/dto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Post",
};

type AdminPostIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminPostIdPage({
  params,
}: AdminPostIdPageProps) {
  const { id } = await params;
  const post = await findPostByIdAdmin(id).catch(() => undefined);

  if (!post) notFound();

  const publicPost = makePublicPostFromDb(post);

  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-extrabold">Edit Form </h1>
        <ManagePostForm mode="update" publicPost={publicPost} />
      </div>
    </>
  );
}
