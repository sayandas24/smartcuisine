import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(4, "Password must be at least 4 characters"),
  confirmNewPassword: z
    .string()
    .min(4, "Password must be at least 4 characters"),
});

export const updateNameSchema = z.object({
  username: usernameValidation,
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits",
    })
    .optional(),
});
