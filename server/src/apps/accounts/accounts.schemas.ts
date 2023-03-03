import * as z from "zod";

export const accountActivationSchema = z.object({
  email: z.string().email(),
});
