"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getApiErrorDescription } from "@/shared/api/apiError";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { useLogoutAllSessions } from "../../hooks/useLogoutAllSessions";

export function LogoutAllSessionsCard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutAllSessionsMutation = useLogoutAllSessions();

  const handleLogoutAllSessions = async () => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Logout all sessions?",
      text: "This will sign out your account from all devices and browsers, including this one.",
      showCancelButton: true,
      confirmButtonText: "Logout all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const response = await logoutAllSessionsMutation.mutateAsync();

      if (!response.loggedOutAllSessions) {
        await Swal.fire({
          icon: "warning",
          title: "Logout not confirmed",
          text: "The server did not confirm logging out all sessions.",
          confirmButtonText: "OK",
          confirmButtonColor: "#020617",
        });

        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Logged out all sessions",
        text: "All sessions for your account have been logged out.",
        confirmButtonText: "Sign in again",
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
        title: "Logout all sessions failed",
        text: getApiErrorDescription(
          error,
          "Unable to logout all sessions. Please try again.",
        ),
        confirmButtonText: "OK",
        confirmButtonColor: "#020617",
      });
    }
  };

  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-red-950">
          Logout all sessions
        </h2>

        <p className="mt-2 text-sm leading-6 text-red-700">
          This will sign out your account from all devices and browsers. Use
          this if you think your account is active somewhere you do not
          recognize.
        </p>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleLogoutAllSessions}
          disabled={logoutAllSessionsMutation.isPending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="size-4"
          >
            <path
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 12h8.25m0 0-3-3m3 3-3 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {logoutAllSessionsMutation.isPending
            ? "Logging out..."
            : "Logout all sessions"}
        </button>
      </div>
    </section>
  );
}