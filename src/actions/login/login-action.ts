"use server";
import { LoginSchema } from "@/lib/login/schema";
import { isLoginAllowed } from "@/lib/login/allow-login";
import { apiRequest } from "@/utils/api-request";
import { asyncDelay } from "@/utils/async-delay";
import { getZodErrorMessages } from "@/utils/get-zod-error-msgs";
import { createLoginSessionFromApi } from "@/lib/login/manage-login";
import { redirect } from "next/navigation";

type LoginActionState = {
  email: string;
  errors: string[];
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  if (!isLoginAllowed()) {
    return {
      email: "",
      errors: ["Login not allowed"],
    };
  }

  await asyncDelay(5000);

  if (!(formData instanceof FormData)) {
    return {
      email: "",
      errors: ["Dados inválidos"],
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const formEmail = formObj?.email?.toString() || "";
  const parsedFormData = LoginSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(parsedFormData.error),
    };
  }

  // Fetch
  const loginResponse = await apiRequest<{ accessToken: string }>(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedFormData.data),
    }
  );

  if (!loginResponse.success) {
    return {
      email: formEmail,
      errors: loginResponse.errors,
    };
  }

  const accessToken =
    loginResponse.data?.accessToken ||
    (loginResponse.data as { token?: string })?.token ||
    (loginResponse.data as { access_token?: string })?.access_token ||
    "";

  if (!accessToken) {
    return {
      email: formEmail,
      errors: ["Access token not returned by the API"],
    };
  }

  await createLoginSessionFromApi(accessToken);
  redirect("/admin/post");
}
