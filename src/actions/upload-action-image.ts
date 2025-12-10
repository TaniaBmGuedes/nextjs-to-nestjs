"use server";

import { verifyLoginSession } from "@/lib/login/manage-login";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";

type UploadImageActionResult = {
  url: string;
  error: string;
};

export default async function uploadImageAction(
  formData: FormData
): Promise<UploadImageActionResult> {
  const makeResult = ({ url = "", error = "" }) => ({ url, error });
  const isAuthenticated = await verifyLoginSession();
  if (!isAuthenticated) {
    return makeResult({ error: "Login again" });
  }

  if (!(formData instanceof FormData)) {
    return makeResult({ error: "Invalided data" });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return makeResult({ error: "Invalid file" });
  }

  if (file.size > Number(process.env.IMAGE_UPLOAD_MAX_SIZE) || 921600) {
    return makeResult({ error: "Image is so big" });
  }

  if (!file.type.startsWith("image/")) {
    return makeResult({ error: "Invalided image" });
  }

  const imageExtension = extname(file.name);
  const uniqueImageName = `${Date.now()}${imageExtension}`;
  const uploadDir = process.env.IMAGE_UPLOAD_DIRECTORY || "uploads";
  const uploadFullPath = resolve(process.cwd(), "public", uploadDir);

  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);

  await mkdir(uploadFullPath, { recursive: true });

  const fileFullPath = resolve(uploadFullPath, uniqueImageName);

  await writeFile(fileFullPath, buffer);

  const imgServerUrl =
    process.env.IMAGE_SERVER_URL || "http://localhost:3000/uploads";
  const url = `${imgServerUrl}/${uniqueImageName}`;

  return makeResult({ url });
}
