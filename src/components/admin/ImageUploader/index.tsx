"use client";

import { uploadImageAction } from "@/actions/upload-action-image";
import { Button } from "@/components/Button";
import { ImageUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

type ImageUploaderProps = {
  disabled?: boolean;
};

export function ImageUploader({ disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageURl, setImgUrl] = useState("");

  function handleChooseFile() {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  }

  function handleChange() {
    if (!fileInputRef.current) {
      setImgUrl("");
      return;
    }

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      setImgUrl("");
      return;
    }

    const uploadMaxSize =
      Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;
    if (file.size > uploadMaxSize) {
      const readableMaxSize = (uploadMaxSize / 1024).toFixed(2);

      toast.error(`Image to big. Max.: ${readableMaxSize}KB.`);

      fileInput.value = "";
      setImgUrl("");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    uploadImageAction(formData)
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
          setImgUrl("");
          return;
        }
        setImgUrl(result.url);
        toast.success("Image was sent");
      })
      .catch((err) => {
        console.error("uploadImageAction failed", err);
        toast.error("Failed to upload image");
        setImgUrl("");
      })
      .finally(() => {
        setIsUploading(false);
      });

    fileInput.value = "";
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <Button
        onClick={handleChooseFile}
        type="button"
        className="self-start"
        disabled={isUploading || disabled}
      >
        <ImageUpIcon />
        Send an image
      </Button>
      {!!imageURl && (
        <div className="flex flex-col gap-4">
          <p>
            <b>URL:</b> {imageURl}
          </p>

          {/* eslint-disable-next-line */}
          <img className="rounded-lg" src={imageURl} />
        </div>
      )}
      <input
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        name="file"
        type="file"
        accept="image/*"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
