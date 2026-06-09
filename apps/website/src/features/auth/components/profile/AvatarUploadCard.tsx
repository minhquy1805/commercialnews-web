"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { getApiErrorDescription } from "@/shared/api/apiError";
import type { CurrentUserResponse } from "../../types/auth.types";
import {
  AVATAR_FILE_ACCEPT,
  updateMyAvatarSchema,
} from "../../schemas/auth.schemas";
import { useUpdateMyAvatar } from "../../hooks/useUpdateMyAvatar";

type AvatarUploadCardProps = {
  profile: CurrentUserResponse;
};

function getDisplayName(profile: CurrentUserResponse) {
  return profile.fullName?.trim() || profile.email;
}

function getAvatarInitial(displayName: string) {
  return displayName.charAt(0).toUpperCase();
}

export function AvatarUploadCard({ profile }: AvatarUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateMyAvatarMutation = useUpdateMyAvatar();

  const displayName = getDisplayName(profile);
  const avatarInitial = getAvatarInitial(displayName);

  const selectedPreviewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedPreviewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  const clearSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const parsed = updateMyAvatarSchema.safeParse({
      file,
    });

    if (!parsed.success) {
      event.currentTarget.value = "";
      setSelectedFile(null);

      await Swal.fire({
        icon: "warning",
        title: "Invalid avatar file",
        text:
          parsed.error.issues[0]?.message ??
          "Please choose a valid avatar image.",
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });

      return;
    }

    setSelectedFile(parsed.data.file);
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      await Swal.fire({
        icon: "warning",
        title: "No avatar selected",
        text: "Please choose an avatar image before uploading.",
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });

      return;
    }

    try {
      await updateMyAvatarMutation.mutateAsync({
        file: selectedFile,
      });

      clearSelectedFile();

      await Swal.fire({
        icon: "success",
        title: "Avatar updated",
        text: "Your avatar has been updated successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Avatar update failed",
        text: getApiErrorDescription(
          error,
          "Unable to update your avatar. Please try again.",
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
          Avatar
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload a JPG, PNG, or WebP image. Maximum file size is 5 MB.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex size-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {selectedPreviewUrl ? (
            <div
              aria-label="Selected avatar preview"
              className="size-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${selectedPreviewUrl})`,
              }}
            />
          ) : profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={displayName}
              width={112}
              height={112}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-slate-950 text-3xl font-bold text-white">
              {avatarInitial}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-950">
            {selectedFile ? selectedFile.name : "No new avatar selected"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            The selected image will replace your current avatar after upload.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleChooseFile}
              disabled={updateMyAvatarMutation.isPending}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Choose file
            </button>

            <button
              type="button"
              onClick={handleUploadAvatar}
              disabled={!selectedFile || updateMyAvatarMutation.isPending}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {updateMyAvatarMutation.isPending
                ? "Uploading..."
                : "Upload avatar"}
            </button>

            <button
              type="button"
              onClick={clearSelectedFile}
              disabled={!selectedFile || updateMyAvatarMutation.isPending}
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Use current avatar
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={AVATAR_FILE_ACCEPT}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </section>
  );
}