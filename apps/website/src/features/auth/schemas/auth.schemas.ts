import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(320, "Email must be at most 320 characters")
    .pipe(z.email("Email format is invalid")),

  password: z
    .string()
    .min(1, "Password is required")
    .max(200, "Password must be at most 200 characters")
    .refine((value) => value.trim().length > 0, {
      message: "Password is required",
    }),

  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .max(200, "Full name must be at most 200 characters")
      .optional()
      .or(z.literal("")),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(320, "Email must be at most 320 characters")
      .pipe(z.email("Email format is invalid")),

    password: z
      .string()
      .min(1, "Password is required")
      .max(200, "Password must be at most 200 characters")
      .refine((value) => value.trim().length > 0, {
        message: "Password is required",
      })
      .refine((value) => value.length >= 12, {
        message: "Password must be at least 12 characters",
      }),

    confirmPassword: z.string().min(1, "Confirm password is required"),

    acceptTerms: z.boolean().refine((value) => value, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Verification token is required")
    .max(500, "Verification token is invalid"),
});

export const resendVerificationEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(320, "Email must be at most 320 characters")
    .pipe(z.email("Email format is invalid")),
});

export const updateMyProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(200, "Full name must not exceed 200 characters."),
});

export type UpdateMyProfileFormValues = z.infer<
  typeof updateMyProfileSchema
>;

export const AVATAR_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const AVATAR_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const AVATAR_FILE_ACCEPT =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export const updateMyAvatarSchema = z.object({
  file: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "Avatar file is required.",
    )
    .refine((file) => file.size > 0, {
      message: "Avatar file is required.",
    })
    .refine((file) => file.size <= AVATAR_MAX_FILE_SIZE_BYTES, {
      message: "Avatar must not exceed 5 MB.",
    })
    .refine((file) => AVATAR_ALLOWED_MIME_TYPES.includes(file.type as never), {
      message: "Only JPG, PNG and WebP images are allowed.",
    }),
});

export type UpdateMyAvatarFormValues = z.infer<typeof updateMyAvatarSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .max(200, "Current password must be at most 200 characters.")
      .refine((value) => value.trim().length > 0, {
        message: "Current password is required.",
      }),

    newPassword: z
      .string()
      .min(1, "New password is required.")
      .max(200, "New password must be at most 200 characters.")
      .refine((value) => value.trim().length >= 12, {
        message: "New password must be at least 12 characters.",
      }),

    confirmNewPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmNewPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "The two passwords do not match.",
      });
    }

    if (value.newPassword === value.currentPassword) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "New password must be different from current password.",
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const myLoginHistoryQuerySchema = z.object({
  succeeded: z.boolean().nullable().optional(),
  fromAttemptedAt: z.string().nullable().optional(),
  toAttemptedAt: z.string().nullable().optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

export type MyLoginHistoryQueryValues = z.infer<
  typeof myLoginHistoryQuerySchema
>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(320, "Email must be at most 320 characters")
    .pipe(z.email("Email format is invalid")),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, "Reset token is required")
      .max(500, "Reset token is invalid"),

    newPassword: z
      .string()
      .min(1, "New password is required")
      .max(200, "New password must be at most 200 characters")
      .refine((value) => value.trim().length >= 12, {
        message: "New password must be at least 12 characters",
      }),

    confirmNewPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "The two passwords do not match",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationEmailFormValues = z.infer<typeof resendVerificationEmailSchema>;