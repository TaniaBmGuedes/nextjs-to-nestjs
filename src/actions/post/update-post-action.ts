"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import {
  PublicPostForApiDto,
  PublicPostForApiSchema,
  UpdatePostForApiSchema,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api.-request";
import { getZodErrorMessages } from "@/utils/get-zod-error-msgs";
import { makeRandomString } from "@/utils/make-random-string";
import { revalidateTag } from "next/cache";

type UpdatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData
): Promise<UpdatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

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
  const zodParsedObj = UpdatePostForApiSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: ["Please log in on another tab before saving."],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: PublicPostForApiSchema.parse(formDataToObj),
    };
  }

  const newPost = zodParsedObj.data;

  const updatePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!updatePostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: updatePostResponse.errors,
    };
  }

  const post = updatePostResponse.data;

  revalidateTag("posts", "");
  revalidateTag(`post-${post.slug}`, "");

  return {
    formState: PublicPostForApiSchema.parse(post),
    errors: [],
    success: makeRandomString(),
  };
}
