import * as z from "zod";
export const registrationSchema = z
  .object({
    username: z.string(),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "An 8 charters password or more  is required")
      .max(
        20,
        "20 character is the max number of characters you can use in your password"
      ),
    rePassword: z.string(),
  })
  .refine((data) => data.password != data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export const passwordChangeSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "An 8 charters password or more  is required")
      .max(
        20,
        "20 character is the max number of characters you can use in your password"
      ),
    newPassword: z
      .string()
      .min(8, "An 8 charters password or more  is required")
      .max(
        20,
        "20 character is the max number of characters you can use in your password"
      ),
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword == data.newPasswordConfirmation, {
    message: "Passwords don't match",
    path: ["newPasswordConfirmation"],
  });
