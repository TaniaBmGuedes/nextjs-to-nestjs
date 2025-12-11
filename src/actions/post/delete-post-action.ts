"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import { PublicPostForApiDto } from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api.-request";
import { revalidateTag } from "next/cache";

export async function deletePostAction(id: string) {
  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    return {
      error: "Please log in again in another tab",
    };
  }

  if (!id || typeof id !== "string") {
    return {
      error: "Invalid data",
    };
  }

  const postResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!postResponse.success) {
    return {
      error: "Error finding the post",
    };
  }

  const deletePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!deletePostResponse.success) {
    return {
      error: "Error deleting the post",
    };
  }

  revalidateTag("posts", "");
  revalidateTag(`post-${postResponse.data.slug}`, "");

  return {
    error: "",
  };
}
