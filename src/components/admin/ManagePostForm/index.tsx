"use client";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useActionState, useEffect, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { createPostAction } from "@/actions/post/create-post-action";
import { toast } from "react-toastify";
import { updatePostAction } from "@/actions/post/update-post-action";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PublicPostForApiDto,
  PublicPostForApiSchema,
} from "@/lib/post/schemas";
import { InputCheckbox } from "@/components/InputChecbox";

type ManagePostFormUpdateProps = {
  mode: "update";
  publicPost: PublicPostForApiDto;
};

type ManagePostFormCreateProps = {
  mode: "create";
};

type ManagePostFormProps =
  | ManagePostFormUpdateProps
  | ManagePostFormCreateProps;

export function ManagePostForm(props: ManagePostFormProps) {
  const { mode } = props;
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const router = useRouter();

  let publicPost;
  if (mode === "update") {
    publicPost = props.publicPost;
  }

  const actionsMap = {
    update: updatePostAction,
    create: createPostAction,
  };

  const initialState = {
    formState: PublicPostForApiSchema.parse(publicPost || {}),
    errors: [],
  };
  const [state, action, isPending] = useActionState(
    actionsMap[mode],
    initialState
  );

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach((error) => toast.error(error));
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.success) {
      toast.dismiss();
      toast.success("Post updated successfully!");
    }
  }, [state.success]);

  useEffect(() => {
    if (created === "1") {
      toast.dismiss();
      toast.success("Post created successfully!");
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.toString());
    }
  }, [created, router]);

  const { formState } = state;
  const [contentValue, setContentValue] = useState(publicPost?.content || "");

  return (
    <form action={action} className="mb-16">
      <div className="flex flex-col gap-6">
        <InputText
          labelText="ID"
          name="id"
          placeholder="ID generated automatically"
          type="text"
          defaultValue={formState.id}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText="Slug"
          name="slug"
          placeholder="Slug generated automatically"
          type="text"
          defaultValue={formState.slug}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText="Title"
          name="title"
          placeholder="Enter the title"
          type="text"
          defaultValue={formState.title}
          disabled={isPending}
        />

        <InputText
          labelText="Excerpt"
          name="excerpt"
          placeholder="Enter the summary"
          type="text"
          defaultValue={formState.excerpt}
          disabled={isPending}
        />

        <MarkdownEditor
          labelText="Content"
          value={contentValue}
          setValue={setContentValue}
          textAreaName="content"
          disabled={isPending}
        />

        <ImageUploader disabled={isPending} />

        <InputText
          labelText="Cover image URL"
          name="coverImageUrl"
          placeholder="Enter the image URL"
          type="text"
          defaultValue={formState.coverImageUrl}
          disabled={isPending}
        />

        {mode === "update" && (
          <InputCheckbox
            labelText="Publish?"
            name="published"
            type="checkbox"
            defaultChecked={formState.published}
            disabled={isPending}
          />
        )}

        <div className="mt-4">
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
