"use server";

import { makePublicPost, PublicPost } from "@/app/admin/post/dto/post/dto";
import { verifyLoginSession } from "@/lib/login/manage-login";
import { PostCreateSchema } from "@/lib/post/validation";
import { PostModel } from "@/models/post/post-model";
import { postRepository } from "@/repositories/post";
import { getZodErrorMessages } from "@/utils/get-zod-error-msgs";
import { makeSlugFromText } from "@/utils/make.slug-from-text";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

type CreatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData
): Promise<CreatePostActionState> {
  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ["Invalid data"],
    };
  }
  const isAuthenticated = await verifyLoginSession();

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostCreateSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: makePublicPost(formDataToObj),
      errors: ["Do login again before save"],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);

    const mergedFormState = makePublicPost({
      ...prevState.formState,
      ...formDataToObj,
      published:
        formDataToObj.published === "on" || formDataToObj.published === "true",
      alt:
        (typeof formDataToObj.title === "string" && formDataToObj.title) ||
        prevState.formState.alt,
    });

    return {
      errors,
      formState: mergedFormState,
    };
  }

  const validPostData = zodParsedObj.data;
  const normalizedCoverImageUrl = (() => {
    const coverImageUrl = String(validPostData.coverImageUrl || "");
    if (coverImageUrl.startsWith("/")) return coverImageUrl;

    try {
      const parsed = new URL(coverImageUrl);
      if (["localhost", "127.0.0.1"].includes(parsed.hostname)) {
        return parsed.pathname || coverImageUrl;
      }
      return coverImageUrl;
    } catch (error) {
      console.log("error in image:", error);
      return coverImageUrl;
    }
  })();

  const newPost: PostModel = {
    ...validPostData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidV4(),
    slug: makeSlugFromText(validPostData.title),
    alt: validPostData.title,
    coverImageUrl: normalizedCoverImageUrl,
  };

  try {
    await postRepository.createPost(newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: newPost,
        errors: [e.message],
      };
    }

    return {
      formState: newPost,
      errors: ["Unkwon error"],
    };
  }

  revalidateTag("posts", "");
  redirect(`/admin/post/${newPost.id}?created=1`);
}
