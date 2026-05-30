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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectDetailMessages(
  value: unknown,
  path = "",
  messages: string[] = [],
): string[] {
  if (!value) {
    return messages;
  }

  if (typeof value === "string") {
    messages.push(path ? `${path}: ${value}` : value);
    return messages;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectDetailMessages(item, path, messages));
    return messages;
  }

  if (!isRecord(value)) {
    return messages;
  }

  const field =
    value.field ??
    value.propertyName ??
    value.property ??
    value.name ??
    value.key;
  const message =
    value.message ??
    value.errorMessage ??
    value.reason ??
    value.description;

  if (typeof message === "string") {
    const fieldLabel = typeof field === "string" ? field : path;
    messages.push(fieldLabel ? `${fieldLabel}: ${message}` : message);
    return messages;
  }

  if (isRecord(value.errors)) {
    collectDetailMessages(value.errors, path, messages);
    return messages;
  }

  Object.entries(value).forEach(([key, item]) => {
    if (["code", "message", "traceId"].includes(key)) {
      return;
    }

    collectDetailMessages(item, key, messages);
  });

  return messages;
}

export function getApiErrorDetailsMessage(
  error: unknown,
  maxMessages = 6,
): string | undefined {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return undefined;
  }

  const details = error.response?.data?.error?.details;
  const messages = [...new Set(collectDetailMessages(details))].filter(Boolean);

  if (messages.length === 0) {
    return undefined;
  }

  const displayedMessages = messages.slice(0, maxMessages);
  const remainingCount = messages.length - displayedMessages.length;

  return remainingCount > 0
    ? `${displayedMessages.join("; ")}; and ${remainingCount} more.`
    : displayedMessages.join("; ");
}

export function getApiErrorDescription(
  error: unknown,
  fallbackMessage = "Please try again."
): string {
  const message = getApiErrorMessage(error, fallbackMessage);
  const detailsMessage = getApiErrorDetailsMessage(error);

  if (!detailsMessage || detailsMessage === message) {
    return message;
  }

  return `${message} ${detailsMessage}`;
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
