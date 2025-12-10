"use client";

import { loginAction } from "@/actions/login/login-action";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import clsx from "clsx";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export function LoginForm() {
  const initialState = {
    username: "",
    error: "",
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast.dismiss();
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        "text-center max-w-sm mt-16 mb-32 mx-auto"
      )}
    >
      <form action={action} className="flex-1 flex flex-col gap-6">
        <InputText
          type="text"
          name="username"
          labelText="Username"
          placeholder="Your username"
          disabled={isPending}
          defaultValue={state.username}
        />

        <InputText
          type="password"
          name="password"
          labelText="Password"
          placeholder="Your password"
          disabled={isPending}
        />

        <Button type="submit" className="mt-4" disabled={isPending}>
          <LogInIcon />
          Log In
        </Button>
        <p className="text-sm/tight">
          <Link href="/user/new">Create my account</Link>
        </p>

        {!!state.error && <p className="text-red-600">{state.error}</p>}
      </form>
    </div>
  );
}
