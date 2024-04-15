import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters");

export const signUpSchema = z.object({
  username: userNameValidation,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Please Enter Valid Email" }),
});
