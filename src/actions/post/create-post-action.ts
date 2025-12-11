"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import {
  CreatePostForApiSchema,
  PublicPostForApiDto,
  PublicPostForApiSchema,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api.-request";
import { getZodErrorMessages } from "@/utils/get-zod-error-msgs";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

type CreatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData
): Promise<CreatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ["Invalid data"],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = CreatePostForApiSchema.safeParse(formDataToObj);

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

  const createPostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    }
  );

  if (!createPostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: createPostResponse.errors,
    };
  }

  const createdPost = createPostResponse.data;

  revalidateTag("posts", "");
  redirect(`/admin/post/${createdPost.id}?created=1`);
}
