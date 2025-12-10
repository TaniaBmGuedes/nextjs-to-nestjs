"use server";

import { drizzleDb } from "@/db/drizzle";
import { postsTable } from "@/db/drizzle/schema";
import { verifyLoginSession } from "@/lib/login/manage-login";
import { postRepository } from "@/repositories/post";
import { asyncDelay } from "@/utils/async-delay";
import { logColor } from "@/utils/log-color";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function deletePostAction(id: string) {
  //TODO: check user login
  await asyncDelay(2000);
  logColor(String(id));

  if (!id || typeof id !== "string") {
    return {
      error: "Invalid data",
    };
  }
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      error: "Do login again in another tab",
    };
  }

  const post = await postRepository.findById(id).catch(() => undefined);

  if (!post) {
    return {
      error: "This post does not exist",
    };
  }

  try {
    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }

  revalidateTag("posts", "");
  revalidateTag(`post-${post.slug}`, "");

  return {
    error: "",
  };
}
