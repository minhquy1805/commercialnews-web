"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getApiErrorDescription } from "@/shared/api/apiError";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../schemas/auth.schemas";
import { useChangePassword } from "../../hooks/useChangePassword";
import { PasswordInput } from "../PasswordInput";

export function ChangePasswordForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const response = await changePasswordMutation.mutateAsync(values);

      if (!response.passwordChanged) {
        await Swal.fire({
          icon: "warning",
          title: "Password not changed",
          text: "The server did not confirm the password change.",
          confirmButtonText: "OK",
          confirmButtonColor: "#020617",
        });

        return;
      }

      reset();

      await Swal.fire({
        icon: "success",
        title: "Password changed",
        text: "Your password has been changed successfully. Please sign in again.",
        confirmButtonText: "Sign in",
        confirmButtonColor: "#020617",
      });

      tokenStorage.clearAccessToken();

      queryClient.removeQueries({
        queryKey: ["auth"],
      });

      router.replace("/login");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Change password failed",
        text: getApiErrorDescription(
          error,
          "Unable to change your password. Please try again.",
        ),
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-950">
          Change password
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use a strong password with at least 12 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl">
        <div>
          <label
            htmlFor="currentPassword"
            className="text-sm font-semibold text-slate-700"
          >
            Current password
          </label>

          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            placeholder="Enter your current password"
            {...register("currentPassword")}
            showLabel="Show current password"
            hideLabel="Hide current password"
            containerClassName="mt-2"
            className="block h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          />

          {errors.currentPassword ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.currentPassword.message}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
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
          ) : null}
        </div>

        <div className="mt-5">
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

        <div className="mt-6">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {changePasswordMutation.isPending
              ? "Changing password..."
              : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}
