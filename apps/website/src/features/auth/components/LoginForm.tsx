"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { PasswordInput } from "./PasswordInput";

export function LoginForm() {
  const { login, isLoading, errorMessage, clearError } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4 md:space-y-5">
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isLoading}
          {...register("email", { onChange: clearError })}
          className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white"
        />

        {errors.email ? (
          <p id="email-error" className="mt-2 text-sm font-medium text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Password
        </label>

        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          disabled={isLoading}
          {...register("password", { onChange: clearError })}
          className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white"
        />

        {errors.password ? (
          <p
            id="password-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            id="rememberMe"
            type="checkbox"
            disabled={isLoading}
            {...register("rememberMe", { onChange: clearError })}
            className="size-4 rounded border border-slate-300 bg-slate-50 accent-slate-950"
          />

          <span>Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-slate-950 transition hover:text-blue-600"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-sm font-normal text-slate-600">
        Do not have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Create one here
        </Link>
      </p>
    </form>
  );
}
