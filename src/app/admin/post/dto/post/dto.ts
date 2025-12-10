import { PostModel } from "@/models/post/post-model";

export type PublicPost = Omit<PostModel, "updatedAt">;

export const makePublicPost = (post?: Partial<PostModel>): PublicPost => {
  return {
    id: post?.id || "",
    slug: post?.slug || "",
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    content: post?.content || "",
    coverImageUrl: post?.coverImageUrl || "",
    createdAt: post?.createdAt || "",
    published: post?.published || false,
    alt: post?.alt || "",
  };
};
export const makePublicPostFromDb = (post: PostModel): PublicPost => {
  return makePublicPost(post);
};
