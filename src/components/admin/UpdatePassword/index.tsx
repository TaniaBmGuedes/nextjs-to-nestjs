"use client";

import { updatePasswordAction } from "@/actions/user/update-user-password";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import clsx from "clsx";
import { LockKeyholeIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export function UpdatePasswordForm() {
  const [state, action, isPending] = useActionState(updatePasswordAction, {
    errors: [],
    success: false,
  });

  useEffect(() => {
    toast.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
    }

    if (state.success) {
      toast.success("Updated successfully");
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
          type="password"
          name="currentPassword"
          labelText="Current password"
          placeholder="Your current password"
          disabled={isPending}
          defaultValue={""}
        />

        <InputText
          type="password"
          name="newPassword"
          labelText="New password"
          placeholder="Your new password"
          disabled={isPending}
          defaultValue={""}
        />

        <InputText
          type="password"
          name="newPassword2"
          labelText="Repeat new password"
          placeholder="Repeat your new password"
          disabled={isPending}
          defaultValue={""}
        />

        <div className="flex items-center justify-center mt-4">
          <Button size="md" disabled={isPending} type="submit">
            <LockKeyholeIcon />
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
}
