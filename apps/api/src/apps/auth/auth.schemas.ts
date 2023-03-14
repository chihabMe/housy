import * as z from "zod";
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "An 8 charters password or more  is required")
    .max(
      20,
      "20 character is the max number of characters you can use in your password"
    ),
});
