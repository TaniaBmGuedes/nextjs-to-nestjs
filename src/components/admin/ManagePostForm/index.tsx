"use client";

import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useActionState, useEffect, useState } from "react";
import { InputCheckbox } from "@/components/InputChecbox";
import { makePublicPost, PublicPost } from "@/app/admin/post/dto/post/dto";
import { createPostAction } from "@/actions/post/create-post-action";
import { toast } from "react-toastify";
import { updatePostAction } from "@/actions/post/update-post-action";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageUploader } from "../ImageUploader";

type ManagePostFormUpdateProps = {
  mode: "update";
  publicPost: PublicPost;
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

  const initialValue = {
    formState: makePublicPost(publicPost ?? {}),
    errors: [],
  };

  const [state, action, isPending] = useActionState(
    actionsMap[mode],
    initialValue
  );

  const { formState } = state;
  const [contentValue, setContentValue] = useState(publicPost?.content || "");

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach((error) => toast.error(error));
    }
  }, [state.errors]);

  useEffect(() => {
    if (created === "1") {
      toast.dismiss();
      toast.success("Post created with sucess");
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.toString());
    }
  }, [created, router]);

  return (
    <form
      action={action}
      className="mt-5 bg-white shadow-sm border border-gray-200 rounded-xl p-8 space-y-10"
    >
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
          Create New Post
        </h2>
        <p className="text-gray-500">
          Fill out the information below to publish a new post.
        </p>
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-medium text-gray-800">Post Metadata</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            labelText="ID"
            name="id"
            placeholder="Random ID"
            type="text"
            readOnly
            disabled={isPending}
            defaultValue={formState?.id || ""}
          />

          <InputText
            labelText="Slug"
            name="slug"
            placeholder="Random Slug"
            type="text"
            readOnly
            disabled={isPending}
            defaultValue={formState?.slug || ""}
          />

          <InputText
            labelText="Author"
            name="author"
            placeholder="Type the author name"
            type="text"
            disabled={isPending}
            defaultValue={formState?.author || ""}
          />

          <InputText
            labelText="Title"
            name="title"
            placeholder="Type the title"
            type="text"
            defaultValue={formState?.title || ""}
            disabled={isPending}
          />

          <InputText
            labelText="Excerpt"
            name="excerpt"
            placeholder="Short summary"
            type="text"
            disabled={isPending}
            defaultValue={formState?.excerpt || ""}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-medium text-gray-800">Content</h3>

        <MarkdownEditor
          labelText="Write your content"
          value={contentValue}
          setValue={setContentValue}
          disabled={isPending}
          textAreaName="content"
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-medium text-gray-800">Cover Image</h3>

        <ImageUploader disabled={isPending} />

        <InputText
          labelText="Image URL"
          name="coverImageUrl"
          placeholder="Paste the image URL"
          disabled={isPending}
          type="text"
        />
      </section>

      <section className="space-y-4 border-t pt-6">
        <InputCheckbox
          labelText="Do you want publish post now?"
          name="published"
          type="checkbox"
          defaultChecked={formState?.published || false}
          disabled={isPending}
        />

        {!!actionsMap.create && (
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 px-6 py-3 text-lg"
          >
            Save Post
          </Button>
        )}
        {!actionsMap.create && (
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 px-6 py-3 text-lg"
          >
            Publish Post
          </Button>
        )}
      </section>
    </form>
  );
}
