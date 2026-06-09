"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getApiErrorDescription } from "@/shared/api/apiError";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schemas";
import { useForgotPassword } from "../hooks/useForgotPassword";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync(values);

      await Swal.fire({
        icon: "success",
        title: "Check your email",
        text:
          response.message ||
          "If the email exists, a password reset link has been sent.",
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Request failed",
        text: getApiErrorDescription(
          error,
          "Unable to request password reset. Please try again.",
        ),
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="text-sm font-semibold text-slate-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className="mt-2 block h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
        />

        {errors.email ? (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {forgotPasswordMutation.isPending
          ? "Sending reset link..."
          : "Send reset link"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-950 hover:text-blue-600"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}