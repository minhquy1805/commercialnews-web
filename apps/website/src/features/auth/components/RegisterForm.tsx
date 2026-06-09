"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegister } from "@/features/auth/hooks/useRegister";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { PasswordInput } from "./PasswordInput";

export function RegisterForm() {
  const {
    register: registerAccount,
    isLoading,
    errorMessage,
    registeredUser,
    clearError,
  } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(registerAccount)}
      className="space-y-4 md:space-y-5"
    >
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      {registeredUser ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          Account created successfully.
          {registeredUser.requiresEmailVerification
            ? " Please check your email to verify your account."
            : ""}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Full name
        </label>

        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Nguyen Minh Quy"
          aria-invalid={errors.fullName ? "true" : "false"}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          disabled={isLoading}
          {...registerField("fullName", { onChange: clearError })}
          className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white"
        />

        {errors.fullName ? (
          <p
            id="fullName-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {errors.fullName.message}
          </p>
        ) : null}
      </div>

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
          {...registerField("email", { onChange: clearError })}
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
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          disabled={isLoading}
          {...registerField("password", { onChange: clearError })}
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Confirm password
        </label>

        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
          disabled={isLoading}
          {...registerField("confirmPassword", { onChange: clearError })}
          showLabel="Show confirm password"
          hideLabel="Hide confirm password"
          className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white"
        />

        {errors.confirmPassword ? (
          <p
            id="confirmPassword-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="acceptTerms"
            type="checkbox"
            aria-invalid={errors.acceptTerms ? "true" : "false"}
            aria-describedby={
              errors.acceptTerms ? "acceptTerms-error" : undefined
            }
            disabled={isLoading}
            {...registerField("acceptTerms", { onChange: clearError })}
            className="size-4 rounded border border-slate-300 bg-slate-50 accent-slate-950"
          />
        </div>

        <div className="ml-3 text-sm">
          <label htmlFor="acceptTerms" className="font-normal text-slate-600">
            I accept the{" "}
            <Link
              href="/terms"
              className="font-semibold text-slate-900 transition hover:text-blue-600"
            >
              Terms and Conditions
            </Link>
          </label>

          {errors.acceptTerms ? (
            <p
              id="acceptTerms-error"
              className="mt-2 text-sm font-medium text-red-600"
            >
              {errors.acceptTerms.message}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        {isLoading ? "Creating account..." : "Create an account"}
      </button>

      <p className="text-sm font-normal text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Sign in here
        </Link>
      </p>
    </form>
  );
}
