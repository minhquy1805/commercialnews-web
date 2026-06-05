import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required." })
    .max(320, { error: "Email must be at most 320 characters." })
    .pipe(z.email({ error: "Email is invalid." })),

  password: z
    .string()
    .min(1, { error: "Password is required." })
    .max(200, { error: "Password must be at most 200 characters." }),

  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
