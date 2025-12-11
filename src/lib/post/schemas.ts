import { isUrlOrRelativePath } from "@/utils/is-url-or-relative-path";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { PublicUserSchema } from "../user/schema";

const PostBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must have at least 3 characters")
    .max(120, "Title must have at most 120 characters"),
  content: z
    .string()
    .trim()
    .min(3, "Content is required")
    .transform((val) => sanitizeHtml(val)),
  author: z
    .string()
    .trim()
    .min(4, "Author must have at least 4 characters")
    .max(100, "Author name must have at most 100 characters"),
  excerpt: z
    .string()
    .trim()
    .min(3, "Excerpt must have at least 3 characters")
    .max(200, "Excerpt must have at most 200 characters"),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: "Cover image must be a URL or a relative path",
  }),
  alt: z.string(),
  published: z
    .union([
      z.literal("on"),
      z.literal("true"),
      z.literal("false"),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform((val) => val === "on" || val === "true" || val === true),
});

export const PostCreateSchema = PostBaseSchema;

export const PostUpdateSchema = PostBaseSchema.extend({});

export const CreatePostForApiSchema = PostBaseSchema.omit({
  author: true,
  published: true,
}).extend({});

export const UpdatePostForApiSchema = PostBaseSchema.omit({
  author: true,
}).extend({});

export const PublicPostForApiSchema = PostBaseSchema.extend({
  id: z.string().default(""),
  slug: z.string().default(""),
  title: z.string().default(""),
  alt: z.string().default(""),
  excerpt: z.string().default(""),
  author: PublicUserSchema.optional().default({
    id: "",
    email: "",
    name: "",
  }),
  content: z.string().default(""),
  coverImageUrl: z.string().default(""),
  createdAt: z.string().default(""),
});

export type CreatePostForApiDto = z.infer<typeof CreatePostForApiSchema>;
export type UpdatePostForApiDto = z.infer<typeof UpdatePostForApiSchema>;
export type PublicPostForApiDto = z.infer<typeof PublicPostForApiSchema>;
