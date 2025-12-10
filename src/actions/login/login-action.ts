"use server";

import { asyncDelay } from "@/utils/async-delay";
import { createLoginSession, verifyPassword } from "@/lib/login/manage-login";
import { redirect } from "next/navigation";

type LoginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const allowLoginEnv = (process.env.ALLOW_LOGIN ?? "").trim().toLowerCase();
  const allowLogin =
    allowLoginEnv === "" || allowLoginEnv === "1" || allowLoginEnv === "true";

  if (!allowLogin) {
    return {
      username: "",
      error: "Login not allowed",
    };
  }
  await asyncDelay(5000); // Vou manter

  if (!(formData instanceof FormData)) {
    return {
      username: "",
      error: "Invalid data",
    };
  }

  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!username || !password) {
    return {
      username,
      error: "Please provide username and password",
    };
  }

  const envUsername = (process.env["LOGIN_USER"] || "belele").trim();
  const envPasswordValue = (process.env["LOGIN_PASSWORD"] || "belele").trim();

  const isUsernameValid = username === envUsername;
  const isPasswordValid =
    (await verifyPassword(password, envPasswordValue).catch(() => false)) ||
    password === envPasswordValue;

  if (!isUsernameValid || !isPasswordValid) {
    return {
      username,
      error: "Invalid credentials",
    };
  }

  await createLoginSession(username);
  redirect("/admin/post");
}
