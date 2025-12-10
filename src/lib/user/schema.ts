import { z } from "zod";

const CreateUserBase = z.object({
  name: z.string().trim().min(4, "Name must have at least 4 characters"),
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z
    .string()
    .trim()
    .min(6, "Password must have at least 6 characters"),
  password2: z
    .string()
    .trim()
    .min(6, "Password confirmation must have at least 6 characters"),
});

export const CreateUserSchema = CreateUserBase.refine(
  (data) => {
    return data.password === data.password2;
  },
  {
    path: ["password2"],
    message: "Passwords do not match",
  }
).transform(({ email, name, password }) => {
  return {
    name,
    email,
    password,
  };
});

export const PublicUserSchema = z.object({
  id: z.string().default(""),
  name: z.string().default(""),
  email: z.string().default(""),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(6, "Password must have at least 6 characters"),
    newPassword: z
      .string()
      .trim()
      .min(6, "New password must have at least 6 characters"),
    newPassword2: z
      .string()
      .trim()
      .min(6, "New password confirmation must have at least 6 characters"),
  })
  .refine(
    (data) => {
      return data.newPassword === data.newPassword2;
    },
    {
      path: ["newPassword2"],
      message: "Passwords do not match",
    }
  )
  .transform(({ currentPassword, newPassword }) => {
    return {
      currentPassword,
      newPassword,
    };
  });

export const UpdateUserSchema = CreateUserBase.omit({
  password: true,
  password2: true,
}).extend({});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type PublicUserDto = z.infer<typeof PublicUserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
