"use server";

import { makePublicPost, PublicPost } from "@/app/admin/post/dto/post/dto";
import { PostUpdateSchema } from "@/lib/post/validation";
import { postRepository } from "@/repositories/post";
import { getZodErrorMessages } from "@/utils/get-zod-error-msgs";
import { PostModel } from "@/models/post/post-model";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { makeRandomString } from "@/utils/make-random-string";
import { verifyLoginSession } from "@/lib/login/manage-login";

type UpdatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData
): Promise<UpdatePostActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ["Invalid data"],
    };
  }

  const id = formData.get("id")?.toString() || "";

  if (!id || typeof id !== "string") {
    return {
      formState: prevState.formState,
      errors: ["Invalid ID"],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostUpdateSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: makePublicPost(formDataToObj),
      errors: ["Do login before save in another tab."],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePublicPost(formDataToObj),
    };
  }

  const validPostData = zodParsedObj.data;
  const newPost = {
    ...validPostData,
    alt: validPostData.title,
  };

  let post: PostModel | undefined;
  try {
    post = await postRepository.updatePost(id, newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePublicPost(formDataToObj),
        errors: [e.message],
      };
    }

    return {
      formState: makePublicPost(formDataToObj),
      errors: ["Unknow error"],
    };
  }

  if (!post) {
    return {
      formState: makePublicPost(formDataToObj),
      errors: ["Unknow error"],
    };
  }

  revalidateTag("posts", "");
  revalidateTag(`post-${post.slug}`, "");

  redirect("/admin/post");

  return {
    formState: makePublicPost(post),
    errors: [],
    success: makeRandomString(),
  };
}
