"use client";

import { useState } from "react";
import type { LoginHistoryItemResponse } from "../../types/auth.types";
import { useMyLoginHistory } from "../../hooks/useMyLoginHistory";

function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getStatusBadge(succeeded: boolean) {
  if (succeeded) {
    return (
      <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        Success
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
      Failed
    </span>
  );
}

export function LoginHistoryTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loginHistoryQuery = useMyLoginHistory({
    page,
    pageSize,
  });

  const items = loginHistoryQuery.data?.items ?? [];
  const totalItems = loginHistoryQuery.data?.totalItems ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-950">
          Login history
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review recent sign-in attempts for your account.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <TableHeader>Status</TableHeader>
                <TableHeader>Attempted at</TableHeader>
                <TableHeader>IP address</TableHeader>
                <TableHeader>Failure reason</TableHeader>
                <TableHeader>User agent</TableHeader>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loginHistoryQuery.isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm font-medium text-slate-500"
                  >
                    Loading login history...
                  </td>
                </tr>
              ) : loginHistoryQuery.isError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm font-medium text-red-600"
                  >
                    Could not load login history.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm font-medium text-slate-500"
                  >
                    No login history.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <LoginHistoryRow key={item.loginId} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalPages}</span>
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canGoPrevious || loginHistoryQuery.isFetching}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={!canGoNext || loginHistoryQuery.isFetching}
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

type LoginHistoryRowProps = {
  item: LoginHistoryItemResponse;
};

function LoginHistoryRow({ item }: LoginHistoryRowProps) {
  return (
    <tr className="align-top">
      <td className="px-4 py-4">{getStatusBadge(item.succeeded)}</td>

      <td className="px-4 py-4 text-sm font-medium text-slate-900">
        {formatDateTime(item.attemptedAt)}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {item.ipAddress ?? "N/A"}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {item.failureReason ?? "N/A"}
      </td>

      <td className="max-w-xs truncate px-4 py-4 text-sm text-slate-600">
        {item.userAgent ?? "N/A"}
      </td>
    </tr>
  );
}

type TableHeaderProps = {
  children: React.ReactNode;
};

function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
      {children}
    </th>
  );
}