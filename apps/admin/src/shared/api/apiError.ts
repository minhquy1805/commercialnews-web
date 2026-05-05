import axios from "axios";

export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
};

export type ApiErrorResponse = {
  traceId?: string;
  error?: ApiErrorBody;
};

export function getApiErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return undefined;
  }

  return error.response?.data?.error?.code;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return undefined;
  }

  return error.response?.status;
}

export function getApiErrorTraceId(error: unknown): string | undefined {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return undefined;
  }

  return error.response?.data?.traceId;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const responseMessage = error.response?.data?.error?.message;

  if (responseMessage) {
    return responseMessage;
  }

  const status = error.response?.status;

  if (status === 400) {
    return "Invalid request.";
  }

  if (status === 401) {
    return "Authentication is required or your session has expired.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource was not found.";
  }

  if (status === 409) {
    return "The request conflicts with current system state.";
  }

  if (status === 429) {
    return "Too many requests. Please try again later.";
  }

  if (status && status >= 500) {
    return "The server encountered an error. Please try again later.";
  }

  return fallbackMessage;
}