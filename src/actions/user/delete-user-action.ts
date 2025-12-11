"use server";

import { deleteLoginSession } from "@/lib/login/manage-login";
import { getPublicUserFromApi } from "@/lib/user/get-user";
import { authenticatedApiRequest } from "@/utils/authenticated-api.-request";
import { redirect } from "next/navigation";

type DeleteUserActionState = {
  errors: string[];
  success: boolean;
};

export async function deleteUserAction(): Promise<DeleteUserActionState> {
  const user = await getPublicUserFromApi();

  if (!user) {
    await deleteLoginSession();

    return {
      errors: ["You need to log in again"],
      success: false,
    };
  }

  const deleteUserResponse =
    await authenticatedApiRequest<DeleteUserActionState>(`/user/me`, {
      method: "DELETE",
    });

  if (!deleteUserResponse.success) {
    return {
      errors: deleteUserResponse.errors,
      success: false,
    };
  }

  await deleteLoginSession();
  redirect("/");

  // Unreachable, but satisfies the return type for TypeScript
  return {
    errors: [],
    success: true,
  };
}
