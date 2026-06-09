"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getApiErrorDescription } from "@/shared/api/apiError";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schemas";
import { useResetPassword } from "../hooks/useResetPassword";
import { PasswordInput } from "./PasswordInput";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const response = await resetPasswordMutation.mutateAsync(values);

      if (!response.passwordReset) {
        await Swal.fire({
          icon: "warning",
          title: "Password not reset",
          text: "The server did not confirm the password reset.",
          confirmButtonText: "OK",
          confirmButtonColor: "#020617",
        });

        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Password reset",
        text: "Your password has been reset successfully. Please sign in again.",
        confirmButtonText: "Sign in",
        confirmButtonColor: "#020617",
      });

      router.replace("/login");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Reset failed",
        text: getApiErrorDescription(
          error,
          "Unable to reset your password. Please try again.",
        ),
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-950">
          Reset link is invalid
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          The reset token is missing. Please request a new password reset link.
        </p>

        <div className="mt-6">
          <Link
            href="/forgot-password"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register("token")} />

      <div>
        <label
          htmlFor="newPassword"
          className="text-sm font-semibold text-slate-700"
        >
          New password
        </label>

        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          placeholder="Enter your new password"
          {...register("newPassword")}
          containerClassName="mt-2"
          className="block h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
        />

        {errors.newPassword ? (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.newPassword.message}
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Use at least 12 characters.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmNewPassword"
          className="text-sm font-semibold text-slate-700"
        >
          Confirm new password
        </label>

        <PasswordInput
          id="confirmNewPassword"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          {...register("confirmNewPassword")}
          showLabel="Show confirm password"
          hideLabel="Hide confirm password"
          containerClassName="mt-2"
          className="block h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
        />

        {errors.confirmNewPassword ? (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {resetPasswordMutation.isPending
          ? "Resetting password..."
          : "Reset password"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Back to{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-950 hover:text-blue-600"
        >
          sign in
        </Link>
      </p>
    </form>
  );
}
