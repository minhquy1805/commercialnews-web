"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getApiErrorDescription } from "@/shared/api/apiError";
import type { CurrentUserResponse } from "../../types/auth.types";
import {
  updateMyProfileSchema,
  type UpdateMyProfileFormValues,
} from "../../schemas/auth.schemas";
import { useUpdateMyProfile } from "../../hooks/useUpdateMyProfile";

type EditProfileFormProps = {
  profile: CurrentUserResponse;
};

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const updateMyProfileMutation = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateMyProfileFormValues>({
    resolver: zodResolver(updateMyProfileSchema),
    defaultValues: {
      fullName: profile.fullName ?? "",
    },
  });

  useEffect(() => {
    reset({
      fullName: profile.fullName ?? "",
    });
  }, [profile.fullName, reset]);

  const onSubmit = async (values: UpdateMyProfileFormValues) => {
    try {
      await updateMyProfileMutation.mutateAsync(values);

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile information has been updated successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });

      reset({
        fullName: values.fullName.trim(),
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: getApiErrorDescription(
          error,
          "Unable to update your profile. Please try again.",
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
          Editable information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your public display name. Email cannot be changed here.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl">
        <div>
          <label
            htmlFor="fullName"
            className="text-sm font-semibold text-slate-700"
          >
            Full name
          </label>

          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            {...register("fullName")}
            className="mt-2 block h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          />

          {errors.fullName ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.fullName.message}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Leave this empty if you want to remove your display name.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={updateMyProfileMutation.isPending || !isDirty}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {updateMyProfileMutation.isPending
              ? "Updating..."
              : "Update profile"}
          </button>

          <button
            type="button"
            onClick={() =>
              reset({
                fullName: profile.fullName ?? "",
              })
            }
            disabled={updateMyProfileMutation.isPending || !isDirty}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}