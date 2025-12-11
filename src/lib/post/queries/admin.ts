import { PostModelFromApi } from "@/models/post/post-model";
import { postRepository } from "@/repositories/post";
import { apiRequest } from "@/utils/api-request";
import { authenticatedApiRequest } from "@/utils/authenticated-api.-request";
import { cache } from "react";

export const findPostByIdAdmin = cache(async (id: string) => {
  return postRepository.findById(id);
});

export const findAllPostsAdmin = cache(async () => {
  return postRepository.findAll();
});

export const findPostByIdFromApiAdmin = cache(async (id: string) => {
  const postsResponse = await authenticatedApiRequest<PostModelFromApi>(
    `/post/me/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  return postsResponse;
});

export const findAllPostFromApiAdmin = cache(async () => {
  const postsResponse = await authenticatedApiRequest<PostModelFromApi[]>(
    `/post/me/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  return postsResponse;
});
export const findAllPublicPostsFromApiCached = cache(async () => {
  const postsResponse = await apiRequest<PostModelFromApi[]>(`/post`, {
    next: {
      tags: ["posts"],
      revalidate: 86400,
    },
  });

  return postsResponse;
});

export const findPublicPostBySlugFromApiCached = cache(async (slug: string) => {
  const postsResponse = await apiRequest<PostModelFromApi>(`/post/${slug}`, {
    next: {
      tags: [`post-${slug}`],
      revalidate: 86400,
    },
  });

  return postsResponse;
});
