"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendVerificationEmail } from "../hooks/useResendVerificationEmail";
import { resendVerificationEmailSchema } from "../schemas/auth.schemas";
import { tokenStorage } from "@/shared/auth/tokenStorage";

function subscribeToAuthStore() {
  return () => {};
}

function getAuthSnapshot() {
  return Boolean(tokenStorage.getAccessToken());
}

function getServerSnapshot() {
  return false;
}

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getServerSnapshot,
  );

  const hasVerifiedRef = useRef(false);

  const { verifyEmail, isLoading, errorMessage, result } = useVerifyEmail();

  const {
    resendVerificationEmail,
    isLoading: isResending,
    canResend,
    cooldownRemaining,
    errorMessage: resendErrorMessage,
    successMessage: resendSuccessMessage,
  } = useResendVerificationEmail();

  const parsedResendEmail = resendVerificationEmailSchema.safeParse({
    email,
  });

  const canUseResendEmail = parsedResendEmail.success;

  const handleResendVerificationEmail = async () => {
    if (!parsedResendEmail.success) {
      return;
    }

    await resendVerificationEmail(parsedResendEmail.data.email);
  };

  useEffect(() => {
    if (token || !isAuthenticated) {
      return;
    }

    router.replace("/");
  }, [isAuthenticated, router, token]);

  useEffect(() => {
    if (!token || hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;
    void verifyEmail(token);
  }, [token, verifyEmail]);

  if (!token && isAuthenticated) {
    return null;
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="size-7"
          >
            <path
              d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.53 5.33a2.25 2.25 0 0 1-2.44 0L2.25 6.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
          Check your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          We sent a verification link
          {email ? (
            <>
              {" "}
              to <span className="font-semibold text-slate-900">{email}</span>
            </>
          ) : null}
          . Open the email and click the link to activate your account.
        </p>

        {!email ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            Email address is missing. Please register again or contact support.
          </p>
        ) : null}

        {resendSuccessMessage ? (
          <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {resendSuccessMessage}
          </p>
        ) : null}

        {resendErrorMessage ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {resendErrorMessage}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleResendVerificationEmail}
            disabled={!canUseResendEmail || !canResend}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isResending
              ? "Sending..."
              : cooldownRemaining > 0
                ? `Resend in ${cooldownRemaining}s`
                : "Resend verification email"}
          </button>

          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Verifying your email...
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Please wait while we verify your account.
        </p>
      </div>
    );
  }

  if (result?.verified) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="size-7"
          >
            <path
              d="M4.5 12.75 10.5 18.75 19.5 5.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
          Email verified
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account is now active. You can continue using Commercial News.
        </p>

        <div className="mt-8">
          <Link
            href={isAuthenticated ? "/" : "/login"}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {isAuthenticated ? "Go to home" : "Sign in"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
          className="size-7"
        >
          <path
            d="M12 9v4m0 4h.01M4.93 19.07a10 10 0 1 1 14.14 0 10 10 0 0 1-14.14 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
        Verification failed
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {errorMessage ?? "Your verification link is invalid or has expired."}
      </p>

      <div className="mt-8">
        <Link
          href={isAuthenticated ? "/" : "/login"}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {isAuthenticated ? "Go to home" : "Back to sign in"}
        </Link>
      </div>
    </div>
  );
}