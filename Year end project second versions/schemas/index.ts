import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const SettingProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  id: z.string().min(1),
});

export const ResetPasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export const CreateCommentSchema = z.object({
  travelId: z.string(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  rating: z.number().min(1).max(5),
  description: z.string().min(6, {
    message: "Description must be at least 6 characters long",
  }),
});

export const ChangeEmailSchema = z.object({
  currentEmail: z.string(),
  newEmail: z.string(),
});

export const CreateHikingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(6),
  difficultyId: z.string().min(1),
  travelPoints: z.array(z.tuple([z.number(), z.number()])),
});

export const FindHikingSchema = z.object({
  city: z.string().min(3),
  difficultyId: z.string().optional(),
  rating: z.string().optional(),
  minLength: z.string().optional(),
  maxLength: z.string().optional(),
});